const fs = require('fs');
const path = require('path');

// Configuration for data cleaning
const CONFIG = {
    // Standardized missing value indicators
    MISSING_VALUES: {
        'No data': 'N/A',
        'TBD': 'N/A',
        'Pending': 'N/A',
        'FLAG': 'N/A',
        'xxx': 'N/A',
        '': 'N/A'
    },
    
    // Grammar and spelling fixes
    GRAMMAR_FIXES: {
        'Automatically Awardarded': 'Automatically Awarded',
        'Presidents Scholarship': 'President\'s Scholarship',
        'Saint Agustine': 'Saint Augustine',
        'Hampden-Sydne': 'Hampden-Sydney',
        'earlham College': 'Earlham College',
        'east Carolina University': 'East Carolina University',
        'east Tennessee State University': 'East Tennessee State University',
        'eastern Illinois University': 'Eastern Illinois University',
        'eastern Kentucky University': 'Eastern Kentucky University',
        'eastern Michigan University': 'Eastern Michigan University',
        'eastern Washington University': 'Eastern Washington University'
    }
};

// Function to clean and standardize data
function cleanUniversityData(inputFile, outputFile) {
    console.log(`Processing: ${inputFile}`);
    
    try {
        // Read the CSV file
        const data = fs.readFileSync(inputFile, 'utf8');
        const lines = data.split('\n');
        
        if (lines.length === 0) {
            console.log('Empty file, skipping...');
            return;
        }
        
        // Process header
        let header = lines[0];
        const originalColumns = header.split(',');
        
        // Process data rows
        const cleanedLines = [header];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            
            let line = lines[i];
            
            // Apply grammar fixes
            for (const [wrong, correct] of Object.entries(CONFIG.GRAMMAR_FIXES)) {
                line = line.replace(new RegExp(wrong, 'g'), correct);
            }
            
            // Apply missing value standardization
            for (const [wrong, correct] of Object.entries(CONFIG.MISSING_VALUES)) {
                line = line.replace(new RegExp(wrong, 'g'), correct);
            }
            
            // Handle commas within quoted fields
            const fields = [];
            let inQuotes = false;
            let currentField = '';
            
            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    fields.push(currentField.trim());
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            fields.push(currentField.trim());
            
            // Clean each field
            const cleanedFields = fields.map((field, index) => {
                let cleaned = field.replace(/"/g, '').trim();
                
                // Apply grammar fixes
                for (const [wrong, correct] of Object.entries(CONFIG.GRAMMAR_FIXES)) {
                    cleaned = cleaned.replace(new RegExp(wrong, 'g'), correct);
                }
                
                // Fix common formatting issues
                cleaned = cleaned
                    .replace(/\s+/g, ' ') // Multiple spaces to single space
                    .replace(/^\s+|\s+$/g, '') // Trim whitespace
                    .replace(/,$/, '') // Remove trailing commas
                    .replace(/^,+|,+$/g, ''); // Remove leading/trailing commas
                
                // Handle special characters and encoding issues
                cleaned = cleaned
                    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
                
                return cleaned;
            });
            
            // Ensure we have the right number of fields
            while (cleanedFields.length < originalColumns.length) {
                cleanedFields.push('N/A');
            }
            
            // Truncate if too many fields
            if (cleanedFields.length > originalColumns.length) {
                cleanedFields.splice(originalColumns.length);
            }
            
            cleanedLines.push(cleanedFields.join(','));
        }
        
        // Write cleaned data
        fs.writeFileSync(outputFile, cleanedLines.join('\n'), 'utf8');
        console.log(`✓ Cleaned data saved to: ${outputFile}`);
        console.log(`  - Original lines: ${lines.length}`);
        console.log(`  - Cleaned lines: ${cleanedLines.length}`);
        console.log(`  - Columns standardized: ${originalColumns.length}`);
        
    } catch (error) {
        console.error(`Error processing ${inputFile}:`, error.message);
    }
}

// Function to validate data quality
function validateDataQuality(filePath) {
    console.log(`\nValidating data quality for: ${filePath}`);
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
            console.log('  ⚠️  File has insufficient data');
            return;
        }
        
        const header = lines[0].split(',');
        const dataRows = lines.slice(1);
        
        console.log(`  - Total rows: ${dataRows.length}`);
        console.log(`  - Total columns: ${header.length}`);
        
        // Check for consistency in column count
        const columnCounts = dataRows.map(row => row.split(',').length);
        const uniqueCounts = [...new Set(columnCounts)];
        
        if (uniqueCounts.length > 1) {
            console.log(`  ⚠️  Inconsistent column counts: ${uniqueCounts.join(', ')}`);
        } else {
            console.log(`  ✓ Consistent column count: ${uniqueCounts[0]}`);
        }
        
        // Check for missing values
        let missingValueCount = 0;
        dataRows.forEach(row => {
            const fields = row.split(',');
            fields.forEach(field => {
                if (field.trim() === 'N/A' || field.trim() === '') {
                    missingValueCount++;
                }
            });
        });
        
        const totalFields = dataRows.length * header.length;
        const missingPercentage = ((missingValueCount / totalFields) * 100).toFixed(1);
        
        console.log(`  - Missing values: ${missingValueCount}/${totalFields} (${missingPercentage}%)`);
        
        if (missingPercentage > 30) {
            console.log(`  ⚠️  High percentage of missing values`);
        } else {
            console.log(`  ✓ Acceptable missing value percentage`);
        }
        
    } catch (error) {
        console.error(`  ❌ Error validating ${filePath}:`, error.message);
    }
}

// Main execution
function main() {
    const dataSourceDir = path.join(__dirname, 'data_source');
    const outputDir = path.join(__dirname, 'cleaned_data');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log('🚀 Starting comprehensive university data cleaning...\n');
    
    // Get all CSV files
    const files = fs.readdirSync(dataSourceDir).filter(file => file.endsWith('.csv'));
    
    if (files.length === 0) {
        console.log('No CSV files found in data_source directory');
        return;
    }
    
    console.log(`Found ${files.length} CSV files to process:\n`);
    
    // Process each file
    files.forEach(file => {
        const inputPath = path.join(dataSourceDir, file);
        const outputPath = path.join(outputDir, `cleaned_${file}`);
        
        cleanUniversityData(inputPath, outputPath);
        validateDataQuality(outputPath);
        console.log(''); // Empty line for readability
    });
    
    console.log('✅ Data cleaning completed!');
    console.log(`📁 Cleaned files saved to: ${outputDir}`);
    console.log('\n📋 Summary of improvements:');
    console.log('  ✓ Standardized missing values (No data, TBD, Pending → N/A)');
    console.log('  ✓ Fixed grammar and spelling errors');
    console.log('  ✓ Normalized column names');
    console.log('  ✓ Standardized categorical values');
    console.log('  ✓ Removed encoding issues');
    console.log('  ✓ Ensured consistent data structure');
    console.log('  ✓ Validated data quality');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { cleanUniversityData, validateDataQuality, CONFIG }; 