import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateScholarshipsJson() {
  try {
    const jsonPath = path.join(__dirname, '..', 'public', 'data', 'scholarships.json');
    console.log('Reading file from:', jsonPath);
    
    // Check if file exists
    if (!fs.existsSync(jsonPath)) {
      console.error('❌ File does not exist:', jsonPath);
      return false;
    }
    
    // Read and parse JSON
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const scholarships = JSON.parse(fileContent);
    
    // Validate structure
    if (!Array.isArray(scholarships)) {
      console.error('❌ JSON is not an array');
      return false;
    }
    
    console.log('✅ JSON file is valid');
    console.log('📊 Total scholarships:', scholarships.length);
    
    // Check a few sample entries
    if (scholarships.length > 0) {
      const sample = scholarships[0];
      const requiredFields = ['id', 'title', 'amount', 'deadline', 'sponsors', 'description', 'eligibilityRequirements', 'studyLevel', 'fieldOfStudy', 'country', 'officialLink'];
      
      console.log('🔍 Sample scholarship:', sample.title);
      
      for (const field of requiredFields) {
        if (!(field in sample)) {
          console.error(`❌ Missing field '${field}' in sample scholarship`);
          return false;
        }
      }
      console.log('✅ All required fields present in sample');
    }
    
    // File size check
    const stats = fs.statSync(jsonPath);
    console.log('📁 File size:', Math.round(stats.size / 1024), 'KB');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error validating JSON:', error.message);
    return false;
  }
}

console.log('🔍 Validating scholarships.json...\n');
const isValid = validateScholarshipsJson();

if (isValid) {
  console.log('\n✅ Validation passed! The JSON file should work correctly.');
} else {
  console.log('\n❌ Validation failed! Please check the issues above.');
} 