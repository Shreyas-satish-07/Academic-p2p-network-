import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import ProfileHero from '../components/profile/ProfileHero';
import AboutCard from '../components/profile/AboutCard';
import AcademicInfo from '../components/profile/AcademicInfo';
import SkillsSection from '../components/profile/SkillsSection';
import PeerNetwork from '../components/profile/PeerNetwork';
import Certifications from '../components/profile/Certifications';
import ProjectPortfolio from '../components/profile/ProjectPortfolio';
import ResourceContributions from '../components/profile/ResourceContributions';
import Achievements from '../components/profile/Achievements';
import ActivityTimeline from '../components/profile/ActivityTimeline';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import Button from '../components/ui/button';
import { PROFILE_DATA, PROJECTS, CERTIFICATIONS, RESOURCES, ACHIEVEMENTS, PEERS, PROFILE_COMPLETION, SOCIAL_LINKS, ACTIVITIES, PROFILE_STATS, ACADEMIC_BATCH, } from '../data/profileData';
import '../styles/profile.css';
import '../styles/messages.css';
export const Profile = () => {
    const [profile, setProfile] = useState({
        name: PROFILE_DATA.name,
        department: PROFILE_DATA.department,
        semester: PROFILE_DATA.semester,
        college: PROFILE_DATA.college,
        cgpa: PROFILE_DATA.cgpa,
        biography: PROFILE_DATA.biography,
        careerGoals: PROFILE_DATA.careerGoals,
        researchInterests: PROFILE_DATA.researchInterests,
        academicInterests: PROFILE_DATA.academicInterests,
        skills: PROFILE_DATA.skills,
        headline: 'Aspiring full-stack developer · Building things students actually use',
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    // Edit fields temp state
    const [editHeadline, setEditHeadline] = useState('');
    const [editBiography, setEditBiography] = useState('');
    const [editCareerGoals, setEditCareerGoals] = useState('');
    const [editResearchInterests, setEditResearchInterests] = useState('');
    const [editAcademicInterests, setEditAcademicInterests] = useState('');
    const [editSkills, setEditSkills] = useState('');
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    const handleOpenEditModal = () => {
        setEditHeadline(profile.headline);
        setEditBiography(profile.biography);
        setEditCareerGoals(profile.careerGoals);
        setEditResearchInterests(profile.researchInterests);
        setEditAcademicInterests(profile.academicInterests);
        setEditSkills(profile.skills.join(', '));
        setShowEditModal(true);
    };
    const handleSaveProfile = (e) => {
        e.preventDefault();
        setProfile(prev => ({
            ...prev,
            headline: editHeadline,
            biography: editBiography,
            careerGoals: editCareerGoals,
            researchInterests: editResearchInterests,
            academicInterests: editAcademicInterests,
            skills: editSkills.split(',').map(s => s.trim()).filter(Boolean),
        }));
        setShowEditModal(false);
        showToast('Profile updated successfully');
    };
    return (<AppLayout>
      <motion.div className="profile-grid w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="col-stack">
          {/* 1. Profile Hero */}
          <ProfileHero name={profile.name} headline={profile.headline} department="CSE" semester="Sem 1" college={profile.college} avatar="SR" statistics={PROFILE_STATS} socialLinks={SOCIAL_LINKS} onEditClick={handleOpenEditModal} onShowToast={showToast}/>

          <div className="profile-columns-layout">
            <div className="profile-left-col">
              {/* 2. About Me */}
              <AboutCard biography={profile.biography} careerGoals={profile.careerGoals} researchInterests={profile.researchInterests} academicInterests={profile.academicInterests}/>

              {/* 4. Skills */}
              <SkillsSection skills={profile.skills}/>

              {/* 7. Project Portfolio */}
              <ProjectPortfolio projects={PROJECTS} onShowToast={showToast}/>

              {/* 8. Resource Contributions */}
              <ResourceContributions resources={RESOURCES}/>

              {/* 10. Activity Timeline */}
              <ActivityTimeline activities={ACTIVITIES}/>
            </div>

            <div className="profile-right-col">
              {/* 3. Academic Information */}
              <AcademicInfo department={profile.department} semester={profile.semester} cgpa={profile.cgpa} batch={ACADEMIC_BATCH} college={profile.college}/>

              {/* 5. Peer Network */}
              <PeerNetwork peers={PEERS} onShowToast={showToast}/>

              {/* 6. Certifications */}
              <Certifications certifications={CERTIFICATIONS}/>

              {/* 9. Achievements */}
              <Achievements achievements={ACHIEVEMENTS}/>

              {/* 11. Profile Completion */}
              <ProfileCompletion percentage={PROFILE_COMPLETION.percentage} items={PROFILE_COMPLETION.items}/>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      {showEditModal && (<div className="collab-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="collab-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="collab-modal-title">Edit Profile Details</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-headline">Headline</label>
                <input id="edit-headline" type="text" className="collab-modal-input" required value={editHeadline} onChange={(e) => setEditHeadline(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-bio">Biography (Bio)</label>
                <textarea id="edit-bio" className="collab-modal-textarea" required value={editBiography} onChange={(e) => setEditBiography(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-goals">Career Goals</label>
                <textarea id="edit-goals" className="collab-modal-textarea" value={editCareerGoals} onChange={(e) => setEditCareerGoals(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-research">Research Interests</label>
                <textarea id="edit-research" className="collab-modal-textarea" value={editResearchInterests} onChange={(e) => setEditResearchInterests(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-academic">Academic Interests</label>
                <textarea id="edit-academic" className="collab-modal-textarea" value={editAcademicInterests} onChange={(e) => setEditAcademicInterests(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="edit-skills">Skills (comma-separated)</label>
                <input id="edit-skills" type="text" className="collab-modal-input" value={editSkills} onChange={(e) => setEditSkills(e.target.value)}/>
              </div>

              <div className="collab-modal-actions">
                <Button className="outline" type="button" onClick={() => setShowEditModal(false)}>Cancel</Button>
                <Button className="primary" type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Dynamic Toast alert */}
      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}
    </AppLayout>);
};
export default Profile;
