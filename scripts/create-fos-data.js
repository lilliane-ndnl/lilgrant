import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as fastcsv from 'fast-csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Field of Study data processing...');

try {
    // Create fieldsofstudy directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'public', 'data', 'fieldsofstudy');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`Created directory: ${outputDir}`);
    }

    // Read the CSV file
    const inputFile = path.join(__dirname, 'data_source', 'Most-Recent-Cohorts-Field-of-Study.csv');
    const detailsDir = path.join(__dirname, '..', 'public', 'data', 'details');

    console.log(`Reading from: ${inputFile}`);
    console.log(`Looking for existing schools in: ${detailsDir}`);

    if (!fs.existsSync(inputFile)) {
        throw new Error(`Input file not found: ${inputFile}`);
    }

    if (!fs.existsSync(detailsDir)) {
        throw new Error(`Details directory not found: ${detailsDir}`);
    }

    // Get list of existing school IDs from details directory
    const existingSchools = new Set(
        fs.readdirSync(detailsDir)
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''))
    );

    console.log(`Found ${existingSchools.size} schools in details directory`);

    // Process data by school
    const schoolData = {};
    let rowCount = 0;
    let matchedSchools = new Set();

    fs.createReadStream(inputFile)
        .pipe(fastcsv.parse({ headers: true }))
        .on('data', (row) => {
            rowCount++;
            if (rowCount % 10000 === 0) {
                console.log(`Processed ${rowCount} rows...`);
            }

            const unitId = row.UNITID;
            
            // Skip if school doesn't exist in details directory
            if (!existingSchools.has(unitId)) return;

            matchedSchools.add(unitId);

            if (!schoolData[unitId]) {
                schoolData[unitId] = [];
            }

            // Process and clean the data
            const fosData = {
                cipCode: row.CIPCODE,
                programName: row.CIPDESC,
                credentialLevel: row.CREDDESC,
                credentialCode: row.CREDLEV,
                graduates: {
                    total: parseInt(row.IPEDSCOUNT2) || 0,
                    workingCount: parseInt(row.EARN_COUNT_WNE_5YR) || 0
                },
                earnings: {
                    annual: row.EARN_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : parseInt(row.EARN_MDN_5YR) || 0,
                    monthly: row.EARN_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : Math.round(parseInt(row.EARN_MDN_5YR) / 12) || 0,
                    byDemographic: {
                        male: row.EARN_MALE_WNE_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : parseInt(row.EARN_MALE_WNE_MDN_5YR) || 0,
                        nonMale: row.EARN_NOMALE_WNE_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : parseInt(row.EARN_NOMALE_WNE_MDN_5YR) || 0,
                        pellRecipient: row.EARN_PELL_WNE_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : parseInt(row.EARN_PELL_WNE_MDN_5YR) || 0,
                        nonPellRecipient: row.EARN_NOPELL_WNE_MDN_5YR === 'PrivacySuppressed' ? 'PrivacySuppressed' : parseInt(row.EARN_NOPELL_WNE_MDN_5YR) || 0
                    }
                },
                deliveryMethod: parseInt(row.DISTANCE) || 0
            };

            // Only add programs with valid data
            if (fosData.graduates.total > 0 || fosData.graduates.workingCount > 0) {
                schoolData[unitId].push(fosData);
            }
        })
        .on('end', () => {
            console.log(`\nFinished reading ${rowCount} rows from CSV`);
            console.log('Number of matched schools:', matchedSchools.size);
            
            // Write data for each school
            let processedCount = 0;
            let schoolsWithData = 0;
            
            Object.entries(schoolData).forEach(([unitId, data]) => {
                if (data.length > 0) {
                    const outputFile = path.join(outputDir, `${unitId}.json`);
                    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
                    schoolsWithData++;
                }
                processedCount++;
                if (processedCount % 100 === 0) {
                    console.log(`Processed ${processedCount} schools...`);
                }
            });

            console.log(`\nFields of study data processing complete!`);
            console.log(`Total schools found: ${Object.keys(schoolData).length}`);
            console.log(`Schools with valid data: ${schoolsWithData}`);
        })
        .on('error', (error) => {
            console.error('Error processing CSV:', error);
        });

} catch (error) {
    console.error('Error:', error);
} 