import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ProjectsHero from '../features/projects/components/ProjectsHero';
import FeaturedProject from '../features/projects/components/FeaturedProject';
import ProjectFilters from '../features/projects/components/ProjectFilters';
import ProjectCard from '../features/projects/components/ProjectCard';
import ProjectDetailsModal from '../features/projects/components/ProjectDetailsModal';
import CreateProjectModal from '../features/projects/components/CreateProjectModal';
import JoinProjectModal from '../features/projects/components/JoinProjectModal';
import EmptyProjects from '../features/projects/components/EmptyProjects';
import { ROUTES } from '../constants/routes';

import {
  INITIAL_PROJECTS,
} from '../features/projects/projectsData';

import '../features/projects/projects.css';

/**
 * Projects collaboration hub page
 * Allows students to discover open projects, create projects, request to join,
 * view team details, and manage Kanban project tasks.
 * 
 * Future Backend Architecture (Express & MongoDB):
 * GET    /api/projects                  -> Fetch paginated projects with filters and text search
 * GET    /api/projects/:id              -> Get full project document with embedded/referenced tasks
 * POST   /api/projects                  -> Create new project document with creator as owner
 * PATCH  /api/projects/:id              -> Update project settings, deadline, or required skills
 * POST   /api/projects/:id/join         -> Send membership application to project owner
 * PATCH  /api/projects/:id/tasks/:taskId -> Update task status or assignee; recalculate progress
 * GET    /api/projects/:id/activity     -> Fetch project activity history
 */
export const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Main projects dataset state
  const [projects, setProjects] = useState(INITIAL_PROJECTS);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedRecruitment, setSelectedRecruitment] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('All Skills');
  const [sortBy, setSortBy] = useState('recent');

  // Modal interaction states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState(null);
  const [detailsInitialTab, setDetailsInitialTab] = useState('overview');
  const [projectForJoin, setProjectForJoin] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cross-page navigation state handling (e.g. from Dashboard "Create Project" or direct link)
  useEffect(() => {
    if (location.state) {
      const stateObj = location.state;
      if (stateObj.openCreateModal) {
        setIsCreateModalOpen(true);
      }
      if (stateObj.projectId) {
        const proj = projects.find((p) => p.id === stateObj.projectId);
        if (proj) {
          setSelectedProjectForDetails(proj);
          setDetailsInitialTab('overview');
        }
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, projects]);

  /**
   * Handle Create Project Submission
   * Future Backend API: POST /api/projects
   */
  const handleCreateProject = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    showToast(`Project "${newProject.title}" published successfully!`);
  };

  /**
   * Handle Join Project Request Submission
   * Future Backend API: POST /api/projects/:id/join
   */
  const handleConfirmJoin = (projectId, _note) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const newActivity = {
          id: `act-join-${Date.now()}`,
          user: 'You',
          action: 'submitted a request to join the project team',
          time: 'Just now',
        };
        return {
          ...p,
          recruitmentStatus: 'request-sent',
          activity: [newActivity, ...(p.activity || [])],
        };
      })
    );

    // Sync active details modal if opened
    if (selectedProjectForDetails && selectedProjectForDetails.id === projectId) {
      setSelectedProjectForDetails((prev) =>
        prev
          ? {
              ...prev,
              recruitmentStatus: 'request-sent',
              activity: [
                {
                  id: `act-join-${Date.now()}`,
                  user: 'You',
                  action: 'submitted a request to join the project team',
                  time: 'Just now',
                },
                ...(prev.activity || []),
              ],
            }
          : null
      );
    }

    const target = projects.find((p) => p.id === projectId);
    showToast(`Join request sent for "${target?.title || 'Project'}"!`);
  };

  /**
   * Handle Kanban Task status transitions and recalculate project completion percentage locally
   * Future Backend API: PATCH /api/projects/:id/tasks/:taskId
   */
  const handleTaskStatusChange = (projectId, taskId, newStatus) => {
    let taskName = '';

    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;

        const updatedTasks = proj.tasks.map((task) => {
          if (task.id === taskId) {
            taskName = task.title;
            return { ...task, status: newStatus };
          }
          return task;
        });

        const completedCount = updatedTasks.filter((t) => t.status === 'completed').length;
        const newProgress = updatedTasks.length
          ? Math.round((completedCount / updatedTasks.length) * 100)
          : 0;

        const newActivity = {
          id: `act-task-${Date.now()}`,
          user: 'You',
          action: `moved task "${taskName || taskId}" to ${newStatus}`,
          time: 'Just now',
        };

        const updatedProj = {
          ...proj,
          tasks: updatedTasks,
          progress: newProgress,
          activity: [newActivity, ...(proj.activity || [])],
        };

        // Synchronize selected modal state
        if (selectedProjectForDetails && selectedProjectForDetails.id === projectId) {
          setSelectedProjectForDetails(updatedProj);
        }

        return updatedProj;
      })
    );

    showToast(`Task updated to ${newStatus.replace('-', ' ')}`);
  };

  /**
   * Handle Open Workspace navigation
   */
  const handleOpenWorkspace = (project) => {
    showToast(`Connecting to ${project.title} collaboration channel...`);
    if (ROUTES.MESSAGES) {
      navigate(ROUTES.MESSAGES, { state: { activeWorkspaceId: project.id } });
    }
  };

  /**
   * Reset all search and dropdown filters
   */
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedStatus('all');
    setSelectedRecruitment('all');
    setSelectedSkill('All Skills');
    setSortBy('recent');
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim().length > 0) count += 1;
    if (selectedCategory !== 'All Categories') count += 1;
    if (selectedStatus !== 'all') count += 1;
    if (selectedRecruitment !== 'all') count += 1;
    if (selectedSkill !== 'All Skills') count += 1;
    return count;
  }, [searchQuery, selectedCategory, selectedStatus, selectedRecruitment, selectedSkill]);

  // Filtered projects pipeline
  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      // 1. Search Query (title, description, technologies, requiredSkills, tags, owner)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = proj.title.toLowerCase().includes(q);
        const matchesDesc = proj.description.toLowerCase().includes(q);
        const matchesOwner = proj.owner.toLowerCase().includes(q);
        const matchesTech = proj.technologies.some((t) => t.toLowerCase().includes(q));
        const matchesSkills = proj.requiredSkills.some((s) => s.toLowerCase().includes(q));
        const matchesTags = proj.tags ? proj.tags.some((t) => t.toLowerCase().includes(q)) : false;

        if (!matchesTitle && !matchesDesc && !matchesOwner && !matchesTech && !matchesSkills && !matchesTags) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All Categories' && proj.category !== selectedCategory) {
        return false;
      }

      // 3. Status Filter (planning, active, completed)
      if (selectedStatus !== 'all' && proj.status !== selectedStatus) {
        return false;
      }

      // 4. Recruitment Filter (open, joined, request-sent)
      if (selectedRecruitment !== 'all' && proj.recruitmentStatus !== selectedRecruitment) {
        return false;
      }

      // 5. Skill Filter
      if (selectedSkill !== 'All Skills') {
        const hasSkillInNeeded = proj.requiredSkills.includes(selectedSkill);
        const hasSkillInTech = proj.technologies.includes(selectedSkill);
        if (!hasSkillInNeeded && !hasSkillInTech) {
          return false;
        }
      }

      return true;
    });
  }, [projects, searchQuery, selectedCategory, selectedStatus, selectedRecruitment, selectedSkill]);

  // Sorted projects pipeline
  const sortedProjects = useMemo(() => {
    const list = [...filteredProjects];
    switch (sortBy) {
      case 'deadline':
        return list.sort((a, b) => a.deadline.localeCompare(b.deadline));
      case 'progress':
        return list.sort((a, b) => b.progress - a.progress);
      case 'openings':
        return list.sort(
          (a, b) => (b.maxMembers - b.members.length) - (a.maxMembers - a.members.length)
        );
      case 'recent':
      default:
        return list;
    }
  }, [filteredProjects, sortBy]);

  // Featured Project: Academic Peer-to-Peer Network
  const featuredProject = useMemo(() => {
    return (
      projects.find((p) => p.id === 'proj-academic-p2p') ||
      projects[0]
    );
  }, [projects]);

  return (
    <AppLayout>
      <div className="projects-page-container">
        {/* Section 1: Hero Section */}
        <ProjectsHero onCreateClick={() => setIsCreateModalOpen(true)} />

        {/* Section 2: Featured Project Spotlight */}
        {featuredProject && (
          <FeaturedProject
            project={featuredProject}
            onOpenDetails={(proj) => {
              setSelectedProjectForDetails(proj);
              setDetailsInitialTab('overview');
            }}
            onOpenTasks={(proj) => {
              setSelectedProjectForDetails(proj);
              setDetailsInitialTab('tasks');
            }}
            onOpenWorkspace={handleOpenWorkspace}
          />
        )}

        {/* Section 3: Filter & Search Controls */}
        <ProjectFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedRecruitment={selectedRecruitment}
          onRecruitmentChange={setSelectedRecruitment}
          selectedSkill={selectedSkill}
          onSkillChange={setSelectedSkill}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Section 4 & Section 9: Project Grid or Empty State */}
        <section className="proj-grid-section" aria-label="Projects Catalog">
          <div className="proj-grid-header">
            <span className="proj-grid-count">
              Showing {sortedProjects.length} {sortedProjects.length === 1 ? 'Project' : 'Projects'}
            </span>
          </div>

          {sortedProjects.length === 0 ? (
            <EmptyProjects
              onResetFilters={handleResetFilters}
              onCreateProjectClick={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <div className="proj-grid" role="list">
              {sortedProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  onViewDetails={(p) => {
                    setSelectedProjectForDetails(p);
                    setDetailsInitialTab('overview');
                  }}
                  onRequestJoin={(p) => setProjectForJoin(p)}
                  onOpenWorkspace={handleOpenWorkspace}
                />
              ))}
            </div>
          )}
        </section>

        {/* Section 5 & 6: Project Details Modal (includes Kanban TaskBoard) */}
        <ProjectDetailsModal
          project={selectedProjectForDetails}
          isOpen={Boolean(selectedProjectForDetails)}
          initialTab={detailsInitialTab}
          onClose={() => setSelectedProjectForDetails(null)}
          onTaskStatusChange={handleTaskStatusChange}
          onRequestJoin={(p) => {
            setSelectedProjectForDetails(null);
            setProjectForJoin(p);
          }}
          onOpenWorkspace={handleOpenWorkspace}
        />

        {/* Section 7: Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateProject={handleCreateProject}
        />

        {/* Section 8: Join Project Modal */}
        <JoinProjectModal
          project={projectForJoin}
          isOpen={Boolean(projectForJoin)}
          onClose={() => setProjectForJoin(null)}
          onConfirmJoin={handleConfirmJoin}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="proj-toast" role="status" aria-live="polite">
            <CheckCircle2 size={18} className="text-pine flex-shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Projects;
