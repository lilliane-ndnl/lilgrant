import * as XLSX from 'xlsx';

export interface ExcelData {
  [key: string]: any;
}

/**
 * Reads an Excel file from the public directory and returns its contents as JSON
 * @param filePath - Path to the Excel file relative to the public directory
 * @returns Promise containing the Excel data as an array of objects
 */
export const readExcelFile = async (filePath: string): Promise<ExcelData[]> => {
  try {
    // Fetch the file from the public directory
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
    }

    // Convert the response to an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Read the Excel file
    const workbook = XLSX.read(arrayBuffer);

    // Get the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return jsonData as ExcelData[];
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw error;
  }
};

/**
 * Example usage:
 * const data = await readExcelFile('/data/University and College data file.xlsx');
 */ 