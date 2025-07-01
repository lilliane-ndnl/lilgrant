import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to log with immediate flush
function log(message) {
    process.stderr.write(message + '\n');
}

log('Starting MASTER REBUILD process...');

const DETAILS_DIR = path.resolve(__dirname, '..', 'public', 'data', 'details');
const INST_CSV_PATH = path.resolve(__dirname, '..', 'scripts', 'data_source', 'Most-Recent-Cohorts-Institution_05192025.csv');
const FOS_CSV_PATH = path.resolve(__dirname, '..', 'scripts', 'data_source', 'Most-Recent-Cohorts-Field-of-Study.csv');
const COLUMNS_PER_BATCH = 10;

// Get list of existing university IDs from details folder
log('Reading directory: ' + DETAILS_DIR);
const existingUniversities = new Set(
    fs.readdirSync(DETAILS_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
);

log(`Found ${existingUniversities.size} existing university files to process.`);

// Function to read CSV file in chunks
function readCSVInChunks(filePath, options = {}) {
    return new Promise((resolve, reject) => {
        const results = [];
        let rowCount = 0;
        let headers = null;

        const parser = Papa.parse(fs.createReadStream(filePath, { encoding: 'utf8' }), {
            header: false,
            skipEmptyLines: true,
            chunk: function(chunk) {
                try {
                    if (!headers) {
                        headers = chunk.data[0];
                        chunk.data = chunk.data.slice(1);
                    }
                    
                    rowCount += chunk.data.length;
                    if (options.onChunk) {
                        options.onChunk(chunk.data, headers, rowCount);
                    }
                } catch (err) {
                    log(`Error processing chunk at row ${rowCount}: ${err.message}`);
                }
            },
            complete: function() {
                resolve({ headers, rowCount });
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}

// Main process
async function processInstitutionData() {
    try {
        log('Starting to process institution data...');
        
        // First, get the headers
        const firstChunk = await new Promise((resolve, reject) => {
            const parser = Papa.parse(fs.createReadStream(INST_CSV_PATH, { encoding: 'utf8' }), {
                preview: 1,
                complete: function(results) {
                    resolve(results.data[0]);
                },
                error: function(err) {
                    reject(err);
                }
            });
        });

        const headers = firstChunk;
        log(`Found ${headers.length} columns to process`);

        // Process in batches of columns
        for (let i = 0; i < headers.length; i += COLUMNS_PER_BATCH) {
            const batchEnd = Math.min(i + COLUMNS_PER_BATCH, headers.length);
            const selectedColumns = headers.slice(i, batchEnd);
            
            log(`\nProcessing batch ${Math.floor(i/COLUMNS_PER_BATCH) + 1} of ${Math.ceil(headers.length/COLUMNS_PER_BATCH)}`);
            log('Columns: ' + selectedColumns.join(', '));

            const universityData = {};
            
            // Process the CSV file
            await readCSVInChunks(INST_CSV_PATH, {
                onChunk: (rows, csvHeaders, count) => {
                    if (count % 1000 === 0) {
                        log(`Processed ${count} rows...`);
                    }

                    rows.forEach(row => {
                        const unitId = row[csvHeaders.indexOf('UNITID')];
                        if (unitId && existingUniversities.has(unitId)) {
                            if (!universityData[unitId]) {
                                universityData[unitId] = {};
                            }
                            
                            selectedColumns.forEach(column => {
                                const value = row[csvHeaders.indexOf(column)];
                                if (value !== undefined && value !== '') {
                                    universityData[unitId][column] = value;
                                }
                            });
                        }
                    });
                }
            });

            // Update files for this batch
            log(`Updating files for ${Object.keys(universityData).length} universities...`);
            let filesUpdated = 0;
            
            for (const [unitId, data] of Object.entries(universityData)) {
                const filePath = path.join(DETAILS_DIR, `${unitId}.json`);
                try {
                    let existingData = {};
                    if (fs.existsSync(filePath)) {
                        existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    }
                    
                    const mergedData = { ...existingData, ...data };
                    fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
                    filesUpdated++;
                    
                    if (filesUpdated % 500 === 0) {
                        log(`Updated ${filesUpdated} files...`);
                    }
                } catch (err) {
                    log(`Error updating file ${filePath}: ${err.message}`);
                }
            }
            
            log(`Completed batch. Updated ${filesUpdated} files.`);
            
            // Run garbage collection between batches
            if (global.gc) {
                log('Running garbage collection...');
                global.gc();
            }
        }

        // Process Fields of Study data
        log('\nProcessing Fields of Study data...');
        const fosDataByUnit = new Map();
        let fosCount = 0;

        await readCSVInChunks(FOS_CSV_PATH, {
            onChunk: (rows, csvHeaders, count) => {
                if (count % 1000 === 0) {
                    log(`Processed ${count} FOS rows...`);
                }

                rows.forEach(row => {
                    const unitId = row[csvHeaders.indexOf('UNITID')];
                    if (unitId && existingUniversities.has(unitId)) {
                        if (!fosDataByUnit.has(unitId)) {
                            fosDataByUnit.set(unitId, []);
                        }
                        
                        const fosRecord = {};
                        csvHeaders.forEach((header, idx) => {
                            if (row[idx] !== undefined && row[idx] !== '') {
                                fosRecord[header] = row[idx];
                            }
                        });
                        
                        fosDataByUnit.get(unitId).push(fosRecord);
                        fosCount++;
                    }
                });
            }
        });

        // Update files with FOS data
        log(`Updating files with FOS data for ${fosDataByUnit.size} universities...`);
        let fosFilesUpdated = 0;
        
        for (const [unitId, fosRecords] of fosDataByUnit.entries()) {
            const filePath = path.join(DETAILS_DIR, `${unitId}.json`);
            try {
                if (fs.existsSync(filePath)) {
                    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    data.fieldsOfStudy = fosRecords;
                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
                    fosFilesUpdated++;
                    
                    if (fosFilesUpdated % 500 === 0) {
                        log(`Updated ${fosFilesUpdated} files with FOS data...`);
                    }
                }
            } catch (err) {
                log(`Error updating FOS data for file ${filePath}: ${err.message}`);
            }
        }

        log(`\n--- Master Rebuild Complete ---`);
        log(`Successfully processed ${fosCount} FOS records`);
        log(`Updated ${fosFilesUpdated} university files with FOS data`);
        log('---------------------------------');
        log('\nIMPORTANT: You must now run the cleanup, merge, and summary scripts to complete the pipeline.');
    } catch (error) {
        log('Fatal error during processing:');
        log(error.stack || error.message);
        process.exit(1);
    }
}

// Start the process
log('Checking CSV files exist...');
log(`Institution CSV exists: ${fs.existsSync(INST_CSV_PATH)}`);
log(`FOS CSV exists: ${fs.existsSync(FOS_CSV_PATH)}`);
processInstitutionData();