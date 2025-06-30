import { convertCsvToJson } from './csvToJson';
import * as path from 'path';
import * as fs from 'fs';

const dataDir = path.join(process.cwd(), 'public/data/University and College data files');
const outputDir = path.join(process.cwd(), 'public/data');

// List of CSV files to convert
const csvFiles = [
  'Fulldata 675 universities and colleges.csv',
  'THE & QS Top 200 Global Universities.csv',
  'Ivy League + Stanford Full Data.csv',
  'Zero EFC.csv',
  'ED + EA data.csv',
  'University and College data file - ED + EA data.csv'
];

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert each CSV file to JSON
const convertAllFiles = async () => {
  for (const csvFile of csvFiles) {
    const inputPath = path.join(dataDir, csvFile);
    const outputFileName = csvFile.replace('.csv', '.json');
    const outputPath = path.join(outputDir, outputFileName);

    try {
      console.log(`Converting ${csvFile} to JSON...`);
      await convertCsvToJson(inputPath, outputPath);
      console.log(`Successfully converted ${csvFile} to ${outputFileName}`);
    } catch (error) {
      console.error(`Error converting ${csvFile}:`, error);
    }
  }
};

convertAllFiles()
  .then(() => {
    console.log('All files converted successfully!');
  })
  .catch((error) => {
    console.error('Error during conversion:', error);
    process.exit(1);
  }); 