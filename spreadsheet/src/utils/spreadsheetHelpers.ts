// src/utils/spreadsheetHelpers.ts
import Handsontable from 'handsontable';

/**
 * Generate initial data for the spreadsheet
 * @param rows - Number of rows
 * @param cols - Number of columns
 * @returns 2D array of initial data
 */
export function generateInitialData(rows: number, cols: number): (number | null)[][] {
  const data: (number | null)[][] = [];
  
  for (let i = 0; i < rows; i++) {
    const row: (number | null)[] = [];
    for (let j = 0; j < cols; j++) {
      // Add some sample numeric data to demonstrate formulas
      if (i < 5 && j < 5) {
        row.push(Math.floor(Math.random() * 100));
      } else {
        row.push(null);
      }
    }
    data.push(row);
  }
  
  return data;
}

/**
 * Generate column headers (A, B, C, ..., Z, AA, AB, ...)
 * @param count - Number of columns
 * @returns Array of column headers
 */
export function generateColumnHeaders(count: number): string[] {
  const headers: string[] = [];
  
  for (let i = 0; i < count; i++) {
    headers.push(numToColName(i));
  }
  
  return headers;
}

/**
 * Convert column number to column name (0 -> A, 1 -> B, ..., 26 -> AA)
 * @param num - Column number (0-based)
 * @returns Column name
 */
export function numToColName(num: number): string {
  let colName = '';
  
  while (num >= 0) {
    colName = String.fromCharCode(65 + (num % 26)) + colName;
    num = Math.floor(num / 26) - 1;
  }
  
  return colName;
}

/**
 * Get cell range string in A1 notation (e.g., "A1:C3")
 * @param startRow - Start row index
 * @param startCol - Start column index
 * @param endRow - End row index
 * @param endCol - End column index
 * @param hot - The Handsontable instance
 * @returns Cell range in A1 notation
 */
export function getCellRangeString(
  startRow: number, 
  startCol: number, 
  endRow: number, 
  endCol: number, 
  hot: Handsontable
): string {
  // Get column headers
  const colHeaders = hot.getColHeader() as string[];
  
  const startColHeader = colHeaders[startCol];
  const endColHeader = colHeaders[endCol];
  
  const startCell = `${startColHeader}${startRow + 1}`;
  const endCell = `${endColHeader}${endRow + 1}`;
  
  return `${startCell}:${endCell}`;
}