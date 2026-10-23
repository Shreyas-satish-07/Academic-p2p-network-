import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import Statistics from '../components/dashboard/Statistics';
import AIAssistant from '../components/dashboard/AIAssistant';
import Deadlines from '../components/dashboard/Deadlines';
import Messages from '../components/dashboard/Messages';
import RecommendedGroups from '../components/dashboard/RecommendedGroups';
import PeerCard from '../components/dashboard/PeerCard';
import ResourceCard from '../components/dashboard/ResourceCard';
import AnnouncementCard from '../components/dashboard/AnnouncementCard';
import DiscussionCard from '../components/dashboard/DiscussionCard';
import LearningProgress from '../components/dashboard/LearningProgress';
import ActiveCollaborations from '../components/dashboard/ActiveCollaborations';
import ActivityTimeline from '../components/dashboard/ActivityTimeline';
import Button from '../components/ui/button';
import '../styles/messages.css';
export const Dashboard = () => {
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    return (<AppLayout>
      <WelcomeBanner />

      {/* Notice/Announcement banner */}
      <div className="announce">
        <span className="tag">NOTICE</span>
        <span>Hackathon registrations for Byte Build 2026 close Friday, Aug 21.</span>
        <button onClick={() => setShowNoticeModal(true)} className="underline ml-2 cursor-pointer font-semibold" style={{ background: 'none', border: 'none', color: 'inherit', padding: 0, cursor: 'pointer' }}>
          View details
        </button>
      </div>

      <Statistics />

      <AIAssistant />

      <div className="grid">
        <Deadlines />
        <Messages />
        <RecommendedGroups />
        <PeerCard />
        <ResourceCard />
        <AnnouncementCard />
        <DiscussionCard />
        <LearningProgress />
        <ActiveCollaborations />
        <ActivityTimeline />
      </div>

      {/* Announcement Details Modal */}
      {showNoticeModal && (<div className="collab-modal-overlay" onClick={() => setShowNoticeModal(false)}>
          <div className="collab-modal" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="collab-modal-title">Byte Build 2026 Hackathon</h3>
            <div className="collab-modal-field" style={{ marginTop: '8px', gap: '12px' }}>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--ink-soft)' }}>
                Byte Build 2026 is the annual flagship hackathon hosted by BMS College of Engineering. 
                Teams of 2 to 4 students will compete over 24 hours to design, build, and pitch solutions across domains like Fintech, Edtech, and Climate Action.
              </p>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--ink-soft)' }}>
                <strong>Important Schedule:</strong><br />
                • Registration Deadline: Friday, Aug 21, 2026 at 11:59 PM<br />
                • Event Date: August 27 - 28, 2026<br />
                • Venue: CSE Department Labs & Seminar Hall
              </p>
              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--ink-soft)' }}>
                <strong>Prizes & Rewards:</strong> Cash prize pool of ₹50,000, mentor feedback from top-tier industry engineering leaders, and certificates for all registered participants.
              </p>
            </div>
            <div className="collab-modal-actions" style={{ marginTop: '16px' }}>
              <Button className="primary" onClick={() => setShowNoticeModal(false)}>Close Details</Button>
            </div>
          </div>
        </div>)}
    </AppLayout>);
};
export default Dashboard;
