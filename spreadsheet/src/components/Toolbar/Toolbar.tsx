// components/Toolbar.tsx
import React from 'react';

interface ToolbarProps {
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteRow: () => void;
  onDeleteColumn: () => void;
  onApplyBold: () => void;
  onApplyItalic: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddRow,
  onAddColumn,
  onDeleteRow,
  onDeleteColumn,
  onApplyBold,
  onApplyItalic,
}) => {
  return (
    <div className="toolbar">
      <button onClick={onAddRow}>Add Row</button>
      <button onClick={onAddColumn}>Add Column</button>
      <button onClick={onDeleteRow}>Delete Row</button>
      <button onClick={onDeleteColumn}>Delete Column</button>
      <button onClick={onApplyBold}><strong>B</strong></button>
      <button onClick={onApplyItalic}><em>I</em></button>
    </div>
  );
};

export default Toolbar;