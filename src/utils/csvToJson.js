import fs from 'fs';
import csv from 'csv-parser';

export const convertCsvToJson = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(inputPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        fs.writeFile(outputPath, JSON.stringify(results, null, 2), (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}; 