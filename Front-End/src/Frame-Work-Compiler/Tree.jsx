import './TreeCss.css'
import { useState } from 'react';
const FileTreeNode = ({ fileName, nodes, onSelect, path }) => {
    const isDir = !!nodes;
    
    const [isOpen, setIsOpen] = useState(false);


    const icon = isDir ? (
      <span className="file-icon folder-icon" onClick={(e) => {
        e.stopPropagation(); // Prevent triggering onSelect
        setIsOpen(!isOpen); // Toggle the folder's open state
      }}>
        {isOpen ? '📂' : '📁'} {/* Change icon based on open state */}
      </span>
    ) : (
      <span className="file-icon file-icon">📄</span> // File icon
    );
  

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isDir) return;
          onSelect(path);
        }}
        style={{ marginLeft: '20px' }}
        className={`file-node ${isDir ? 'directory-node' : ''}`} 
      >

          {icon}
           <p>{fileName}</p>
        {isOpen && nodes && fileName!=='node_modules'&& (
          <ul>
            {Object.keys(nodes).map((child) => (
              <li key={child}>
                <FileTreeNode
                  onSelect={onSelect}
                  path={path + "/" + child}
                  fileName={child}
                  nodes={nodes[child]}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  const FileTree = ({ tree, onSelect }) => {
    return (
      <div className="file-tree-container">
        <FileTreeNode onSelect={onSelect} fileName="/" path="" nodes={tree} />
      </div>
      
    );
  };
  
  export default FileTree;
  