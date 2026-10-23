import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
export const Certifications = ({ certifications }) => {
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-marigold">CT</span>
        <CardTitle>Certifications</CardTitle>
      </CardHeader>
      <CardContent>
        {certifications.map((cert) => (<div key={cert.id} className="cert-item">
            <div className="cert-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="6"/>
                <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/>
              </svg>
            </div>
            <div className="cert-info">
              <div className="t">{cert.title}</div>
              <div className="o">{cert.organization}</div>
            </div>
            <div className="cert-date">{cert.date}</div>
          </div>))}
      </CardContent>
    </Card>);
};
export default Certifications;
