import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local CSV file path
const CSV_FILE_PATH = path.join(__dirname, 'data_source', 'scholarships.csv');

// Output directory and file path
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'scholarships.json');

// Column mapping from CSV to camelCase JSON keys
const COLUMN_MAPPING = {
  'ID ': 'id',
  'TITLE': 'title',
  'AMOUNT': 'amount',
  'AWARDS': 'awards',
  'DEADLINE': 'deadline',
  'SPONSORS': 'sponsors',
  'Description': 'description',
  'Eligibility Requirements': 'eligibilityRequirements',
  'STUDY LEVEL': 'studyLevel',
  'FIELD OF STUDY': 'fieldOfStudy',
  'COUNTRY': 'country',
  'OFFICIAL LINK': 'officialLink',
  'ADDITIONAL NOTES': 'additionalNotes'
};

async function fetchScholarships() {
  try {
    console.log('🔄 Reading scholarship data from local CSV file...');
    console.log(`📁 CSV file path: ${CSV_FILE_PATH}`);
    
    // Check if CSV file exists
    if (!fs.existsSync(CSV_FILE_PATH)) {
      throw new Error(`CSV file not found at: ${CSV_FILE_PATH}`);
    }
    
    const scholarships = [];
    
    // Parse CSV data from local file
    return new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE_PATH)
        .pipe(csv())
        .on('data', (row) => {
          // Transform CSV row to camelCase object
          const scholarship = {};
          
          for (const [csvKey, jsonKey] of Object.entries(COLUMN_MAPPING)) {
            // Handle the case where CSV header might have slight variations
            const value = row[csvKey] || row[csvKey.trim()] || '';
            scholarship[jsonKey] = value.trim();
          }
          
          // Only add scholarships with at least an ID and title
          if (scholarship.id && scholarship.title) {
            scholarships.push(scholarship);
          }
        })
        .on('end', () => {
          console.log(`✅ Successfully parsed ${scholarships.length} scholarships from CSV`);
          resolve(scholarships);
        })
        .on('error', (error) => {
          console.error('❌ Error parsing CSV data:', error.message);
          reject(error);
        });
    });
    
  } catch (error) {
    console.error('❌ Error reading scholarship data:', error.message);
    throw error;
  }
}

async function saveScholarshipsToJSON(scholarships) {
  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      console.log(`📁 Created directory: ${OUTPUT_DIR}`);
    }
    
    // Write scholarships data to JSON file
    const jsonData = JSON.stringify(scholarships, null, 2);
    fs.writeFileSync(OUTPUT_FILE, jsonData, 'utf8');
    
    console.log(`✅ Successfully saved ${scholarships.length} scholarships to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('❌ Error saving scholarships to JSON:', error.message);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting scholarship data fetch process...\n');
    
    // Fetch and parse scholarship data
    const scholarships = await fetchScholarships();
    
    // Save to JSON file
    await saveScholarshipsToJSON(scholarships);
    
    console.log('\n🎉 Scholarship data fetch completed successfully!');
    console.log(`📊 Total scholarships processed: ${scholarships.length}`);
    console.log(`📁 Data saved to: ${OUTPUT_FILE}`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n💥 Scholarship data fetch failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 