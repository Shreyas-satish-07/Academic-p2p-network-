import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import PeerMatchHero from '../components/peer-match/PeerMatchHero';
import FeaturedCollaborator from '../components/peer-match/FeaturedCollaborator';
import FilterPanel from '../components/peer-match/FilterPanel';
import MatchCompatibility from '../components/peer-match/MatchCompatibility';
import MatchedStudents from '../components/peer-match/MatchedStudents';
import StudyGroupSuggestions from '../components/peer-match/StudyGroupSuggestions';
import SkillExchange from '../components/peer-match/SkillExchange';
import CollaborationOpportunities from '../components/peer-match/CollaborationOpportunities';
import TopCollaborators from '../components/peer-match/TopCollaborators';
import NetworkActivity from '../components/peer-match/NetworkActivity';
import '../styles/peer-match.css';
export const PeerMatch = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        if (location.state) {
            const stateObj = location.state;
            if (stateObj.searchQuery) {
                setSearchQuery(stateObj.searchQuery);
            }
            if (stateObj.focusSearch) {
                setTimeout(() => {
                    const el = document.getElementById('pm-search-in');
                    if (el)
                        el.focus();
                }, 150);
            }
            // Clear state
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const [selectedDept, setSelectedDept] = useState('All');
    const [selectedSemester, setSelectedSemester] = useState('All');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedProjects, setSelectedProjects] = useState([]);
    const [selectedResearch, setSelectedResearch] = useState([]);
    const [selectedAvailability, setSelectedAvailability] = useState([]);
    const [matchPct, setMatchPct] = useState(50);
    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedDept('All');
        setSelectedSemester('All');
        setSelectedSkills([]);
        setSelectedProjects([]);
        setSelectedResearch([]);
        setSelectedAvailability([]);
        setMatchPct(50);
    };
    return (<AppLayout>
      <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <PeerMatchHero />
        
        <FeaturedCollaborator />

        <div className="pm-browse">
          <div className="pm-filters">
            <FilterPanel searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedDept={selectedDept} setSelectedDept={setSelectedDept} selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} selectedSkills={selectedSkills} setSelectedSkills={setSelectedSkills} selectedProjects={selectedProjects} setSelectedProjects={setSelectedProjects} selectedResearch={selectedResearch} setSelectedResearch={setSelectedResearch} selectedAvailability={selectedAvailability} setSelectedAvailability={setSelectedAvailability} matchPct={matchPct} setMatchPct={setMatchPct} onReset={handleResetFilters}/>
            <MatchCompatibility />
          </div>
          <MatchedStudents searchQuery={searchQuery} selectedDept={selectedDept} selectedSemester={selectedSemester} selectedSkills={selectedSkills} selectedProjects={selectedProjects} selectedResearch={selectedResearch} selectedAvailability={selectedAvailability} matchPct={matchPct} onReset={handleResetFilters}/>
        </div>

        <StudyGroupSuggestions />
        <SkillExchange />
        <CollaborationOpportunities />
        <TopCollaborators />
        <NetworkActivity />
      </motion.div>
    </AppLayout>);
};
export default PeerMatch;
