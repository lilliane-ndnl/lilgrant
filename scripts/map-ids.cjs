const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');
const Fuse = require('fuse.js');

console.log('Starting ID mapping process...');
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OFFICIAL_DATA_PATH = path.join(PROJECT_ROOT, 'scripts', 'data_source', 'Most-Recent-Cohorts-Institution_05192025.csv');
const LILGRANT_DATA_PATH = path.join(PROJECT_ROOT, 'scripts', 'data_source', 'lilgrant_international_playlist_masterfile.csv');
const OUTPUT_PATH = path.join(PROJECT_ROOT, 'scripts', 'data_source', 'lilgrant_data_mapped.csv');

console.log('Loading data files...');
const officialFile = fs.readFileSync(OFFICIAL_DATA_PATH, 'utf8');
const officialData = Papa.parse(officialFile, { header: true, skipEmptyLines: true }).data;
const lilgrantFile = fs.readFileSync(LILGRANT_DATA_PATH, 'utf8');
const lilgrantData = Papa.parse(lilgrantFile, { header: true, delimiter: ';', skipEmptyLines: true }).data;
console.log(`Loaded ${officialData.length} official records and ${lilgrantData.length} custom records.`);

const fuse = new Fuse(officialData, { keys: ['INSTNM'], includeScore: true, threshold: 0.4 });

console.log('Finding matches and mapping UNITIDs...');
let matches = 0;
const mappedData = lilgrantData.map(row => {
    const schoolName = row['University/College Name'];
    if (!schoolName) return row;
    const result = fuse.search(schoolName);
    if (result.length > 0) {
        row.unitid = result[0].item.UNITID;
        matches++;
    } else {
        row.unitid = null;
        console.warn(`--> No match found for: ${schoolName}`);
    }
    return row;
});

console.log(`Mapping complete. Found ${matches} of ${lilgrantData.length} possible matches.`);
const outputCsv = Papa.unparse(mappedData, { delimiter: ';' });
fs.writeFileSync(OUTPUT_PATH, outputCsv);
console.log(`✅ Success! New file with completed unitids created at: ${OUTPUT_PATH}`); 