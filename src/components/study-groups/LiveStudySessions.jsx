import React, { useState } from 'react';
import { LIVE_STUDY_SESSIONS } from '../../data/studyGroupsData';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
export const LiveStudySessions = () => {
    const [joinedSessionIds, setJoinedSessionIds] = useState([]);
    const toggleJoin = (sessionId) => {
        setJoinedSessionIds((prev) => prev.includes(sessionId)
            ? prev.filter((id) => id !== sessionId)
            : [...prev, sessionId]);
    };
    return (<Card style={{ marginBottom: '18px' }}>
      <CardHeader>
        <span className="card-tab tab-rust">LS</span>
        <CardTitle>Live study sessions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="session-grid">
          {LIVE_STUDY_SESSIONS.map((session) => {
            const isJoined = joinedSessionIds.includes(session.id);
            return (<div key={session.id} className="session-card">
                <span className="session-live-badge">
                  <span className="d"/>
                  {session.status}
                </span>
                <div className="session-title">{session.title}</div>
                <div className="session-subject">{session.subject}</div>
                
                <div className="session-meta">
                  <span className="item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70">
                      <circle cx="8" cy="9" r="3"/>
                      <circle cx="17" cy="9" r="3"/>
                      <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
                    </svg>
                    {session.participants} in session
                  </span>
                  <span className="item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 opacity-70">
                      <circle cx="12" cy="12" r="9"/>
                      <path d="M12 7v5l3 3"/>
                    </svg>
                    {session.duration}
                  </span>
                </div>

                <Button className="session-join" onClick={() => toggleJoin(session.id)} style={{
                    backgroundColor: isJoined ? 'var(--line)' : 'var(--pine)',
                    color: isJoined ? 'var(--ink-soft)' : '#F6F4EC',
                }}>
                  {isJoined ? 'Joined' : 'Join session'}
                </Button>
              </div>);
        })}
        </div>
      </CardContent>
    </Card>);
};
export default LiveStudySessions;
