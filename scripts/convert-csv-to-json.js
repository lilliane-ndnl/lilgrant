import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to clean text from CSV format (remove quotes, handle line breaks)
function cleanText(text) {
  if (!text || text === 'N/A') return '';
  return text.replace(/\r\n/g, '\n').replace(/"/g, '').trim();
}

// Function to convert CSV to JSON
function convertCsvToJson() {
  try {
    // Read the CSV file
    const csvPath = path.join(__dirname, 'data_source', 'scholarships.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Split into lines and remove the header
    const lines = csvContent.split('\n');
    const header = lines[0].split(',');
    const dataLines = lines.slice(1).filter(line => line.trim());
    
    const scholarships = [];
    
    dataLines.forEach((line, index) => {
      // Parse CSV line (handling commas within quoted fields)
      const values = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current); // Add the last value
      
      if (values.length >= 12) {
        const scholarship = {
          id: values[0]?.trim() || `SCH${String(index + 1).padStart(4, '0')}`,
          title: cleanText(values[1]),
          amount: cleanText(values[2]),
          awards: cleanText(values[3]),
          deadline: cleanText(values[4]),
          sponsors: cleanText(values[5]),
          description: cleanText(values[6]),
          eligibilityRequirements: cleanText(values[7]),
          studyLevel: cleanText(values[8]),
          fieldOfStudy: cleanText(values[9]),
          country: cleanText(values[10]),
          officialLink: cleanText(values[11]),
          additionalNotes: cleanText(values[12] || '')
        };
        
        scholarships.push(scholarship);
      }
    });
    
    // Write to JSON file
    const jsonPath = path.join(__dirname, '..', 'public', 'data', 'scholarships.json');
    fs.writeFileSync(jsonPath, JSON.stringify(scholarships, null, 2));
    
    console.log(`Successfully converted ${scholarships.length} scholarships from CSV to JSON`);
    console.log(`Output file: ${jsonPath}`);
    
  } catch (error) {
    console.error('Error converting CSV to JSON:', error);
  }
}

// Run the conversion
convertCsvToJson(); 