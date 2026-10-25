import React from 'react';
import { Radio, Users, Clock, ArrowRight } from 'lucide-react';
import { TODAY_LIVE_SESSIONS } from '../studyGroupsData';

/**
 * LiveSessions component
 * 
 * Section 5: Live study sessions happening today
 * - DSA Problem Solving Sprint — Live now
 * - Gradient Descent: Backpropagation Basics — Starts 6:00 PM
 * - DBMS Revision Circle — Starts 7:30 PM
 * Each shows:
 * - Group name, Topic, Start time, Participant count, Live/upcoming state, Join Session button
 * Clicking Join Session triggers toast: "Session access will be available after backend integration."
 * 
 * Future Backend Architecture:
 * GET /api/study-groups/live-sessions -> Returns real-time active study rooms & WebRTC tokens
 */
export const LiveSessions = ({
  sessions = TODAY_LIVE_SESSIONS,
  onJoinSession,
}) => {
  return (
    <section className="sg-live-section" aria-labelledby="sg-live-heading">
      <div className="sg-live-header">
        <div className="sg-live-title-group">
          <div className="sg-live-icon-box" aria-hidden="true">
            <Radio size={18} />
          </div>
          <div>
            <h2 id="sg-live-heading" className="sg-live-title">
              Live Study Sessions Today
            </h2>
            <p className="sg-live-subtitle">
              Join active audio rooms, live whiteboard discussions, and problem-solving sprints scheduled for today
            </p>
          </div>
        </div>
      </div>

      <div className="sg-live-grid" role="list">
        {sessions.map((session) => (
          <article key={session.id} className="sg-live-room-card" role="listitem">
            <div className="sg-live-room-top">
              <span className="font-semibold text-pine text-sm">{session.groupName}</span>

              {session.isLive ? (
                <div className="sg-live-attendees-pill">
                  <span className="sg-live-dot" aria-hidden="true" />
                  <span>Live now</span>
                </div>
              ) : (
                <div className="sg-upcoming-pill">
                  <Clock size={11} aria-hidden="true" />
                  <span>{session.startTime}</span>
                </div>
              )}
            </div>

            <h3 className="sg-live-topic">
              {session.topic}
            </h3>

            <div className="flex items-center justify-between text-xs text-ink-soft mt-1">
              <div className="flex items-center gap-1.5">
                <Users size={12} className="text-slate" aria-hidden="true" />
                <span>{session.participantCount} students attending</span>
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                {session.tags.map((tag) => (
                  <span key={tag} className="sg-tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="sg-live-footer">
              <span className="text-xs text-ink-faint">
                {session.isLive ? 'Room is currently active' : session.startTime}
              </span>

              <button
                type="button"
                className="sg-live-join-btn"
                onClick={() => onJoinSession(session)}
                aria-label={`Join Session for ${session.groupName}`}
              >
                <span>Join Session</span>
                <ArrowRight size={12} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LiveSessions;
