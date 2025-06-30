import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting cleanup process for non-degree-granting schools...');

// Define the directory containing all the university JSON files
const detailsDir = path.resolve(__dirname, '..', 'public', 'data', 'details');

try {
    const filenames = fs.readdirSync(detailsDir);
    let filesDeleted = 0;
    let filesKept = 0;

    console.log(`Scanning ${filenames.length} total files...`);

    for (const filename of filenames) {
        if (filename.endsWith('.json')) {
            const filePath = path.join(detailsDir, filename);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const universityData = JSON.parse(fileContent);

                // Get the HIGHDEG value, making sure to handle potential string values
                const highestDegree = parseInt(universityData.HIGHDEG, 10);

                // The logic: Delete if the highest degree is less than an Associate's degree (code 2)
                if (highestDegree < 2) {
                    console.log(`DELETING: ${filename} (HIGHDEG: ${highestDegree}) - Does not offer a degree.`);
                    fs.unlinkSync(filePath); // This command deletes the file
                    filesDeleted++;
                } else {
                    filesKept++;
                }
            } catch (e) {
                console.error(`Error processing file ${filename}:`, e);
            }
        }
    }

    console.log('\n--- Cleanup Complete ---');
    console.log(`Files Kept: ${filesKept}`);
    console.log(`Files Deleted: ${filesDeleted}`);
    console.log('------------------------');

} catch (error) {
    console.error('Failed to read the details directory:', error);
} 