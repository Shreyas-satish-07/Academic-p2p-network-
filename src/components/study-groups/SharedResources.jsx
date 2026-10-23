import React from 'react';
import { SHARED_RESOURCES } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle } from '../ui/card';
export const SharedResources = () => {
    const getIconStyles = (fileType) => {
        switch (fileType) {
            case 'PDF':
                return { background: 'var(--rust-tint)', color: 'var(--rust)' };
            case 'PPT':
                return { background: 'var(--marigold-tint)', color: 'var(--marigold)' };
            case 'DOC':
                return { background: 'var(--slate-tint)', color: 'var(--slate)' };
            default:
                return { background: 'var(--slate-tint)', color: 'var(--slate)' };
        }
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-slate">SR</span>
        <CardTitle>Shared resources</CardTitle>
      </CardHeader>
      
      {SHARED_RESOURCES.map((resource) => (<div key={resource.id} className="res-item">
          <div className="res-icon" style={getIconStyles(resource.fileType)}>
            {resource.fileType}
          </div>
          <div className="res-info">
            <div className="t">{resource.fileName}</div>
            <div className="s">
              {resource.uploadDate} · {resource.downloadCount} downloads
            </div>
          </div>
        </div>))}
    </Card>);
};
export default SharedResources;
