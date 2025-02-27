// components/FormulaBar.tsx
import React from 'react';

interface FormulaBarProps {
  activeCell: string;
  formula: string;
  onFormulaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormulaBar: React.FC<FormulaBarProps> = ({ activeCell, formula, onFormulaChange }) => {
  return (
    <div className="formula-bar">
      <div className="cell-address">{activeCell}</div>
      <div className="formula-input-container">
        <span className="formula-fx">fx</span>
        <input
          type="text"
          className="formula-input"
          value={formula}
          onChange={onFormulaChange}
        />
      </div>
    </div>
  );
};

export default FormulaBar;