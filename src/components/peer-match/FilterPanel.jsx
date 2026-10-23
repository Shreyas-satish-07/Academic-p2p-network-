import React from 'react';
export const FilterPanel = ({ searchQuery, setSearchQuery, selectedDept, setSelectedDept, selectedSemester, setSelectedSemester, selectedSkills, setSelectedSkills, selectedProjects, setSelectedProjects, selectedResearch, setSelectedResearch, selectedAvailability, setSelectedAvailability, matchPct, setMatchPct, onReset, }) => {
    const toggleSkill = (skill) => {
        setSelectedSkills((prev) => prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]);
    };
    const toggleProject = (project) => {
        setSelectedProjects((prev) => prev.includes(project) ? prev.filter((p) => p !== project) : [...prev, project]);
    };
    const toggleResearch = (research) => {
        setSelectedResearch((prev) => prev.includes(research) ? prev.filter((r) => r !== research) : [...prev, research]);
    };
    const toggleAvailability = (availability) => {
        setSelectedAvailability((prev) => prev.includes(availability) ? prev.filter((a) => a !== availability) : [...prev, availability]);
    };
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-pine">FL</span>
        <span className="card-title">Filters</span>
        <button className="card-link" onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
          Reset
        </button>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="pm-search-in">Search Students</label>
        <input id="pm-search-in" type="text" className="filter-input w-full bg-[var(--card)] border border-[var(--line)] rounded-[10px] p-[8px_12px] text-[13px] text-[var(--ink)]" placeholder="e.g. Ananya or React..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="pm-dept-in">Department</label>
        <select id="pm-dept-in" className="filter-select w-full bg-[var(--card)] border border-[var(--line)] rounded-[10px] p-[8px_12px] text-[13px] text-[var(--ink)]" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
          <option value="All">All Departments</option>
          <option value="CSE">CSE</option>
          <option value="AIML">AIML</option>
          <option value="ECE">ECE</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label" htmlFor="pm-sem-in">Semester</label>
        <select id="pm-sem-in" className="filter-select w-full bg-[var(--card)] border border-[var(--line)] rounded-[10px] p-[8px_12px] text-[13px] text-[var(--ink)]" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
          <option value="All">All Semesters</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
          <option value="Semester 3">Semester 3</option>
          <option value="Semester 4">Semester 4</option>
          <option value="Semester 5">Semester 5</option>
        </select>
      </div>

      <div className="filter-group">
        <div className="filter-label">Skills</div>
        <div className="filter-chip-row">
          {['React', 'Python', 'Java', 'Machine Learning', 'Node.js', 'Spring Boot', 'MongoDB'].map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (<span key={skill} onClick={() => toggleSkill(skill)} className={`filter-chip ${isSelected ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                {skill}
              </span>);
        })}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Project interests</div>
        <div className="filter-chip-row">
          {['Web development', 'HCI', 'Applied ML', 'Computer vision', 'Distributed systems'].map((proj) => {
            const isSelected = selectedProjects.includes(proj);
            return (<span key={proj} onClick={() => toggleProject(proj)} className={`filter-chip ${isSelected ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                {proj}
              </span>);
        })}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Research interests</div>
        <div className="filter-chip-row">
          {['NLP', 'Sentiment analysis', 'HCI', 'Distributed systems'].map((res) => {
            const isSelected = selectedResearch.includes(res);
            return (<span key={res} onClick={() => toggleResearch(res)} className={`filter-chip ${isSelected ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                {res}
              </span>);
        })}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Availability</div>
        <div className="filter-chip-row">
          {['open', 'busy'].map((avail) => {
            const isSelected = selectedAvailability.includes(avail);
            return (<span key={avail} onClick={() => toggleAvailability(avail)} className={`filter-chip ${isSelected ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
                {avail === 'open' ? 'Open' : 'Busy'}
              </span>);
        })}
        </div>
      </div>

      <div className="filter-group">
        <div className="filter-label">Match percentage</div>
        <div className="filter-range">
          <div className="filter-range-track relative w-full h-[5px] bg-[var(--line)] rounded-[20px]">
            <div className="filter-range-fill absolute left-0 top-0 bottom-0 bg-[var(--pine)] rounded-[20px]" style={{ width: `${((matchPct - 50) / 50) * 100}%` }}/>
            <input type="range" min="50" max="100" value={matchPct} onChange={(e) => setMatchPct(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
          </div>
          <span className="filter-range-val">{matchPct}%+</span>
        </div>
      </div>
    </div>);
};
export default FilterPanel;
