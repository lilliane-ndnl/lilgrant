import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const detailsDir = path.resolve(__dirname, '..', 'public', 'data', 'details');

// Define degree types
const degreeTypes = {
    2: "Associate's Degree",
    3: "Bachelor's Degree",
    4: "Graduate Degree"
};

try {
    const filenames = fs.readdirSync(detailsDir);
    const stats = {
        2: 0, // Associate's
        3: 0, // Bachelor's
        4: 0  // Graduate
    };
    let totalSchools = 0;

    console.log('\nAnalyzing degree types for remaining schools...\n');

    for (const filename of filenames) {
        if (filename.endsWith('.json')) {
            const filePath = path.join(detailsDir, filename);
            try {
                const fileContent = fs.readFileSync(filePath, 'utf8');
                const universityData = JSON.parse(fileContent);
                const highestDegree = parseInt(universityData.HIGHDEG, 10);
                
                if (highestDegree >= 2 && highestDegree <= 4) {
                    stats[highestDegree]++;
                    totalSchools++;
                }
            } catch (e) {
                console.error(`Error processing file ${filename}:`, e);
            }
        }
    }

    console.log('=== Degree Type Distribution ===');
    console.log('--------------------------------');
    Object.entries(stats).forEach(([degree, count]) => {
        const percentage = ((count / totalSchools) * 100).toFixed(1);
        console.log(`${degreeTypes[degree]}: ${count} schools (${percentage}%)`);
    });
    console.log('--------------------------------');
    console.log(`Total Schools Analyzed: ${totalSchools}`);
    console.log('================================\n');

} catch (error) {
    console.error('Failed to analyze schools:', error);
} 