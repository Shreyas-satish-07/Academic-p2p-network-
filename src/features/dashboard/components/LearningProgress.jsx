import React from 'react';
import { GraduationCap, Award, BookOpen } from 'lucide-react';

/**
 * LearningProgress component
 * Visualizes academic semester coursework completion across core engineering subjects
 * with semantic progress bars and accessible values.
 */
export const LearningProgress = ({ subjects = [] }) => {
  return (
    <article className="dashboard-card" aria-labelledby="learning-progress-heading">
      <div className="dashboard-card-header">
        <div className="card-title-group">
          <div className="card-icon-badge" aria-hidden="true">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 id="learning-progress-heading" className="card-title">
              Learning Progress
            </h2>
            <p className="card-subtitle">Active subject syllabi and revision tracking</p>
          </div>
        </div>

        <div className="overall-progress-pill" aria-label="Course completion pace: On Track">
          <Award size={13} className="text-pine" aria-hidden="true" />
          <span>Semester Pace</span>
        </div>
      </div>

      <div className="learning-progress-list" role="list">
        {subjects.map((item) => (
          <div key={item.id} className="progress-item" role="listitem">
            <div className="progress-info-row">
              <div className="progress-title-wrap">
                <BookOpen size={14} className="progress-subject-icon" aria-hidden="true" />
                <span className="progress-subject-name">{item.subject}</span>
              </div>
              <div className="progress-percentage-wrap">
                <span className="progress-percentage">{item.progress}%</span>
                {item.completedModules && (
                  <span className="progress-modules-count">
                    ({item.completedModules})
                  </span>
                )}
              </div>
            </div>

            {/* Semantic progressbar element */}
            <div
              className="progress-track"
              role="progressbar"
              aria-label={`${item.subject} progress`}
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`progress-fill progress-fill-${item.color || 'pine'}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
};

export default LearningProgress;
