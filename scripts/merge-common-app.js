import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting Common App data integration...');

// Define Paths
const DETAILS_DIR = path.resolve(__dirname, '..', 'public', 'data', 'details');
const COMMON_APP_CSV_PATH = path.resolve(__dirname, 'data_source', 'CommonApp Admission Information.csv');

// Log paths for debugging
console.log('Details directory:', DETAILS_DIR);
console.log('Common App CSV path:', COMMON_APP_CSV_PATH);

try {
    // Check if files exist
    if (!fs.existsSync(COMMON_APP_CSV_PATH)) {
        throw new Error(`Common App CSV file not found at: ${COMMON_APP_CSV_PATH}`);
    }

    // 1. Load the Common App data
    const commonAppFile = fs.readFileSync(COMMON_APP_CSV_PATH, 'utf8');
    const lines = commonAppFile.split('\n');
    
    // Skip the first line (category headers) and use the second line as headers
    const headers = lines[1].split(';').map(h => h.trim());
    
    // Process the data starting from line 3
    const commonAppData = [];
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(';');
        const school = {};
        headers.forEach((header, index) => {
            school[header] = values[index] ? values[index].trim() : null;
        });
        commonAppData.push(school);
    }

    console.log(`Loaded ${commonAppData.length} records from Common App file.`);

    // 2. Load all university names from our existing JSON files for matching
    const allSchoolDetails = fs.readdirSync(DETAILS_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const schoolData = JSON.parse(fs.readFileSync(path.join(DETAILS_DIR, file), 'utf8'));
            return { 
                UNITID: file.replace('.json', ''),
                INSTNM: schoolData.INSTNM,
                filePath: path.join(DETAILS_DIR, file)
            };
        });

    console.log(`Loaded ${allSchoolDetails.length} university details files.`);

    // Create a map of school names to details for faster lookup
    const schoolMap = new Map(allSchoolDetails.map(school => [school.INSTNM.toLowerCase(), school]));

    let updatedCount = 0;
    let matchLog = [];
    let noMatchLog = [];
    console.log('Matching and merging Common App data...');

    // 4. Loop through each school in the Common App file
    for (const commonAppSchool of commonAppData) {
        const schoolName = commonAppSchool['Common App Member'];
        if (!schoolName) continue;

        // Log the school we're trying to match
        console.log(`\nTrying to match: ${schoolName}`);

        // Look for exact match (case insensitive)
        const matchedSchool = schoolMap.get(schoolName.toLowerCase());
        
        if (matchedSchool) {
            console.log(`Found exact match: ${matchedSchool.INSTNM}`);
            
            // Log the match for verification
            matchLog.push({
                commonAppName: schoolName,
                matchedName: matchedSchool.INSTNM
            });

            // 5. Read, update, and save the corresponding JSON file
            const universityData = JSON.parse(fs.readFileSync(matchedSchool.filePath, 'utf8'));

            // Create a new nested object for Common App data
            universityData.commonAppInfo = {
                acceptsCommonApp: true,
                applicationDeadlines: {
                    earlyDecision: commonAppSchool.ED || null,
                    earlyDecision2: commonAppSchool.EDII || null,
                    earlyAction: commonAppSchool.EA || null,
                    earlyAction2: commonAppSchool.EAII || null,
                    restrictiveEarlyAction: commonAppSchool.REA || null,
                    regular: commonAppSchool['RD/ Rolling'] || null
                },
                applicationFees: {
                    domestic: commonAppSchool.US || '0',
                    international: commonAppSchool.INTL || '0'
                },
                requirements: {
                    personalEssayRequired: commonAppSchool["Personal Essay Req'd³"] === 'Yes',
                    writingSupplement: commonAppSchool.Writing === 'Yes',
                    coursesAndGrades: commonAppSchool['C&G⁴'] === 'Yes',
                    portfolio: commonAppSchool['Portfolio⁵'] || null,
                    testPolicy: commonAppSchool['Test Policy'] || null,
                    testScoresUsed: commonAppSchool['SAT/ACT Tests Used'] || null,
                    internationalRequirements: commonAppSchool.INTL || null
                },
                recommendations: {
                    teacherEvals: commonAppSchool.TE || '0',
                    otherEvals: commonAppSchool.OE || '0',
                    counselorRecommendation: commonAppSchool.CR === 'Y',
                    midYearReport: commonAppSchool.MR === 'Y'
                }
            };

            // Add additional admission information from existing data
            universityData.admissionInfo = {
                ...universityData.admissionInfo,
                applicationDeadlines: universityData.commonAppInfo.applicationDeadlines,
                applicationFees: universityData.commonAppInfo.applicationFees,
                acceptanceRate: universityData.ADM_RATE,
                totalEnrolled: universityData.UGDS,
                satScores: {
                    reading: {
                        range: [universityData.SATVR25, universityData.SATVR75],
                        average: universityData.SAT_AVG_VERBAL
                    },
                    math: {
                        range: [universityData.SATMT25, universityData.SATMT75],
                        average: universityData.SAT_AVG_MATH
                    }
                },
                actScores: {
                    composite: {
                        range: [universityData.ACTCM25, universityData.ACTCM75],
                        average: universityData.ACT_AVG
                    }
                }
            };

            fs.writeFileSync(matchedSchool.filePath, JSON.stringify(universityData, null, 2));
            updatedCount++;

            // Log progress every 10 schools
            if (updatedCount % 10 === 0) {
                console.log(`Processed ${updatedCount} matches...`);
            }
        } else {
            console.log(`No exact match found for: ${schoolName}`);
            noMatchLog.push(schoolName);
        }
    }

    // Save match log for verification
    fs.writeFileSync(
        path.join(__dirname, 'common_app_matches.json'), 
        JSON.stringify(matchLog, null, 2)
    );

    // Save no-match log for verification
    fs.writeFileSync(
        path.join(__dirname, 'common_app_no_matches.json'), 
        JSON.stringify(noMatchLog, null, 2)
    );

    console.log(`\n--- Common App Merge Complete ---`);
    console.log(`Successfully updated ${updatedCount} universities with Common App data.`);
    console.log(`Match log saved to common_app_matches.json`);
    console.log(`No-match log saved to common_app_no_matches.json`);

} catch (error) {
    console.error('An error occurred during the Common App data merge:', error);
    console.error('Error details:', error.stack);
} 