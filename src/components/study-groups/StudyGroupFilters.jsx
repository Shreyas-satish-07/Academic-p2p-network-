import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
export const StudyGroupFilters = () => {
    const [selectedSubject, setSelectedSubject] = useState('Machine Learning');
    const [selectedDifficulty, setSelectedDifficulty] = useState('Beginner');
    const [selectedGroupSize, setSelectedGroupSize] = useState('Medium (10–25)');
    const [selectedActivity, setSelectedActivity] = useState('Active today');
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-pine">FL</span>
        <CardTitle>Filters</CardTitle>
      </CardHeader>

      <div className="filter-group">
        <div className="filter-label">Department</div>
        <div className="filter-select">
          Computer Science
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px] opacity-60">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Semester</div>
        <div className="filter-select">
          All semesters
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px] opacity-60">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Subject</div>
        <div className="filter-chip-row">
          {['Machine Learning', 'DBMS', 'DSA', 'Operating Systems', 'Web Dev'].map((sub) => (<span key={sub} className={`filter-chip ${selectedSubject === sub ? 'selected' : ''}`} onClick={() => setSelectedSubject(sub)}>
              {sub}
            </span>))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Difficulty level</div>
        <div className="filter-chip-row">
          {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (<span key={diff} className={`filter-chip ${selectedDifficulty === diff ? 'selected' : ''}`} onClick={() => setSelectedDifficulty(diff)}>
              {diff}
            </span>))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Group size</div>
        <div className="filter-chip-row">
          {['Small (<10)', 'Medium (10–25)', 'Large (25+)'].map((sz) => (<span key={sz} className={`filter-chip ${selectedGroupSize === sz ? 'selected' : ''}`} onClick={() => setSelectedGroupSize(sz)}>
              {sz}
            </span>))}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Activity status</div>
        <div className="filter-chip-row">
          {['Active today', 'Live now'].map((act) => (<span key={act} className={`filter-chip ${selectedActivity === act ? 'selected' : ''}`} onClick={() => setSelectedActivity(act)}>
              {act}
            </span>))}
        </div>
      </div>

      <Button className="filter-apply">Apply filters</Button>
    </Card>);
};
export default StudyGroupFilters;
