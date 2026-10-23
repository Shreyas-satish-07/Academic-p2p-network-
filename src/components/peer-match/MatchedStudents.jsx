import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MATCHED_STUDENTS } from '../../data/peerMatchData';
import Button from '../ui/button';
import { ROUTES } from '../../constants/routes';
export const MatchedStudents = ({ searchQuery, selectedDept, selectedSemester, selectedSkills, selectedProjects, selectedResearch, selectedAvailability, matchPct, onReset, }) => {
    const navigate = useNavigate();
    const [connectedIds, setConnectedIds] = useState([]);
    const [invitedIds, setInvitedIds] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    const toggleConnect = (id, name) => {
        setConnectedIds((prev) => {
            const isCurrentlyConnected = prev.includes(id);
            if (isCurrentlyConnected) {
                showToast(`Disconnected from ${name}`);
                return prev.filter((item) => item !== id);
            }
            else {
                showToast(`Connection request sent to ${name}`);
                return [...prev, id];
            }
        });
    };
    const toggleInvite = (id, name) => {
        setInvitedIds((prev) => {
            const isCurrentlyInvited = prev.includes(id);
            if (isCurrentlyInvited) {
                showToast(`Cancelled invitation to ${name}`);
                return prev.filter((item) => item !== id);
            }
            else {
                showToast(`Collaboration invitation sent to ${name}`);
                return [...prev, id];
            }
        });
    };
    const getAvatarStyles = (id) => {
        switch (id) {
            case 'AR':
            case 'AR-featured':
                return { backgroundColor: 'var(--pine-tint)', color: 'var(--pine-dark)' };
            case 'RS':
                return { backgroundColor: 'var(--marigold-tint)', color: 'var(--marigold)' };
            case 'PN':
                return { backgroundColor: 'var(--slate-tint)', color: 'var(--slate)' };
            case 'DP':
                return { backgroundColor: 'var(--rust-tint)', color: 'var(--rust)' };
            default:
                return { backgroundColor: 'var(--pine-tint)', color: 'var(--pine-dark)' };
        }
    };
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase();
    };
    // Perform dynamic filtering based on active states
    const filteredStudents = MATCHED_STUDENTS.filter((student) => {
        // 1. Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            const nameMatch = student.name.toLowerCase().includes(query);
            const skillMatch = student.skills?.some((s) => s.toLowerCase().includes(query));
            const interestMatch = student.interests?.some((i) => i.toLowerCase().includes(query));
            const researchMatch = student.researchAreas?.some((r) => r.toLowerCase().includes(query));
            if (!nameMatch && !skillMatch && !interestMatch && !researchMatch)
                return false;
        }
        // 2. Department Filter
        if (selectedDept !== 'All' && student.department !== selectedDept)
            return false;
        // 3. Semester Filter
        if (selectedSemester !== 'All' && student.semester !== selectedSemester)
            return false;
        // 4. Match Percentage
        if (student.matchPercentage < matchPct)
            return false;
        // 5. Skills Chips Filters
        if (selectedSkills.length > 0) {
            const hasSkill = student.skills?.some((s) => selectedSkills.includes(s));
            if (!hasSkill)
                return false;
        }
        // 6. Project Interest Chips Filters
        if (selectedProjects.length > 0) {
            const hasProj = student.interests?.some((p) => selectedProjects.includes(p));
            if (!hasProj)
                return false;
        }
        // 7. Research Interest Chips Filters
        if (selectedResearch.length > 0) {
            const hasResearch = student.researchAreas?.some((r) => selectedResearch.includes(r));
            if (!hasResearch)
                return false;
        }
        // 8. Availability Filter
        if (selectedAvailability.length > 0) {
            if (!selectedAvailability.includes(student.collaborationStatus))
                return false;
        }
        return true;
    });
    return (<div className="pm-matches">
      <div className="card">
        <div className="card-head">
          <span className="card-tab tab-pine">MS</span>
          <span className="card-title">Matched students</span>
          <span className="card-count">{filteredStudents.length} results</span>
        </div>

        {filteredStudents.length === 0 ? (<div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
            }}>
            <span style={{ fontSize: '36px', marginBottom: '12px' }}>🔍</span>
            <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>No matching peers found.</div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '4px', marginBottom: '20px' }}>
              Try widening your filters or search options.
            </div>
            <Button className="outline" onClick={onReset}>Clear all filters</Button>
          </div>) : (filteredStudents.map((student) => {
            const isConnected = connectedIds.includes(student.id);
            const isInvited = invitedIds.includes(student.id);
            return (<div key={student.id} className="match-card">
                <div className="match-avatar" style={getAvatarStyles(student.id)}>
                  {getInitials(student.name)}
                </div>
                
                <div className="match-body">
                  <div className="match-head">
                    <div>
                      <div className="match-name">{student.name}</div>
                      <div className="match-meta">
                        {student.department} · {student.semester}
                      </div>
                    </div>
                    {student.collaborationStatus === 'open' ? (<span className="match-status status-open">Open to collaborate</span>) : (<span className="match-status status-busy">Limited availability</span>)}
                  </div>
                  
                  <div className="match-interest-row">
                    <div className="match-interest-label">Skills</div>
                    <div className="chip-row">
                      {student.skills?.map((skill, idx) => (<span key={idx} className="skill-chip">
                          {skill}
                        </span>))}
                    </div>
                  </div>
                  
                  <div className="match-interest-row">
                    <div className="match-interest-label">Academic &amp; research interests</div>
                    <div className="chip-row">
                      {student.interests?.map((interest, idx) => (<span key={idx} className="skill-chip">
                          {interest}
                        </span>))}
                    </div>
                  </div>
                </div>
                
                <div className="match-actions">
                  <span className="match-pct match-pct-lg">
                    {student.matchPercentage}% match
                  </span>
                  <div className="match-btns">
                    <button className="mbtn mbtn-outline" onClick={() => navigate(ROUTES.PEER_MATCH)}>
                      View Profile
                    </button>
                    <button onClick={() => toggleInvite(student.id, student.name)} className="mbtn mbtn-ghost">
                      {isInvited ? 'Invited' : 'Invite'}
                    </button>
                    <button onClick={() => toggleConnect(student.id, student.name)} className="mbtn mbtn-solid" style={{
                    backgroundColor: isConnected ? 'var(--line)' : 'var(--pine)',
                    color: isConnected ? 'var(--ink-soft)' : '#F6F4EC',
                    fontWeight: isConnected ? '500' : '700'
                }}>
                      {isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>);
        }))}
      </div>

      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}
    </div>);
};
export default MatchedStudents;
