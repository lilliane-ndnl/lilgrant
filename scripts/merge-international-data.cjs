const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

console.log('Starting international data merge process...');
const detailsDir = path.resolve(__dirname, '..', 'public', 'data', 'details');
const lilgrantMappedPath = path.resolve(__dirname, '..', 'scripts', 'data_source', 'lilgrant_data_mapped.csv');

try {
    console.log('Loading mapped international data...');
    const lilgrantFile = fs.readFileSync(lilgrantMappedPath, 'utf8');
    const internationalData = Papa.parse(lilgrantFile, { header: true, delimiter: ';', skipEmptyLines: true }).data;

    const internationalDataMap = new Map();
    for (const row of internationalData) {
        if (row.unitid) {
            internationalDataMap.set(String(row.unitid), row);
            console.log(`Added data for school: ${row['University/College Name']} (${row.unitid})`);
        }
    }
    console.log(`Created a lookup map with ${internationalDataMap.size} international records.`);

    const allFiles = fs.readdirSync(detailsDir);
    let updatedCount = 0;
    console.log(`Scanning and updating ${allFiles.length} university files...`);

    for (const filename of allFiles) {
        if (!filename.endsWith('.json')) continue;
        const filePath = path.join(detailsDir, filename);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const universityData = JSON.parse(fileContent);
        const unitId = String(universityData.UNITID);

        if (internationalDataMap.has(unitId)) {
            const customData = internationalDataMap.get(unitId);
            console.log(`\nUpdating file for: ${universityData.name} (${unitId})`);
            console.log('Adding international data:', JSON.stringify(customData, null, 2));
            
            universityData.lilgrant_international = customData; // Add custom data as a nested object

            if (!universityData.tags) universityData.tags = [];
            universityData.tags.push('international_playlist');

            if (customData['Meets full demonstrated need?'] === 'Yes') {
                universityData.tags.push('generous_aid');
            }

            fs.writeFileSync(filePath, JSON.stringify(universityData, null, 2));
            updatedCount++;
        }
    }

    console.log('\n--- Merge Complete ---');
    console.log(`Successfully updated ${updatedCount} university JSON files.`);
} catch (error) {
    console.error('An error occurred during the merge process:', error);
} 