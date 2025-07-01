const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const DETAILS_DIR = path.resolve(__dirname, '..', 'public', 'data', 'details');
const FOS_CSV_PATH = path.resolve(__dirname, 'data_source', 'Most-Recent-Cohorts-Field-of-Study.csv');

// Process CSV file in chunks
function readCSVStream() {
  const parser = parse({
    columns: true,
    skip_empty_lines: true
  });

  const data = new Map(); // Use Map to store data by UNITID
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(FOS_CSV_PATH)
      .pipe(parser)
      .on('data', (row) => {
        if (!data.has(row.UNITID)) {
          data.set(row.UNITID, []);
        }
        data.get(row.UNITID).push(row);
      })
      .on('end', () => resolve(data))
      .on('error', reject);
  });
}

async function processJSONFile(filePath, fosDataMap) {
  try {
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    const unitId = path.basename(filePath, '.json');

    // Get field of study data for this school
    const schoolFosData = fosDataMap.get(unitId) || [];

    // Update fields of study with new earnings structure
    if (jsonData.fieldsOfStudy) {
      jsonData.fieldsOfStudy = jsonData.fieldsOfStudy.map(field => {
        const matchingFos = schoolFosData.find(
          row => row.CIPDESC === field.CIPDESC && row.CREDDESC === field.CREDDESC
        );

        if (matchingFos) {
          const medianAnnualEarnings = matchingFos.EARN_MDN_5YR || 'PS';
          return {
            CIPDESC: field.CIPDESC,
            CREDDESC: field.CREDDESC,
            medianAnnualEarnings: medianAnnualEarnings,
            numberOfGraduates: matchingFos.EARN_COUNT_WNE_5YR || 'PS',
            monthlyEarnings: medianAnnualEarnings === 'PS' ? 'PS' : Math.round(parseInt(medianAnnualEarnings) / 12)
          };
        }
        return field;
      });
    }

    // Write updated JSON back to file
    await fs.promises.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  try {
    console.log('Reading Field of Study CSV data...');
    const fosDataMap = await readCSVStream();

    console.log('Getting list of JSON files...');
    const files = await fs.promises.readdir(DETAILS_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    console.log(`Processing ${jsonFiles.length} JSON files...`);
    let processed = 0;
    for (const file of jsonFiles) {
      await processJSONFile(path.join(DETAILS_DIR, file), fosDataMap);
      processed++;
      if (processed % 100 === 0) {
        console.log(`Processed ${processed} files...`);
      }
    }

    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 