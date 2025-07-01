import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting data consolidation process...');

const DETAILS_DIR = path.resolve(__dirname, '..', 'public', 'data', 'details');
const FOS_DIR = path.resolve(__dirname, '..', 'public', 'data', 'fos');

try {
    const detailFiles = fs.readdirSync(DETAILS_DIR);
    let updatedCount = 0;

    console.log(`Scanning ${detailFiles.length} university files to consolidate...`);

    for (const filename of detailFiles) {
        if (!filename.endsWith('.json')) continue;

        const detailPath = path.join(DETAILS_DIR, filename);
        const fosPath = path.join(FOS_DIR, filename);

        // Read the main university data
        const detailContent = fs.readFileSync(detailPath, 'utf8');
        const universityData = JSON.parse(detailContent);

        // Check if corresponding Field of Study data exists
        if (fs.existsSync(fosPath)) {
            const fosContent = fs.readFileSync(fosPath, 'utf8');
            const fosData = JSON.parse(fosContent);

            // Add the FOS data as a new key in the main object
            universityData.fieldsOfStudy = fosData;

            // Save the newly combined file, overwriting the old one
            fs.writeFileSync(detailPath, JSON.stringify(universityData, null, 2));
            updatedCount++;
        }
    }

    console.log(`\n--- Data Merged ---`);
    console.log(`Successfully merged Fields of Study data into ${updatedCount} university files.`);

    // Clean up by deleting the now-redundant 'fos' directory
    console.log("Cleaning up... Deleting the 'public/data/fos' directory.");
    fs.rmSync(FOS_DIR, { recursive: true, force: true });

    console.log('✅ Success! Data consolidation complete.');

} catch (error) {
    console.error('An error occurred during the consolidation process:', error);
} 