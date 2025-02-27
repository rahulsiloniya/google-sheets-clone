# google-sheets-clone
An implementation of google sheets

## Requirements Met - All + Bonus (more statistical and data quality operations)

### Tech Stack
ReactJS + Typescript
Handsontable API for data grid
HyperFormula engine for formula parsing

### Steps to Run locally
1. nodeJS >= 22.0.0, ReactJS >= 17.0.0 and npm >= 10.0.0
  - versions used by me:
      nodeJS - 22.13.1
      ReactJS - 19.0.0
      npm - 10.9.2

2. Clone repository
3. `cd spreadsheet`
4. `npm install`
5. `npm run dev`

To view host address on network run:
  `npm run dev -- --host`


### Mathematical Functions Supported
The HyperFormula engine from Handsontable supports more than 400 in-built functions and also provides the ability to implement customized functions tailored to our needs.
1. SUM: Calculates the sum of a range of cells.
eg. `=SUM(A1:A7)` in formula bar or directly into the output cell.
2. AVERAGE: Calculates the average of a range of cells.
eg. `=AVERAGE(A1:A10)`
3. MAX: Returns the maximum value from a range of cells.
eg. `=MAX(A1:A10)`
4. MIN: Returns the minimum value from a range of cells.
eg. `=MIN(A1:A10)`
5. COUNT: Counts the number of cells containing numerical values in a range.
eg. `=COUNT(Value1, Value2, ...ValueN)`

### Data Quality Functions Supported
1. TRIM: Removes leading and trailing whitespace from a cell.
eg. `=TRIM("Text")`
2. UPPER: Converts the text in a cell to uppercase.
eg. `=UPPER("Text")` or reference to cell containing text `=UPPER(A1)`
3. LOWER: Converts the text in a cell to lowercase.
eg. `=LOWER("Text")` or reference to cell containing text `=LOWER(A1)`
4. REMOVE_DUPLICATES: Removes duplicate rows from a selected
range.
5. FIND_AND_REPLACE: Allows users to find and replace specific text
within a range of cells.

Functions 4 and 5 can be implemented by a combination of `FILTER` and `REPLACE/SUBSTITUTE` formulas.
