import React from 'react';
import { motion } from 'framer-motion';
import { LEARNING_PROGRESS } from '../../data/students';
export const LearningProgress = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-pine">LP</span>
        <span className="card-title">Learning progress</span>
      </div>
      
      {LEARNING_PROGRESS.map((item) => (<div key={item.id} className="lp-item">
          <div className="lp-head">
            <span className="t">{item.title}</span>
            <span className="lp-tags">
              <span className="lp-status" style={{ background: item.statusBg, color: item.statusColor }}>
                {item.statusText}
              </span>
              <span className="p">{item.percentage}%</span>
            </span>
          </div>
          <div className="bar-track">
            <motion.div className="bar-fill" initial={{ width: '0%' }} animate={{ width: `${item.percentage}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}/>
          </div>
        </div>))}
    </div>);
};
export default LearningProgress;
