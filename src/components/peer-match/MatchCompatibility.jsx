import React from 'react';
import Progress from '../ui/progress';
export const MatchCompatibility = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-marigold">MC</span>
        <span className="card-title">Match compatibility</span>
      </div>
      <div className="compat-top">
        <div className="compat-avatar">AR</div>
        <div>
          <div className="compat-name">Ananya Rao</div>
          <div className="compat-sub">CSE · Sem 5</div>
        </div>
        <div className="compat-overall">
          <div className="n">95%</div>
          <div className="l">Overall</div>
        </div>
      </div>
      <div className="compat-row">
        <div className="compat-row-head">
          <span className="l">Skills match</span>
          <span className="v">96%</span>
        </div>
        <Progress value={96}/>
      </div>
      <div className="compat-row">
        <div className="compat-row-head">
          <span className="l">Project match</span>
          <span className="v">92%</span>
        </div>
        <Progress value={92}/>
      </div>
      <div className="compat-row">
        <div className="compat-row-head">
          <span className="l">Research match</span>
          <span className="v">88%</span>
        </div>
        <Progress value={88}/>
      </div>
      <div className="compat-row">
        <div className="compat-row-head">
          <span className="l">Availability match</span>
          <span className="v">99%</span>
        </div>
        <Progress value={99}/>
      </div>
    </div>);
};
export default MatchCompatibility;
