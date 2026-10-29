import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CheckCircle2, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import ResourcesHero from '../features/resources/components/ResourcesHero';
import FeaturedResource from '../features/resources/components/FeaturedResource';
import PopularTopics from '../features/resources/components/PopularTopics';
import ResourceFilters from '../features/resources/components/ResourceFilters';
import ResourceCard from '../features/resources/components/ResourceCard';
import UploadResourceModal from '../features/resources/components/UploadResourceModal';
import ResourcePreviewModal from '../features/resources/components/ResourcePreviewModal';
import EmptyResources from '../features/resources/components/EmptyResources';
import { resourceApi } from '../services/api';

import '../features/resources/resources.css';

/**
 * Academic Resource Hub discovery and library page
 *
 * Backend Endpoints (Express & MongoDB):
 * GET    /api/resources             -> Fetch paginated resources with filtering and sorting
 * GET    /api/resources/:id         -> Get single resource metadata
 * POST   /api/resources             -> Create resource document in MongoDB
 * PATCH  /api/resources/:id         -> Update resource (creator only)
 * DELETE /api/resources/:id         -> Soft-delete / archive resource (creator only)
 * POST   /api/resources/:id/like    -> Toggle like on resource
 * POST   /api/resources/:id/save    -> Toggle save/bookmark on resource
 * POST   /api/resources/:id/view    -> Increment view count on preview
 */
export const Resources = () => {
  // Main resources dataset state
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  // Filters & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
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

  // Debounce search query to prevent request spam
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /**
   * Fetch resources from backend API
   */
  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = {
        page: 1,
        limit: 100, // Load resources to support responsive in-memory interactions
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (selectedSubject !== 'All Subjects') {
        params.subject = selectedSubject;
      }

      if (selectedType !== 'All Types') {
        params.resourceType = selectedType.toLowerCase();
      }

      if (savedOnly) {
        params.saved = 'true';
      }

      // Map sort parameter
      if (sortBy === 'downloads') {
        params.sort = 'popular';
      } else if (sortBy === 'views') {
        params.sort = 'mostViewed';
      } else if (sortBy === 'alphabetical') {
        params.sort = 'title';
      } else {
        params.sort = 'newest';
      }

      const res = await resourceApi.getResources(params);
      const items = res.data?.data?.resources || [];
      setResources(items);
    } catch (err) {
      console.error('Failed to load resources:', err);
      const msg =
        err.response?.data?.message ||
        'Could not load academic resources. Please check your network connection.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedSubject, selectedType, savedOnly, sortBy]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  /**
   * Toggle save/bookmark status via API (POST /api/resources/:id/save)
   */
  const handleToggleSave = async (resourceId) => {
    const target = resources.find((r) => (r.id || r._id) === resourceId);
    if (!target) return;

    try {
      const res = await resourceApi.saveResource(resourceId);
      const updated = res.data?.data?.resource;
      const isNowSaved = updated?.isSavedByCurrentUser ?? !target.isSaved;

      setResources((prev) =>
        prev.map((r) =>
          (r.id || r._id) === resourceId
            ? {
                ...r,
                ...(updated || {}),
                isSaved: isNowSaved,
                isSavedByCurrentUser: isNowSaved,
              }
            : r
        )
      );

      if (previewingResource && (previewingResource.id || previewingResource._id) === resourceId) {
        setPreviewingResource((prev) =>
          prev
            ? {
                ...prev,
                ...(updated || {}),
                isSaved: isNowSaved,
                isSavedByCurrentUser: isNowSaved,
              }
            : null
        );
      }

      showToast(
        isNowSaved
          ? `Saved "${target.title}" to your collection.`
          : `Removed "${target.title}" from saved collection.`
      );
    } catch (err) {
      console.error('Failed to toggle save:', err);
      const msg = err.response?.data?.message || 'Could not update save status.';
      showToast(msg);
    }
  };

  /**
   * Toggle like via API (POST /api/resources/:id/like)
   */
  const handleToggleLike = async (resourceId) => {
    const target = resources.find((r) => (r.id || r._id) === resourceId);
    if (!target) return;

    try {
      const res = await resourceApi.likeResource(resourceId);
      const updated = res.data?.data?.resource;

      setResources((prev) =>
        prev.map((r) => ((r.id || r._id) === resourceId ? { ...r, ...(updated || {}) } : r))
      );

      if (previewingResource && (previewingResource.id || previewingResource._id) === resourceId) {
        setPreviewingResource((prev) => (prev ? { ...prev, ...(updated || {}) } : null));
      }

      showToast(
        updated?.isLikedByCurrentUser
          ? `Liked "${target.title}".`
          : `Removed like from "${target.title}".`
      );
    } catch (err) {
      console.error('Failed to toggle like:', err);
      const msg = err.response?.data?.message || 'Could not update like status.';
      showToast(msg);
    }
  };

  /**
   * Handle download/open: opens URL in new tab and shows toast
   */
  const handleDownload = (resource) => {
    const targetUrl = resource.url || resource.fileUrl;
    if (targetUrl && targetUrl !== '#') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      showToast(`Opening "${resource.title}"...`);
    } else {
      showToast(`Opening "${resource.title}" (${resource.fileSize || 'Resource'})...`);
    }
  };

  /**
   * Open Preview Modal & increment view count via API (POST /api/resources/:id/view)
   */
  const handlePreview = async (resource) => {
    const resId = resource.id || resource._id;
    setPreviewingResource(resource);

    try {
      const res = await resourceApi.viewResource(resId);
      const updated = res.data?.data?.resource;
      if (updated) {
        setResources((prev) =>
          prev.map((r) => ((r.id || r._id) === resId ? { ...r, viewCount: updated.viewCount } : r))
        );
        setPreviewingResource(updated);
      }
    } catch (err) {
      console.warn('View count increment failed:', err);
    }
  };

  /**
   * Add newly uploaded resource from modal
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

  // Client-side refined filtering
  const filteredResources = useMemo(() => {
    return resources.filter((res) => {
      // 1. Saved only filter
      if (savedOnly && !(res.isSaved || res.isSavedByCurrentUser)) {
        return false;
      }

      // 2. Search query (Title, description, subject, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = (res.title || '').toLowerCase().includes(q);
        const matchesDesc = (res.description || '').toLowerCase().includes(q);
        const matchesSubject = (res.subject || '').toLowerCase().includes(q);
        const tagsList = res.tags || res.topics || [];
        const matchesTags = tagsList.some((t) => t.toLowerCase().includes(q));

        if (!matchesTitle && !matchesDesc && !matchesSubject && !matchesTags) {
          return false;
        }
      }

      // 3. Subject Filter
      if (selectedSubject !== 'All Subjects' && res.subject !== selectedSubject) {
        return false;
      }

      // 4. Resource Type Filter
      if (
        selectedType !== 'All Types' &&
        res.type !== selectedType &&
        (res.resourceType || '').toLowerCase() !== selectedType.toLowerCase()
      ) {
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
        return list.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
      case 'views':
        return list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
      case 'alphabetical':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'recent':
      default:
        return list;
    }
  }, [filteredResources, sortBy]);

  // Featured resource: DBMS Notes.pdf or first available
  const featuredResource = useMemo(() => {
    if (resources.length === 0) return null;
    return (
      resources.find((r) => r.title?.includes('DBMS Notes')) ||
      resources.find((r) => (r.id || r._id) === 'res-dbms-notes') ||
      resources[0]
    );
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

        {/* Section 2: Featured Resource Spotlight */}
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
                Showing {sortedResources.length}{' '}
                {sortedResources.length === 1 ? 'Resource' : 'Resources'}
              </span>

              {savedOnly && (
                <span className="text-xs font-medium text-marigold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Filtering by Saved Resources
                </span>
              )}
            </div>

            {/* Loading, Error, Empty, or Resource Cards Grid */}
            {isLoading && resources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-ink-faint">
                <Loader2 size={32} className="animate-spin text-pine mb-3" aria-hidden="true" />
                <p className="text-sm font-medium">Loading learning resources...</p>
              </div>
            ) : errorMessage && resources.length === 0 ? (
              <div className="res-empty-card" role="alert">
                <div className="res-empty-icon text-rust" aria-hidden="true">
                  <AlertCircle size={32} />
                </div>
                <h3 className="res-empty-title serif text-rust">Failed to load resources</h3>
                <p className="res-empty-subtitle">{errorMessage}</p>
                <div className="flex items-center gap-2.5 mt-2 justify-center">
                  <button
                    type="button"
                    className="res-primary-btn flex items-center gap-2"
                    onClick={fetchResources}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            ) : sortedResources.length === 0 ? (
              <EmptyResources
                onResetFilters={handleResetFilters}
                onUploadClick={() => setIsUploadModalOpen(true)}
              />
            ) : (
              <div className="res-library-grid" role="list">
                {sortedResources.map((res) => (
                  <ResourceCard
                    key={res.id || res._id}
                    resource={res}
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                    onToggleSave={handleToggleSave}
                    onToggleLike={handleToggleLike}
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
          onToggleLike={handleToggleLike}
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
