// components/MenuBar.tsx
import React from 'react';

const MenuBar: React.FC = () => {
  return (
    <div className="menu-bar">
      <div className="file-menu">File</div>
      <div className="edit-menu">Edit</div>
      <div className="view-menu">View</div>
      <div className="insert-menu">Insert</div>
      <div className="format-menu">Format</div>
      <div className="data-menu">Data</div>
      <div className="tools-menu">Tools</div>
      <div className="help-menu">Help</div>
    </div>
  );
};

export default MenuBar;