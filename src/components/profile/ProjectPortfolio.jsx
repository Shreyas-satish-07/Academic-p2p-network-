import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import Button from '../ui/button';
import { ROUTES } from '../../constants/routes';
export const ProjectPortfolio = ({ projects, onShowToast }) => {
    const navigate = useNavigate();
    const handleViewProject = (projectId) => {
        navigate(ROUTES.PROJECTS, {
            state: { projectId }
        });
    };
    const handleRepositoryClick = (e, repositoryUrl, title) => {
        e.preventDefault();
        if (!repositoryUrl || repositoryUrl === '#') {
            onShowToast(`Repository for "${title}" is not configured in this demo.`);
        }
        else {
            window.open(repositoryUrl, '_blank', 'noopener,noreferrer');
        }
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-pine">PJ</span>
        <CardTitle>Project portfolio</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="project-grid">
          {projects.map((project) => {
            const isFeatured = project.featured;
            return (<motion.div key={project.id} className={`project-card ${isFeatured ? 'featured' : ''}`} whileHover={{ y: -4, boxShadow: '0 12px 24px -14px rgba(27,35,33,0.18)' }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                {isFeatured && (<span className="featured-tag">⭐ Featured project</span>)}
                
                <div className="project-head">
                  <span className="t flex items-center gap-1.5 font-semibold">
                    {/* GitHub Book/Repo Icon */}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-ink-soft opacity-75">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    {project.title}
                  </span>
                  <span className={`status-pill ${project.status === 'Live' ? 'status-live' : 'status-progress'}`}>
                    {project.status}
                  </span>
                </div>

                <p className="project-desc">{project.description}</p>
                
                <div className="tech-tags">
                  {project.technologies.map((tech, i) => (<span key={i} className="tech-tag">
                      {tech}
                    </span>))}
                </div>

                <div className="project-actions">
                  <Button className="proj-btn proj-btn-outline" onClick={(e) => handleRepositoryClick(e, project.repositoryUrl || '#', project.title)}>
                    Repository
                  </Button>
                  <Button className="proj-btn proj-btn-solid" onClick={() => handleViewProject(project.id)}>
                    View Project
                  </Button>
                </div>
              </motion.div>);
        })}
        </div>
      </CardContent>
    </Card>);
};
export default ProjectPortfolio;
