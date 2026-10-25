import React from 'react';
import { Download, FileText, FileSpreadsheet, Presentation, File } from 'lucide-react';

/**
 * FilesPanel component
 * Lists all documents, roadmaps, and code attachments shared within the active workspace.
 */
export const FilesPanel = ({
  files = [],
  onDownloadFile,
}) => {
  const getFileIcon = (fileName, type) => {
    const ext = fileName?.split('.').pop()?.toLowerCase() || type;
    if (ext === 'pdf') {
      return (
        <div className="file-icon-wrap pdf" aria-hidden="true">
          <FileText size={16} />
        </div>
      );
    }
    if (ext === 'docx' || ext === 'doc') {
      return (
        <div className="file-icon-wrap docx" aria-hidden="true">
          <FileText size={16} />
        </div>
      );
    }
    if (ext === 'pptx' || ext === 'ppt') {
      return (
        <div className="file-icon-wrap pptx" aria-hidden="true">
          <Presentation size={16} />
        </div>
      );
    }
    if (ext === 'xlsx' || ext === 'csv') {
      return (
        <div className="file-icon-wrap docx" aria-hidden="true">
          <FileSpreadsheet size={16} />
        </div>
      );
    }
    return (
      <div className="file-icon-wrap default" aria-hidden="true">
        <File size={16} />
      </div>
    );
  };

  return (
    <div className="files-list" role="region" aria-label="Shared workspace files">
      {files.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: '24px 0', fontSize: '13px' }}>
          No files shared in this workspace yet.
        </div>
      ) : (
        files.map((file) => (
          <div key={file.id || file.name} className="file-row-card">
            {getFileIcon(file.name, file.type)}

            <div className="file-info">
              <span className="file-name" title={file.name}>
                {file.name}
              </span>
              <span className="file-meta">
                {file.uploadedBy} • {file.uploadedAt} • {file.size}
              </span>
            </div>

            <button
              type="button"
              className="file-dl-btn"
              onClick={() => onDownloadFile(file)}
              title={`Download ${file.name}`}
              aria-label={`Download ${file.name}`}
            >
              <Download size={13} aria-hidden="true" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default FilesPanel;
