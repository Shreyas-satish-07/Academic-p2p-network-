import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ResourcesHero from '../features/resources/components/ResourcesHero';
import FeaturedResource from '../features/resources/components/FeaturedResource';
import PopularTopics from '../features/resources/components/PopularTopics';
import ResourceFilters from '../features/resources/components/ResourceFilters';
import ResourceCard from '../features/resources/components/ResourceCard';
import UploadResourceModal from '../features/resources/components/UploadResourceModal';
import ResourcePreviewModal from '../features/resources/components/ResourcePreviewModal';
import EmptyResources from '../features/resources/components/EmptyResources';

import {
  INITIAL_RESOURCES,
} from '../features/resources/resourcesData';

import '../features/resources/resources.css';

/**
 * Academic Resource Hub discovery and library page
 * 
 * Future Backend Architecture (Express, MongoDB & Cloudinary):
 * GET    /api/resources             -> Fetch paginated resources with filtering and sorting
 * GET    /api/resources/:id         -> Get single resource metadata & signed Cloudinary download URL
 * POST   /api/resources             -> Create resource document in MongoDB
 * PATCH  /api/resources/:id/save    -> Toggle saved/bookmarked resource for authenticated user
 * POST   /api/resources/:id/download-> Increment download metric & return download stream
 * DELETE /api/resources/:id         -> Delete resource (restricted to uploader or admin)
 * POST   /api/uploads/resource      -> Stream multipart/form-data file to Cloudinary & return asset URL
 */
export const Resources = () => {
  // Main resources dataset state
  const [resources, setResources] = useState(INITIAL_RESOURCES);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedType, setSelectedType] = useState('All Types');
  const [sortBy, setSortBy] = useState('recent');
  const [savedOnly, setSavedOnly] = useState(false);

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewingResource, setPreviewingResource] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  /**
   * Toggle saved/bookmark status locally
   * Future Backend API: PATCH /api/resources/:id/save
   */
  const handleToggleSave = (resourceId) => {
    setResources((prev) =>
      prev.map((r) => {
        if (r.id !== resourceId) return r;
        const nextSaved = !r.isSaved;
        showToast(
          nextSaved
            ? `Saved "${r.title}" to your collection.`
            : `Removed "${r.title}" from saved collection.`
        );
        return { ...r, isSaved: nextSaved };
      })
    );

    // Synchronize preview modal if active
    if (previewingResource && previewingResource.id === resourceId) {
      setPreviewingResource((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  /**
   * Handle download: increments local download count and shows toast
   * Future Backend API: POST /api/resources/:id/download
   */
  const handleDownload = (resource) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r
      )
    );

    if (previewingResource && previewingResource.id === resource.id) {
      setPreviewingResource((prev) =>
        prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null
      );
    }

    showToast(`Downloading "${resource.title}" (${resource.fileSize})...`);
  };

  /**
   * Open Preview Modal
   * Increments viewCount locally
   */
  const handlePreview = (resource) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resource.id ? { ...r, viewCount: r.viewCount + 1 } : r
      )
    );
    setPreviewingResource(resource);
  };

  /**
   * Add new uploaded resource locally
   * Future Backend API: POST /api/resources
   */
  const handleUploadResource = (newResource) => {
    setResources((prev) => [newResource, ...prev]);
    showToast(`Resource "${newResource.title}" shared with your cohort!`);
  };

  /**
   * Reset all filters to default
   */
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All Subjects');
    setSelectedType('All Types');
    setSortBy('recent');
    setSavedOnly(false);
  };

  // Count active non-default filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSubject !== 'All Subjects') count += 1;
    if (selectedType !== 'All Types') count += 1;
    if (savedOnly) count += 1;
    if (searchQuery.trim().length > 0) count += 1;
    return count;
  }, [selectedSubject, selectedType, savedOnly, searchQuery]);

  // Filtered resources pipeline
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // 1. Saved only filter
      if (savedOnly && !res.isSaved) {
        return false;
      }

      // 2. Search query (Title, description, subject, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesSubject = res.subject.toLowerCase().includes(q);
        const matchesTags = res.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesSubject && !matchesTags) {
          return false;
        }
      }

      // 3. Subject Filter
      if (selectedSubject !== 'All Subjects' && res.subject !== selectedSubject) {
        return false;
      }

      // 4. Resource Type Filter
      if (selectedType !== 'All Types' && res.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [resources, savedOnly, searchQuery, selectedSubject, selectedType]);

  // Sorted resources pipeline
  const sortedResources = useMemo(() => {
    const list = [...filteredResources];
    switch (sortBy) {
      case 'downloads':
        return list.sort((a, b) => b.downloadCount - a.downloadCount);
      case 'views':
        return list.sort((a, b) => b.viewCount - a.viewCount);
      case 'alphabetical':
        return list.sort((a, b) => a.title.localeCompare(b.title));
      case 'recent':
      default:
        return list; // Preserves chronological insertion order
    }
  }, [filteredResources, sortBy]);

  // Featured resource: DBMS Notes.pdf (res-dbms-notes)
  const featuredResource = useMemo(() => {
    return resources.find((r) => r.id === 'res-dbms-notes') || resources[0];
  }, [resources]);

  return (
    <AppLayout>
      <div className="resources-page-container">
        {/* Section 1: Hero Section */}
        <ResourcesHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        {/* Section 2: Featured Resource (DBMS Notes.pdf) */}
        {featuredResource && (
          <FeaturedResource
            resource={featuredResource}
            onPreview={handlePreview}
            onDownload={handleDownload}
            onToggleSave={handleToggleSave}
          />
        )}

        {/* Section 5: Popular Topics Section */}
        <PopularTopics
          activeTopic={selectedSubject}
          onSelectTopic={(topic) => setSelectedSubject(topic)}
        />

        {/* Section 3 & 4: Sidebar Filters + Resource Library Grid */}
        <div className="res-browser-layout">
          <ResourceFilters
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            savedOnly={savedOnly}
            onSavedOnlyToggle={setSavedOnly}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />

          <main className="res-content-area" aria-label="Academic Resources Library">
            {/* Library toolbar stats */}
            <div className="res-toolbar">
              <span className="text-xs font-semibold text-ink-soft">
                Showing {sortedResources.length} {sortedResources.length === 1 ? 'Resource' : 'Resources'}
              </span>

              {savedOnly && (
                <span className="text-xs font-medium text-marigold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Filtering by Saved Resources
                </span>
              )}
            </div>

            {/* Section 4: Resource Cards Grid or Section 8: Empty State */}
            {sortedResources.length === 0 ? (
              <EmptyResources
                onResetFilters={handleResetFilters}
                onUploadClick={() => setIsUploadModalOpen(true)}
              />
            ) : (
              <div className="res-library-grid" role="list">
                {sortedResources.map((res) => (
                  <ResourceCard
                    key={res.id}
                    resource={res}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Section 6: Upload Resource Modal */}
        <UploadResourceModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadResource={handleUploadResource}
        />

        {/* Section 7: Resource Preview Modal */}
        <ResourcePreviewModal
          resource={previewingResource}
          isOpen={Boolean(previewingResource)}
          onClose={() => setPreviewingResource(null)}
          onDownload={handleDownload}
          onToggleSave={handleToggleSave}
        />

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="res-toast" role="status" aria-live="polite">
            <CheckCircle2 size={18} className="text-pine flex-shrink-0" aria-hidden="true" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Resources;
