import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const detailsDir = join(__dirname, '..', 'public', 'data', 'details');
const outputPath = join(__dirname, '..', 'public', 'data', 'summary.json');

console.log('Starting summary creation...');
console.log(`Reading from: ${detailsDir}`);
console.log(`Writing to: ${outputPath}`);

try {
    const filenames = readdirSync(detailsDir);
    const universitySummaries = [];
    const errors = [];

    console.log(`Found ${filenames.length} files to process...`);

    for (const filename of filenames) {
        if (filename.endsWith('.json')) {
            try {
                const filePath = join(detailsDir, filename);
                const fileContent = readFileSync(filePath, 'utf8');
                const universityData = JSON.parse(fileContent);

                // Validate required fields
                if (!universityData.UNITID || !universityData.INSTNM) {
                    errors.push(`Skipping ${filename}: Missing required fields UNITID or INSTNM`);
                    continue;
                }

                // Extract ONLY the data needed for the UniversityCard
                const summary = {
                    id: universityData.UNITID,
                    name: universityData.INSTNM,
                    city: universityData.CITY || '',
                    state: universityData.STABBR || '',
                    // --- Data for the Icon Row ---
                    CONTROL: universityData.CONTROL || null,
                    LOCALE: universityData.LOCALE || null,
                    UGDS: universityData.UGDS || null,
                    // --- Data for the Main Metrics ---
                    ADM_RATE: universityData.ADM_RATE || null,
                    NPT4_PUB: universityData.NPT4_PUB || null,
                    NPT4_PRIV: universityData.NPT4_PRIV || null,
                    MD_EARN_WNE_P10: universityData.MD_EARN_WNE_P10 || null,
                    // Additional fields for filtering
                    sourceList: Array.isArray(universityData.sourceList) ? universityData.sourceList : [],
                    slug: universityData.UNITID.toString()
                };
                universitySummaries.push(summary);
            } catch (err) {
                errors.push(`Error processing ${filename}: ${err.message}`);
            }
        }
    }

    // Sort universities by name
    universitySummaries.sort((a, b) => a.name.localeCompare(b.name));

    writeFileSync(outputPath, JSON.stringify(universitySummaries, null, 2));
    console.log(`✅ Success! summary.json created with ${universitySummaries.length} records.`);
    
    if (errors.length > 0) {
        console.log('\nWarnings during processing:');
        errors.forEach(error => console.log(`- ${error}`));
    }

} catch (error) {
    console.error('Error creating summary.json:', error);
    process.exit(1);
} 