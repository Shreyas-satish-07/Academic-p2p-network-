import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RECOMMENDED_GROUPS } from '../../data/students';
import { ROUTES } from '../../constants/routes';
export const RecommendedGroups = () => {
    const navigate = useNavigate();
    return (<div className="card cursor-pointer" onClick={() => navigate(ROUTES.STUDY_GROUPS)}>
      <div className="card-head">
        <span className="card-tab tab-pine">SG</span>
        <span className="card-title">Recommended groups</span>
        <span className="card-link" style={{ marginLeft: 'auto' }}>Explore →</span>
      </div>
      
      {RECOMMENDED_GROUPS.map((group) => (<div key={group.id} className="group-item">
          <div className="group-swatch" style={{ background: group.bgClass }}></div>
          <div className="group-info">
            <div className="t">{group.name}</div>
            <div className="s">{group.info}</div>
          </div>
          <span className="match-pct">{group.matchPct}%</span>
        </div>))}
    </div>);
};
export default RecommendedGroups;
