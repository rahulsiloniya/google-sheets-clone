// Spreadsheet.tsx
import React, { useRef, useState } from 'react';
import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import * as HyperFormula from 'hyperformula';
import './Spreadsheet.css';
import MenuBar from '../Menubar/Menubar';
import Toolbar from '../Toolbar/Toolbar';
import FormulaBar from '../FormulaBar/FormulaBar';

// Register all Handsontable modules
registerAllModules();

const Spreadsheet: React.FC = () => {
  const hotRef = useRef<HotTableRef>(null);
  const [activeCell, setActiveCell] = useState<string>('');
  const [formula, setFormula] = useState<string>('');
  const [selectedCells, setSelectedCells] = useState<{
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
  } | null>(null);

  // Store spreadsheet data in state
  const [data, setData] = useState<Array<Array<string | null>>>(
    Array(50)
      .fill(null)
      .map(() => Array(26).fill(null))
  );

  // Create column headers (A, B, C, etc.)
  const columnHeaders = Array(26)
    .fill(null)
    .map((_, i) => String.fromCharCode(65 + i));

  // Function to convert column index to letter
  const columnIndexToLetter = (index: number): string => {
    return String.fromCharCode(65 + index);
  };

  // Function to update formula bar when cell is selected
  const updateFormulaBar = (row: number, col: number, value: string) => {
    const cellAddress = `${columnIndexToLetter(col)}${row + 1}`;
    setActiveCell(cellAddress);
    setFormula(value || '');
  };

  const applyFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFormula = e.target.value;
    setFormula(newFormula);

    if (selectedCells) {
      const hot = hotRef.current?.hotInstance;
      if (hot) {
        // Update the data in state
        const newData = [...data];
        newData[selectedCells.startRow][selectedCells.startCol] = newFormula;
        setData(newData);

        // Update the Handsontable instance
        hot.setDataAtCell(selectedCells.startRow, selectedCells.startCol, newFormula);
      }
    }
  };

  // Function to add a new row
  const addRow = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const newData = [...data, Array(26).fill(null)]; // Add a new row to the data
      setData(newData);
      hot.alter('insert_row_below', hot.countRows());
    }
  };

  // Function to add a new column
  const addColumn = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const newData = data.map((row) => [...row, null]); // Add a new column to each row
      setData(newData);
      hot.alter('insert_col_end', hot.countCols());
    }
  };

  // Function to delete selected row
  const deleteRow = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot && selectedCells) {
      const newData = [...data];
      newData.splice(selectedCells.startRow, selectedCells.endRow - selectedCells.startRow + 1); // Remove the selected rows
      setData(newData);
      hot.alter('remove_row', selectedCells.startRow, selectedCells.endRow - selectedCells.startRow + 1);
    }
  };

  // Function to delete selected column
  const deleteColumn = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot && selectedCells) {
      const newData = data.map((row) => {
        const newRow = [...row];
        newRow.splice(selectedCells.startCol, selectedCells.endCol - selectedCells.startCol + 1); // Remove the selected columns
        return newRow;
      });
      setData(newData);
      hot.alter('remove_col', selectedCells.startCol, selectedCells.endCol - selectedCells.startCol + 1);
    }
  };

  // Function to handle cell selection
  const handleSelection = (row: number, column: number, row2: number, column2: number) => {
    setSelectedCells({
      startRow: Math.min(row, row2),
      startCol: Math.min(column, column2),
      endRow: Math.max(row, row2),
      endCol: Math.max(column, column2),
    });

    const hot = hotRef.current?.hotInstance;
    if (hot) {
      const value = hot.getDataAtCell(row, column);
      updateFormulaBar(row, column, value);
    }
  };

  // Function to handle changes to the spreadsheet data
  const handleChange = (changes: Array<[number, number, string | null, string | null]>) => {
    if (changes) {
      const newData = [...data];
      changes.forEach(([row, col, , newValue]) => {
        newData[row][col] = newValue;
      });
      setData(newData);
    }
  };

  // Function to apply bold formatting
  const applyBold = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot && selectedCells) {
      for (let row = selectedCells.startRow; row <= selectedCells.endRow; row++) {
        for (let col = selectedCells.startCol; col <= selectedCells.endCol; col++) {
          const cellMeta = hot.getCellMeta(row, col);
          const className = cellMeta.className || '';

          if (className.includes('bold')) {
            if (typeof className === 'string') {
              hot.setCellMeta(row, col, 'className', className.replace('bold', '').trim());
            }
          } else {
            hot.setCellMeta(row, col, 'className', `${className} bold`.trim());
          }
        }
      }
      hot.render();
    }
  };

  // Function to apply italic formatting
  const applyItalic = () => {
    const hot = hotRef.current?.hotInstance;
    if (hot && selectedCells) {
      for (let row = selectedCells.startRow; row <= selectedCells.endRow; row++) {
        for (let col = selectedCells.startCol; col <= selectedCells.endCol; col++) {
          const cellMeta = hot.getCellMeta(row, col);
          const className = cellMeta.className || '';

          if (className.includes('italic')) {
            if (typeof className === 'string') {
              hot.setCellMeta(row, col, 'className', className.replace('italic', '').trim());
            }
          } else {
            hot.setCellMeta(row, col, 'className', `${className} italic`.trim());
          }
        }
      }
      hot.render();
    }
  };

  return (
    <div className="spreadsheet-app">
      <MenuBar />
      <Toolbar 
      onAddRow={addRow} 
      onAddColumn={addColumn}
      onDeleteRow={deleteRow}
      onDeleteColumn={deleteColumn}
      onApplyBold={applyBold}
      onApplyItalic={applyItalic} />

      <FormulaBar 
        activeCell={activeCell} 
        formula={formula} 
        onFormulaChange={applyFormula} 
      />

      <div className="spreadsheet-container">
        <HotTable
          ref={hotRef}
          data={data}
          colHeaders={columnHeaders}
          rowHeaders={true}
          width={"100%"}
          height={"85vh"}
          rowHeights={24}
          colWidths={100}
          licenseKey="non-commercial-and-evaluation"
          contextMenu={true}
          stretchH="all"
          manualColumnResize={true}
          manualRowResize={true}
          formulas={{
            engine: HyperFormula.HyperFormula,
            sheetName: 'Sheet1',
          }}
          afterSelectionEnd={handleSelection}
          afterChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Spreadsheet;





























// import React, { useRef, useState } from 'react';
// import { HotTable, HotTableRef } from '@handsontable/react-wrapper';
// import { registerAllModules } from 'handsontable/registry';
// import 'handsontable/dist/handsontable.full.css';
// import * as HyperFormula from 'hyperformula';
// import './Spreadsheet.css';

// // Register all Handsontable modules
// registerAllModules();

// const Spreadsheet: React.FC = () => {
//   const hotRef = useRef<HotTableRef>(null);
//   const [activeCell, setActiveCell] = useState<string>('');
//   const [formula, setFormula] = useState<string>('');
//   const [selectedCells, setSelectedCells] = useState<{
//     startRow: number;
//     startCol: number;
//     endRow: number;
//     endCol: number;
//   } | null>(null);

//   // Store spreadsheet data in state
//   const [data, setData] = useState<Array<Array<string | null>>>(
//     Array(50)
//       .fill(null)
//       .map(() => Array(26).fill(null))
//   );

//   // Create column headers (A, B, C, etc.)
//   const columnHeaders = Array(26)
//     .fill(null)
//     .map((_, i) => String.fromCharCode(65 + i));

//   // Function to convert column index to letter
//   const columnIndexToLetter = (index: number): string => {
//     return String.fromCharCode(65 + index);
//   };

//   // Function to update formula bar when cell is selected
//   const updateFormulaBar = (row: number, col: number, value: string) => {
//     const cellAddress = `${columnIndexToLetter(col)}${row + 1}`;
//     setActiveCell(cellAddress);
//     setFormula(value || '');
//   };

//   // Function to apply formula when formula bar input changes
//   const applyFormula = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newFormula = e.target.value;
//     setFormula(newFormula);

//     if (selectedCells) {
//       const hot = hotRef.current?.hotInstance;
//       if (hot) {
//         // Update the data in state
//         const newData = [...data];
//         newData[selectedCells.startRow][selectedCells.startCol] = newFormula;
//         setData(newData);

//         // Update the Handsontable instance
//         hot.setDataAtCell(selectedCells.startRow, selectedCells.startCol, newFormula);
//       }
//     }
//   };

//   // Function to apply bold formatting
//   const applyBold = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot && selectedCells) {
//       for (let row = selectedCells.startRow; row <= selectedCells.endRow; row++) {
//         for (let col = selectedCells.startCol; col <= selectedCells.endCol; col++) {
//           const cellMeta = hot.getCellMeta(row, col);
//           const className = cellMeta.className || '';
          
//           if (className.includes('bold')) {
//             if (typeof className === 'string') {
//               hot.setCellMeta(row, col, 'className', className.replace('bold', '').trim());
//             }
//           } else {
//             hot.setCellMeta(row, col, 'className', `${className} bold`.trim());
//           }
//         }
//       }
//       hot.render();
//     }
//   };
  
//   // Function to apply italic formatting
//   const applyItalic = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot && selectedCells) {
//       for (let row = selectedCells.startRow; row <= selectedCells.endRow; row++) {
//         for (let col = selectedCells.startCol; col <= selectedCells.endCol; col++) {
//           const cellMeta = hot.getCellMeta(row, col);
//           const className = cellMeta.className || '';
          
//           if (className.includes('italic')) {
//             if (typeof className === 'string') {
//               hot.setCellMeta(row, col, 'className', className.replace('italic', '').trim());
//             }
//           } else {
//             hot.setCellMeta(row, col, 'className', `${className} italic`.trim());
//           }
//         }
//       }
//       hot.render();
//     }
//   };

//   // Function to add a new row
//   const addRow = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot) {
//       const newData = [...data, Array(26).fill(null)]; // Add a new row to the data
//       setData(newData);
//       hot.alter('insert_row_below', hot.countRows());
//     }
//   };

//   // Function to add a new column
//   const addColumn = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot) {
//       const newData = data.map((row) => [...row, null]); // Add a new column to each row
//       setData(newData);
//       hot.alter('insert_col_end', hot.countCols());
//     }
//   };

//   // Function to delete selected row
//   const deleteRow = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot && selectedCells) {
//       const newData = [...data];
//       newData.splice(selectedCells.startRow, selectedCells.endRow - selectedCells.startRow + 1); // Remove the selected rows
//       setData(newData);
//       hot.alter('remove_row', selectedCells.startRow, selectedCells.endRow - selectedCells.startRow + 1);
//     }
//   };

//   // Function to delete selected column
//   const deleteColumn = () => {
//     const hot = hotRef.current?.hotInstance;
//     if (hot && selectedCells) {
//       const newData = data.map((row) => {
//         const newRow = [...row];
//         newRow.splice(selectedCells.startCol, selectedCells.endCol - selectedCells.startCol + 1); // Remove the selected columns
//         return newRow;
//       });
//       setData(newData);
//       hot.alter('remove_col', selectedCells.startCol, selectedCells.endCol - selectedCells.startCol + 1);
//     }
//   };

//   // Function to handle cell selection
//   const handleSelection = (row: number, column: number, row2: number, column2: number) => {
//     setSelectedCells({
//       startRow: Math.min(row, row2),
//       startCol: Math.min(column, column2),
//       endRow: Math.max(row, row2),
//       endCol: Math.max(column, column2),
//     });

//     const hot = hotRef.current?.hotInstance;
//     if (hot) {
//       const value = hot.getDataAtCell(row, column);
//       updateFormulaBar(row, column, value);
//     }
//   };

//   // Function to handle changes to the spreadsheet data
//   type CellChange = [number, number, string | null, string | null];
//   // const handleChange = (changes: Array<[number, number, string | null, string | null]> | null) => {
//   const handleChange = (changes: CellChange[]) => {
//     if (changes) {
//       const newData = [...data];
//       changes.forEach(([row, col, , newValue]) => {
//         newData[row][col] = newValue;
//       });
//       setData(newData);
//     }
//   };

//   return (
//     <div className="spreadsheet-app">
//       <div className="menu-bar">
//         <div className="file-menu">File</div>
//         <div className="edit-menu">Edit</div>
//         <div className="view-menu">View</div>
//         <div className="insert-menu">Insert</div>
//         <div className="format-menu">Format</div>
//         <div className="data-menu">Data</div>
//         <div className="tools-menu">Tools</div>
//         <div className="help-menu">Help</div>
//       </div>

//       <div className="toolbar">
//         <button onClick={addRow}>Add Row</button>
//         <button onClick={addColumn}>Add Column</button>
//         <button onClick={deleteRow}>Delete Row</button>
//         <button onClick={deleteColumn}>Delete Column</button>
//         <button onClick={applyBold}><strong>B</strong></button>
//         <button onClick={applyItalic}><em>I</em></button>
//        </div>

//       <div className="formula-bar">
//         <div className="cell-address">{activeCell}</div>
//         <div className="formula-input-container">
//           <span className="formula-fx">fx</span>
//           <input
//             type="text"
//             className="formula-input"
//             value={formula}
//             onChange={applyFormula}
//           />
//         </div>
//       </div>

//       <div className="spreadsheet-container">
//         <HotTable
//           ref={hotRef}
//           data={data} // Use the state-managed data
//           colHeaders={columnHeaders}
//           rowHeaders={true}
//           width="100%"
//           height="600"
//           rowHeights={24}
//           colWidths={100}
//           licenseKey="non-commercial-and-evaluation"
//           contextMenu={true}
//           stretchH="all"
//           manualColumnResize={true}
//           manualRowResize={true}
//           formulas={{
//             engine: HyperFormula.HyperFormula,
//             sheetName: 'Sheet1',
//           }}
//           afterSelectionEnd={(row, col, row2, col2) => handleSelection(row, col, row2, col2)}
//           afterChange={handleChange} // Handle changes to the data
//         />
//       </div>
//     </div>
//   );
// };

// export default Spreadsheet;
