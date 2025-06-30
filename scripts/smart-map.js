import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import { parse } from 'fast-csv';
import { format } from 'fast-csv';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_CSV = path.join(__dirname, 'data_source', 'lilgrant_international_playlist_masterfile.csv');
const OUTPUT_CSV = path.join(__dirname, 'data_source', 'lilgrant_data_mapped.csv');
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('❌ API_KEY not found in environment variables');
  process.exit(1);
}

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

async function fetchApiDirectory() {
  console.log('📡 Fetching all school names and IDs from College Scorecard API...');
  const baseUrl = 'https://api.data.gov/ed/collegescorecard/v1/schools';
  const allSchools = [];
  let page = 0;
  let totalPages = 1;
  let totalResults = 0;
  do {
    page++;
    const params = new URLSearchParams({
      'api_key': API_KEY,
      'fields': 'id,school.name',
      'per_page': '100',
      'page': (page - 1).toString()
    });
    let retry = 0;
    while (true) {
      try {
        const response = await fetch(`${baseUrl}?${params}`);
        if (response.status === 429) {
          const waitTime = Math.min(60000 * (retry + 1), 5 * 60 * 1000); // Exponential backoff, max 5 min
          console.warn(`⏳ 429 Too Many Requests. Waiting ${waitTime / 1000}s before retrying page ${page} (retry #${retry + 1})...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retry++;
          continue;
        }
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (page === 1) {
          totalResults = data.metadata.total;
          totalPages = Math.ceil(totalResults / 100);
          console.log(`📈 Total schools found: ${totalResults} (${totalPages} pages)`);
        }
        if (data.results && Array.isArray(data.results)) {
          for (const school of data.results) {
            allSchools.push({
              id: school.id,
              name: school['school.name'],
              normalizedName: normalizeName(school['school.name'])
            });
          }
        }
        if (page < totalPages) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay between pages
        }
        break; // Success, break retry loop
      } catch (error) {
        if (retry >= 5) {
          console.error(`❌ Error fetching page ${page} after ${retry} retries:`, error.message);
          throw error;
        }
        const waitTime = Math.min(60000 * (retry + 1), 5 * 60 * 1000);
        console.warn(`⏳ Error fetching page ${page}. Waiting ${waitTime / 1000}s before retrying (retry #${retry + 1})...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        retry++;
      }
    }
  } while (page < totalPages);
  console.log(`🎉 Successfully fetched ${allSchools.length} schools from API`);
  return allSchools;
}

async function loadLocalCsv() {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(INPUT_CSV)
      .pipe(parse({ headers: true, delimiter: ';' }))
      .on('error', reject)
      .on('data', row => rows.push(row))
      .on('end', rowCount => {
        console.log(`📄 Loaded ${rowCount} rows from local CSV`);
        resolve(rows);
      });
  });
}

async function main() {
  // Step 1: Fetch API directory
  const apiDirectory = await fetchApiDirectory();
  const apiMap = new Map(apiDirectory.map(s => [s.normalizedName, s]));

  // Step 2: Load local CSV
  const localRows = await loadLocalCsv();

  // Step 3: Match and build output
  const outputRows = [];
  let matched = 0;
  for (const row of localRows) {
    const origName = row[Object.keys(row)[0]]; // First column is the name
    const normName = normalizeName(origName);
    let match = apiMap.get(normName);
    let unitId = '';
    if (match) {
      unitId = match.id;
      matched++;
      console.log(`✅ Matched: ${origName} -> ${unitId} (${match.name})`);
    } else {
      console.warn(`⚠️  No match found for: ${origName}`);
    }
    outputRows.push({ unitId, ...row });
  }
  console.log(`\n🎯 Matched ${matched} out of ${localRows.length} schools.`);

  // Step 4: Write output CSV
  const headers = ['unitId', ...Object.keys(localRows[0])];
  const ws = fs.createWriteStream(OUTPUT_CSV);
  format({ headers, delimiter: ';' })
    .pipe(ws)
    .on('finish', () => {
      console.log(`💾 Wrote mapped data to ${OUTPUT_CSV}`);
    });
  for (const row of outputRows) {
    ws.write(headers.map(h => row[h] || ''));
  }
  ws.end();
}

main(); 