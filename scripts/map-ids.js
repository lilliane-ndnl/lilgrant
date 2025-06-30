import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import fetch from 'node-fetch';
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

function parseCSVLine(line, delimiter = ';') {
  return line.split(delimiter).map(s => s.trim());
}

function escapeCSV(val) {
  if (val == null) return '';
  const str = String(val);
  if (str.includes(',') || str.includes(';') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

async function getDoneSet() {
  const doneSet = new Set();
  if (fsSync.existsSync(OUTPUT_CSV)) {
    const content = await fs.readFile(OUTPUT_CSV, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i], ';');
      if (cols[0]) doneSet.add(cols[0]);
    }
    console.log(`Found ${doneSet.size} already mapped schools. Resuming...`);
  }
  return doneSet;
}

function bestMatch(input, candidates) {
  // Try to find the closest match by normalized name
  const normInput = normalizeName(input);
  let best = null;
  let bestScore = -1;
  for (const c of candidates) {
    const normC = normalizeName(c['school.name'] || '');
    let score = 0;
    if (normC === normInput) score += 10;
    if (normC.includes(normInput)) score += 5;
    if (normInput.includes(normC)) score += 3;
    // Bonus for length similarity
    score -= Math.abs(normC.length - normInput.length);
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

async function main() {
  const doneSet = await getDoneSet();
  const inputContent = await fs.readFile(INPUT_CSV, 'utf-8');
  const lines = inputContent.split('\n').filter(Boolean);
  const headers = parseCSVLine(lines[0]);
  let outputStream;
  const fileExists = fsSync.existsSync(OUTPUT_CSV);
  if (!fileExists) {
    outputStream = fsSync.createWriteStream(OUTPUT_CSV, { flags: 'a' });
    outputStream.write('University Name;School ID;API Name Match\n');
  } else {
    outputStream = fsSync.createWriteStream(OUTPUT_CSV, { flags: 'a' });
  }
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const universityName = row[0];
    if (!universityName) continue;
    if (doneSet.has(universityName)) continue;
    let schoolId = '';
    let apiName = '';
    try {
      const params = new URLSearchParams({
        'api_key': API_KEY,
        'school.name__icontains': universityName,
        'fields': 'id,school.name',
        'per_page': '10'
      });
      const url = `https://api.data.gov/ed/collegescorecard/v1/schools?${params}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const match = bestMatch(universityName, data.results);
        if (match) {
          schoolId = match.id;
          apiName = match['school.name'];
          console.log(`✅ Mapped: ${universityName} -> ${schoolId} (${apiName})`);
        } else {
          console.warn('⚠️  No good match found for: ' + universityName);
        }
      } else {
        console.warn('⚠️  No match found for: ' + universityName);
      }
    } catch (err) {
      console.warn('⚠️  API error for: ' + universityName + ' - ' + err.message);
    }
    outputStream.write(`${escapeCSV(universityName)};${escapeCSV(schoolId)};${escapeCSV(apiName)}\n`);
    outputStream.flush && outputStream.flush();
  }
  outputStream.end();
  console.log('🎉 Mapping complete!');
}

main(); 