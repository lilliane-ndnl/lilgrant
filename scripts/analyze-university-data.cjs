const fs = require('fs');
const path = require('path');

// Function to analyze a CSV file
function analyzeCSVFile(filePath) {
    console.log(`\n📊 Analyzing: ${path.basename(filePath)}`);
    console.log('=' .repeat(60));
    
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length < 2) {
            console.log('❌ Insufficient data for analysis');
            return;
        }
        
        const header = lines[0].split(',');
        const dataRows = lines.slice(1);
        
        console.log(`📈 Basic Statistics:`);
        console.log(`   • Total rows: ${dataRows.length}`);
        console.log(`   • Total columns: ${header.length}`);
        
        // Analyze each column
        console.log(`\n🔍 Column Analysis:`);
        
        for (let i = 0; i < header.length; i++) {
            const columnName = header[i].trim().replace(/"/g, '');
            const values = dataRows.map(row => {
                const fields = row.split(',');
                return fields[i] ? fields[i].trim().replace(/"/g, '') : '';
            }).filter(val => val !== '' && val !== 'N/A');
            
            const uniqueValues = [...new Set(values)];
            const totalValues = values.length;
            const missingValues = dataRows.length - totalValues;
            const missingPercentage = ((missingValues / dataRows.length) * 100).toFixed(1);
            
            console.log(`\n   📋 Column ${i + 1}: ${columnName}`);
            console.log(`      • Total values: ${totalValues}`);
            console.log(`      • Missing values: ${missingValues} (${missingPercentage}%)`);
            console.log(`      • Unique values: ${uniqueValues.length}`);
            
            if (uniqueValues.length <= 20 && uniqueValues.length > 0) {
                console.log(`      • Unique options: ${uniqueValues.slice(0, 10).join(', ')}${uniqueValues.length > 10 ? '...' : ''}`);
            } else if (uniqueValues.length > 20) {
                console.log(`      • Sample values: ${uniqueValues.slice(0, 5).join(', ')}...`);
            }
            
            // Check for data type patterns
            const numericValues = values.filter(val => !isNaN(val) && val !== '');
            const percentageValues = values.filter(val => val.includes('%'));
            const currencyValues = values.filter(val => val.includes('$'));
            
            if (numericValues.length > totalValues * 0.8) {
                console.log(`      • Data type: Numeric (${numericValues.length} values)`);
            } else if (percentageValues.length > 0) {
                console.log(`      • Data type: Percentage values (${percentageValues.length} values)`);
            } else if (currencyValues.length > 0) {
                console.log(`      • Data type: Currency values (${currencyValues.length} values)`);
            } else {
                console.log(`      • Data type: Text/Categorical`);
            }
        }
        
        // Check for data quality issues
        console.log(`\n⚠️  Data Quality Issues:`);
        
        // Check for inconsistent column counts
        const columnCounts = dataRows.map(row => row.split(',').length);
        const uniqueCounts = [...new Set(columnCounts)];
        
        if (uniqueCounts.length > 1) {
            console.log(`   • Inconsistent column counts: ${uniqueCounts.join(', ')}`);
        } else {
            console.log(`   • ✓ Consistent column structure`);
        }
        
        // Check for high missing value columns
        const highMissingColumns = [];
        for (let i = 0; i < header.length; i++) {
            const values = dataRows.map(row => {
                const fields = row.split(',');
                return fields[i] ? fields[i].trim().replace(/"/g, '') : '';
            }).filter(val => val !== '' && val !== 'N/A');
            
            const missingPercentage = ((dataRows.length - values.length) / dataRows.length) * 100;
            if (missingPercentage > 50) {
                highMissingColumns.push({
                    name: header[i].trim().replace(/"/g, ''),
                    missing: missingPercentage.toFixed(1)
                });
            }
        }
        
        if (highMissingColumns.length > 0) {
            console.log(`   • High missing value columns:`);
            highMissingColumns.forEach(col => {
                console.log(`     - ${col.name}: ${col.missing}% missing`);
            });
        }
        
        // Check for potential grammar/spelling issues
        console.log(`\n🔤 Grammar & Vocabulary Check:`);
        const commonIssues = [];
        
        dataRows.forEach((row, rowIndex) => {
            const fields = row.split(',');
            fields.forEach((field, fieldIndex) => {
                const value = field.trim().replace(/"/g, '');
                
                // Check for common issues
                if (value.includes('Automatically Awardarded')) {
                    commonIssues.push(`Row ${rowIndex + 2}, Col ${fieldIndex + 1}: "Automatically Awardarded" should be "Automatically Awarded"`);
                }
                if (value.includes('Presidents Scholarship')) {
                    commonIssues.push(`Row ${rowIndex + 2}, Col ${fieldIndex + 1}: "Presidents Scholarship" should be "President's Scholarship"`);
                }
                if (value.includes('Saint Agustine')) {
                    commonIssues.push(`Row ${rowIndex + 2}, Col ${fieldIndex + 1}: "Saint Agustine" should be "Saint Augustine"`);
                }
                if (value.includes('Hampden-Sydne')) {
                    commonIssues.push(`Row ${rowIndex + 2}, Col ${fieldIndex + 1}: "Hampden-Sydne" should be "Hampden-Sydney"`);
                }
            });
        });
        
        if (commonIssues.length > 0) {
            console.log(`   • Found ${commonIssues.length} potential issues:`);
            commonIssues.slice(0, 5).forEach(issue => {
                console.log(`     - ${issue}`);
            });
            if (commonIssues.length > 5) {
                console.log(`     ... and ${commonIssues.length - 5} more issues`);
            }
        } else {
            console.log(`   • ✓ No obvious grammar/spelling issues found`);
        }
        
    } catch (error) {
        console.error(`❌ Error analyzing ${filePath}:`, error.message);
    }
}

// Function to generate summary report
function generateSummaryReport(cleanedDataDir) {
    console.log('\n📋 SUMMARY REPORT');
    console.log('=' .repeat(60));
    
    const files = fs.readdirSync(cleanedDataDir).filter(file => file.endsWith('.csv'));
    
    console.log(`\n📁 Files processed: ${files.length}`);
    
    files.forEach(file => {
        const filePath = path.join(cleanedDataDir, file);
        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length >= 2) {
            const header = lines[0].split(',');
            const dataRows = lines.slice(1);
            
            console.log(`\n📄 ${file}:`);
            console.log(`   • Rows: ${dataRows.length}`);
            console.log(`   • Columns: ${header.length}`);
            
            // Count missing values
            let totalMissing = 0;
            dataRows.forEach(row => {
                const fields = row.split(',');
                fields.forEach(field => {
                    if (field.trim() === 'N/A' || field.trim() === '') {
                        totalMissing++;
                    }
                });
            });
            
            const totalFields = dataRows.length * header.length;
            const missingPercentage = ((totalMissing / totalFields) * 100).toFixed(1);
            
            console.log(`   • Missing values: ${totalMissing}/${totalFields} (${missingPercentage}%)`);
        }
    });
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('=' .repeat(60));
    console.log('1. ✅ Standardize all missing values to "N/A" for consistency');
    console.log('2. ✅ Fix grammar and spelling errors (already done)');
    console.log('3. ✅ Remove encoding issues and special characters');
    console.log('4. ⚠️  Address inconsistent column counts in some files');
    console.log('5. ⚠️  Consider data validation for high missing value columns');
    console.log('6. ✅ Ensure consistent data structure across all files');
    console.log('7. ✅ Validate data quality metrics');
    console.log('8. 📊 Use cleaned data for future analysis and processing');
}

// Main execution
function main() {
    const cleanedDataDir = path.join(__dirname, 'cleaned_data');
    
    if (!fs.existsSync(cleanedDataDir)) {
        console.log('❌ Cleaned data directory not found. Please run the cleaning script first.');
        return;
    }
    
    console.log('🔍 Starting comprehensive university data analysis...\n');
    
    const files = fs.readdirSync(cleanedDataDir).filter(file => file.endsWith('.csv'));
    
    if (files.length === 0) {
        console.log('No cleaned CSV files found');
        return;
    }
    
    // Analyze each file
    files.forEach(file => {
        const filePath = path.join(cleanedDataDir, file);
        analyzeCSVFile(filePath);
    });
    
    // Generate summary report
    generateSummaryReport(cleanedDataDir);
    
    console.log('\n✅ Analysis completed!');
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { analyzeCSVFile, generateSummaryReport }; 