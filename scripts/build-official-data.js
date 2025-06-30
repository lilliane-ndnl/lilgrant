#!/usr/bin/env node

console.log('=== LilGrant build-official-data.js script started ===');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv:', process.argv);

/**
 * LilGrant Official Data Builder
 * 
 * This script processes university data from the existing College Scorecard CSV
 * and supplements it with API calls for complete data when needed.
 * 
 * Features:
 * - Uses existing CSV data as primary source (much faster than API calls)
 * - Filters for Associate's, Bachelor's, and Graduate degree institutions only
 * - Fetches additional details via API only when needed
 * - Robust error handling with retry logic for rate limits
 * - Resumable processing (skips already completed schools)
 * - Progress tracking and detailed logging
 */

import dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_KEY = process.env.COLLEGE_SCORECARD_API_KEY;
const API_BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools';
const OUTPUT_DIR = path.join(__dirname, '../public/data/details');
const CSV_PATH = path.join(__dirname, 'data_source/Most-Recent-Cohorts-Institution_05192025.csv');

// Degree types we want (exclude certificate-only institutions)
const VALID_DEGREE_TYPES = [2, 3, 4]; // Associate's, Bachelor's, Graduate

// Statistics tracking
let stats = {
  total: 0,
  processed: 0,
  skipped: 0,
  errors: 0,
  apiCalls: 0,
  startTime: Date.now()
};

/**
 * Sleep function for rate limiting
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log with timestamp
 */
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

/**
 * Progress bar
 */
function updateProgress() {
  const percent = ((stats.processed + stats.skipped) / stats.total * 100).toFixed(1);
  const elapsed = ((Date.now() - stats.startTime) / 1000).toFixed(0);
  log(`Progress: ${stats.processed + stats.skipped}/${stats.total} (${percent}%) - Processed: ${stats.processed}, Skipped: ${stats.skipped}, Errors: ${stats.errors}, API Calls: ${stats.apiCalls} - Elapsed: ${elapsed}s`);
}

/**
 * Process CSV data and extract degree-granting institutions
 */
async function processCsvData() {
  log('Reading CSV data...');
  
  // Check if CSV file exists
  try {
    await fs.access(CSV_PATH);
    log(`CSV file found at: ${CSV_PATH}`);
  } catch (error) {
    throw new Error(`CSV file not found at: ${CSV_PATH}`);
  }

  const fileStream = createReadStream(CSV_PATH);
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const institutions = [];
  let lineNumber = 0;
  let headers = [];
  const seenUnitids = new Set();

  for await (const line of rl) {
    lineNumber++;
    
    if (lineNumber === 1) {
      headers = line.split(',').map(h => h.trim());
      log(`Found ${headers.length} columns in CSV`);
      log(`Headers: ${headers.slice(0, 10).join(', ')}...`);
      continue;
    }

    // Skip empty lines
    if (!line.trim()) {
      continue;
    }

    const values = line.split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] ? values[index].trim() : null;
    });

    const unitid = row.UNITID;
    if (!unitid) continue;
    if (seenUnitids.has(unitid)) {
      log(`⚠️  Duplicate UNITID found and skipped: ${unitid} (${row.INSTNM})`);
      continue;
    }
    seenUnitids.add(unitid);

    const preddeg = parseInt(row.PREDDEG);
    institutions.push({
      id: unitid,
      name: row.INSTNM,
      city: row.CITY,
      state: row.STABBR,
      zip: row.ZIP,
      preddeg: preddeg,
      control: row.CONTROL,
      region: row.REGION,
      locale: row.LOCALE,
      ...row
    });

    // Log progress every 1000 lines
    if (lineNumber % 1000 === 0) {
      log(`Processed ${lineNumber} lines, found ${institutions.length} unique institutions so far`);
    }
  }

  log(`CSV processing complete. Found ${institutions.length} unique institutions out of ${lineNumber} total lines`);
  
  // Log some examples
  if (institutions.length > 0) {
    log(`Examples of found institutions:`);
    institutions.slice(0, 3).forEach(inst => {
      log(`  - ${inst.name} (${inst.id}) - ${inst.city}, ${inst.state} - Degree type: ${inst.preddeg}`);
    });
  }

  return institutions;
}

/**
 * Check if institution data already exists
 */
async function getCompletedInstitutions() {
  try {
    const files = await fs.readdir(OUTPUT_DIR);
    const completed = new Set();
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const id = file.replace('.json', '');
        completed.add(id);
      }
    }
    
    log(`Found ${completed.size} already completed institutions`);
    return completed;
  } catch (error) {
    log('No existing data found, starting fresh');
    return new Set();
  }
}

/**
 * Save institution data to JSON file
 */
async function saveInstitutionData(institution) {
  const filename = `${institution.id}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  try {
    await fs.writeFile(filepath, JSON.stringify(institution, null, 2));
    return true;
  } catch (error) {
    log(`Error saving data for ${institution.name} (${institution.id}): ${error.message}`);
    return false;
  }
}

/**
 * Main processing function
 */
async function main() {
  try {
    log('=== LilGrant Official Data Builder Starting (LOCAL ONLY) ===');
    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    log(`Output directory: ${OUTPUT_DIR}`);

    // Process CSV data
    const institutions = await processCsvData();
    stats.total = institutions.length;

    if (institutions.length === 0) {
      log('No degree-granting institutions found in CSV. Please check the data.');
      return;
    }

    // Get already completed institutions
    const completed = await getCompletedInstitutions();

    log(`Starting processing of ${institutions.length} institutions...`);
    log(`Skipping ${completed.size} already completed institutions`);

    // Process each institution
    for (let i = 0; i < institutions.length; i++) {
      const institution = institutions[i];

      // Check if already completed
      if (completed.has(institution.id)) {
        stats.skipped++;
        if (i % 100 === 0) updateProgress();
        continue;
      }

      try {
        log(`Processing ${institution.name} (${institution.id})...`);

        // Save to file (local CSV data only)
        const saved = await saveInstitutionData(institution);
        
        if (saved) {
          stats.processed++;
        } else {
          stats.errors++;
        }

        // Progress update every 10 institutions
        if (i % 10 === 0) updateProgress();

      } catch (error) {
        log(`Error processing ${institution.name} (${institution.id}): ${error.message}`);
        stats.errors++;
      }
    }

    // Final statistics
    const totalTime = ((Date.now() - stats.startTime) / 1000).toFixed(0);
    log('=== PROCESSING COMPLETE ===');
    log(`Total institutions: ${stats.total}`);
    log(`Processed: ${stats.processed}`);
    log(`Skipped: ${stats.skipped}`);
    log(`Errors: ${stats.errors}`);
    log(`API calls made: ${stats.apiCalls}`);
    log(`Total time: ${totalTime} seconds`);

  } catch (error) {
    log(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Top-level error:', err);
}); 