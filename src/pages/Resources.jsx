import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/button';
import { RECENT_RESOURCES } from '../data/resources';
import '../styles/resources.css';
export const Resources = () => {
    const location = useLocation();
    const [resources, setResources] = useState(RECENT_RESOURCES);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedSubject, setSelectedSubject] = useState('All');
    const [sortBy, setSortBy] = useState('recent');
    const [highlightedResourceId, setHighlightedResourceId] = useState(null);
    // Share Resource Modal states
    const [showShareModal, setShowShareModal] = useState(false);
    useEffect(() => {
        if (location.state) {
            const stateObj = location.state;
            if (stateObj.openShareModal) {
                handleOpenShareModal();
            }
            if (stateObj.searchQuery) {
                setSearchQuery(stateObj.searchQuery);
            }
            if (stateObj.resourceId) {
                const resId = String(stateObj.resourceId);
                setActiveCategory('All');
                setSelectedSubject('All');
                setSearchQuery('');
                setHighlightedResourceId(resId);
                // Scroll into view
                setTimeout(() => {
                    const element = document.querySelector(`.library-resource-card[data-id="${resId}"]`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 150);
            }
            // Clear location state to prevent repeating actions on page reloads/renders
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState('PDF');
    const [newSubject, setNewSubject] = useState('');
    const [newDesc, setNewDesc] = useState('');
    // Toast Notification state
    const [toastMessage, setToastMessage] = useState(null);
    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000);
    };
    const handleDownload = (filename) => {
        showToast(`Download started: ${filename}`);
    };
    const handleOpenShareModal = () => {
        setSelectedFile(null);
        setFileError(null);
        setNewTitle('');
        setNewType('PDF');
        setNewSubject('');
        setNewDesc('');
        setShowShareModal(true);
    };
    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setSelectedFile(file);
            setNewTitle(file.name);
            setFileError(null);
            // Auto-categorize type based on extension
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (ext === 'pdf') {
                setNewType('PDF');
            }
            else if (ext === 'ppt' || ext === 'pptx') {
                setNewType('Presentation');
            }
            else if (ext === 'doc' || ext === 'docx') {
                setNewType('Tutorial');
            }
            else if (ext === 'txt') {
                setNewType('Notes');
            }
            else if (ext === 'zip') {
                setNewType('Other');
            }
            else {
                setNewType('Other');
            }
        }
    };
    const handleRemoveFile = () => {
        setSelectedFile(null);
        setNewTitle('');
        setFileError(null);
    };
    const handleShareResource = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setFileError('Please select a file to share.');
            return;
        }
        if (!newSubject.trim())
            return;
        const newResId = String(resources.length + 1);
        // Choose appropriate color styling classes based on file category
        let bgClass = 'var(--pine-tint)';
        let textClass = 'var(--pine-dark)';
        if (newType === 'PDF' || newType === 'Research Paper') {
            bgClass = 'var(--rust-tint)';
            textClass = 'var(--rust)';
        }
        else if (newType === 'Presentation' || newType === 'PPT') {
            bgClass = 'var(--marigold-tint)';
            textClass = 'var(--marigold)';
        }
        else if (newType === 'Cheat Sheet' || newType === 'Notes') {
            bgClass = 'var(--slate-tint)';
            textClass = 'var(--slate)';
        }
        // Format file size
        const sizeStr = selectedFile.size > 1024 * 1024
            ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(selectedFile.size / 1024).toFixed(0)} KB`;
        const newRes = {
            id: newResId,
            title: newTitle.trim() || selectedFile.name,
            type: newType,
            date: 'Uploaded just now',
            bgClass,
            textClass,
            subject: newSubject.trim(),
            uploader: 'You',
            downloadCount: 0,
            description: newDesc.trim() || 'No description provided.',
            fileSize: sizeStr
        };
        setResources(prev => [newRes, ...prev]);
        setShowShareModal(false);
        showToast(`Resource shared successfully: ${newTitle || selectedFile.name}`);
    };
    // Helper to extract unique subjects for the filter dropdown
    const uniqueSubjects = ['All', ...Array.from(new Set(resources.map(r => r.subject).filter(Boolean)))];
    // Helper to test if a resource matches the selected category pill
    const matchesCategory = (res, cat) => {
        if (cat === 'All')
            return true;
        if (cat === 'PDFs')
            return res.type === 'PDF';
        if (cat === 'Cheat Sheets')
            return res.type === 'Cheat Sheet';
        if (cat === 'Research Papers')
            return res.type === 'Research Paper';
        if (cat === 'Presentations')
            return res.type === 'Presentation' || res.type === 'PPT';
        // Else check case-insensitive match for singular forms (e.g. Notes, Tutorial, Other)
        return res.type?.toLowerCase().includes(cat.toLowerCase().replace(/s$/, '')) || false;
    };
    // Filter resources based on Category pill, Subject select dropdown, and Search query
    const filteredResources = resources.filter(res => {
        const categoryMatches = matchesCategory(res, activeCategory);
        const subjectMatches = selectedSubject === 'All' || res.subject === selectedSubject;
        const searchMatches = !searchQuery.trim() ||
            res.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.uploader?.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatches && subjectMatches && searchMatches;
    });
    // Sort resources based on Recent date or Popular download counts
    const sortedResources = [...filteredResources].sort((a, b) => {
        if (sortBy === 'recent') {
            // Direct numeric ID comparison is robust for mock data additions
            return Number(b.id) - Number(a.id);
        }
        else {
            return (b.downloadCount || 0) - (a.downloadCount || 0);
        }
    });
    // Featured resources are the top 2 highly downloaded resources from the complete collection
    const featuredResources = [...resources]
        .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
        .slice(0, 2);
    const categories = ['All', 'Notes', 'PDFs', 'Cheat Sheets', 'Presentations', 'Research Papers', 'Tutorials', 'Other'];
    return (<AppLayout>
      <motion.div className="w-full flex flex-col gap-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
        <div className="resources-container">
          
          {/* 1. Page Header Section */}
          <div className="resources-header-section">
            <h2 className="serif" style={{ fontSize: '26px', fontWeight: 600 }}>Resources</h2>
            <p className="resources-desc-text">
              Find notes, guides, papers, cheat sheets, and other resources shared by your academic network.
            </p>
            
            <div className="resources-search-row">
              <div className="resources-search-input-wrap">
                <svg className="resources-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                <input type="text" className="resources-search-input" placeholder="Search resources by name, subject, or uploader..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
              </div>
              <Button className="primary resources-share-btn" onClick={handleOpenShareModal}>
                <span>➕</span> Share Resource
              </Button>
            </div>
          </div>

          {/* 2. Resource Filters Bar */}
          <div className="resources-filters-bar">
            {/* Category selection pills */}
            <div className="resources-categories-row">
              {categories.map(cat => (<button key={cat} className={`category-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
                  {cat}
                </button>))}
            </div>

            {/* Subject Select dropdown and Sort toggle buttons */}
            <div className="resources-dropdowns-row">
              <div className="filter-select-wrap">
                <label htmlFor="subject-select">Subject:</label>
                <select id="subject-select" className="filter-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                  {uniqueSubjects.map(sub => (<option key={sub} value={sub}>{sub}</option>))}
                </select>
              </div>

              <div className="filter-select-wrap">
                <span>Sort by:</span>
                <div className="sort-toggle-group">
                  <button className={`sort-toggle-btn ${sortBy === 'recent' ? 'active' : ''}`} onClick={() => setSortBy('recent')}>
                    Recent
                  </button>
                  <button className={`sort-toggle-btn ${sortBy === 'popular' ? 'active' : ''}`} onClick={() => setSortBy('popular')}>
                    Popular
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Featured / Recommended Section (Spotlight) */}
          {!searchQuery && activeCategory === 'All' && selectedSubject === 'All' && (<div className="resources-featured-section">
              <h3 className="section-title-secondary">Featured Resources</h3>
              <div className="resources-featured-grid">
                {featuredResources.map(res => (<div key={res.id} className="featured-resource-card" style={{ background: res.bgClass }}>
                    <div className="featured-icon-box" style={{ background: res.textClass, color: '#fff' }}>
                      {res.type === 'Research Paper' ? 'REP' : res.type === 'Cheat Sheet' ? 'CHT' : res.type === 'Presentation' ? 'PRE' : res.type?.substring(0, 3).toUpperCase()}
                    </div>
                    <div className="featured-card-content">
                      <div className="featured-card-top">
                        <span className="featured-card-subject">{res.subject}</span>
                        <span className="featured-card-popular-badge">🔥 {res.downloadCount} downloads</span>
                      </div>
                      <h4 className="featured-card-title text-wrap-protect">{res.title}</h4>
                      <p className="featured-card-desc text-wrap-protect">{res.description}</p>
                      <div className="featured-card-meta">
                        Shared by <strong>{res.uploader}</strong> • {res.date}{res.fileSize ? ` · ${res.fileSize}` : ''}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <Button className="outline library-card-download-btn" onClick={() => handleDownload(res.title || '')}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '12px', height: '12px' }}>
                            <path d="M12 3v12m0 0-4-4m4 4 4-4"/>
                            <path d="M4 19h16"/>
                          </svg>
                          Open Resource
                        </Button>
                      </div>
                    </div>
                  </div>))}
              </div>
            </div>)}

          {/* 4. Complete Resource Grid / Library */}
          <div className="resources-library-section">
            <h3 className="section-title-secondary">Resource Library</h3>
            {sortedResources.length === 0 ? (<div className="resources-empty-state">
                <span className="resources-empty-icon">📁</span>
                <span className="resources-empty-text">No resources found</span>
                <span className="resources-empty-sub">Try broadening your search query or choosing another filter category.</span>
              </div>) : (<div className="resources-library-grid">
                {sortedResources.map(res => {
                const isHighlighted = highlightedResourceId === res.id;
                return (<div key={res.id} data-id={res.id} className={`library-resource-card ${isHighlighted ? 'highlighted-resource' : ''}`} style={isHighlighted ? { borderColor: 'var(--marigold)', borderWidth: '2px', boxShadow: '0 0 16px rgba(212, 163, 89, 0.45)' } : undefined}>
                    <div className="library-card-header">
                      <div className="library-card-icon" style={{ background: res.bgClass, color: res.textClass }}>
                        {res.type === 'Research Paper' ? 'REP' : res.type === 'Cheat Sheet' ? 'CHT' : res.type === 'Presentation' ? 'PRE' : res.type?.substring(0, 3).toUpperCase()}
                      </div>
                      <div className="library-card-header-info">
                        <h4 className="library-card-title text-wrap-protect">{res.title}</h4>
                        <span className="library-card-subject">{res.subject} • {res.type}</span>
                      </div>
                    </div>
                    
                    <p className="library-card-body text-wrap-protect">{res.description}</p>
                    
                    <div className="library-card-footer">
                      <div className="library-card-uploader-info">
                        <span className="uploader-name">By {res.uploader}</span>
                        <span className="uploader-date">{res.date}{res.fileSize ? ` · ${res.fileSize}` : ''} • {res.downloadCount} dls</span>
                      </div>
                      <Button className="outline library-card-download-btn" onClick={() => handleDownload(res.title || '')}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '12px', height: '12px' }}>
                          <path d="M12 3v12m0 0-4-4m4 4 4-4"/>
                          <path d="M4 19h16"/>
                        </svg>
                        Download
                      </Button>
                    </div>
                  </div>);
            })}
              </div>)}
          </div>

        </div>
      </motion.div>

      {/* 5. SHARE RESOURCE MODAL */}
      {showShareModal && (<div className="collab-modal-overlay">
          <div className="collab-modal">
            <h3 className="collab-modal-title">Share Academic Resource</h3>
            
            <form onSubmit={handleShareResource} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="collab-modal-field">
                <label className="collab-modal-label">Choose File</label>
                
                {/* Hidden Native File Input */}
                <input type="file" id="res-file-picker" style={{ display: 'none' }} accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.zip" onChange={handleFileChange}/>
                
                {/* Custom Styled Trigger Box */}
                {!selectedFile ? (<label htmlFor="res-file-picker" className="file-picker-trigger">
                    <span className="file-picker-icon">📁</span>
                    <span className="file-picker-text">Choose an academic file to share</span>
                    <span className="file-picker-subtext">Supports PDF, PPT, DOC, TXT, ZIP</span>
                  </label>) : (<div className="file-preview-box">
                    <span className="file-preview-icon">📄</span>
                    <div className="file-preview-details">
                      <span className="file-preview-name">{selectedFile.name}</span>
                      <span className="file-preview-meta">
                        {newType} • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <button type="button" className="file-preview-remove-btn" onClick={handleRemoveFile}>
                      Remove
                    </button>
                  </div>)}
                
                {/* Validation Error Message */}
                {fileError && (<span className="validation-error-msg">
                    ⚠️ {fileError}
                  </span>)}
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="res-type-select">Category Type</label>
                <select id="res-type-select" className="collab-modal-select" value={newType} onChange={(e) => setNewType(e.target.value)}>
                  <option value="Notes">Notes</option>
                  <option value="PDF">PDF Document</option>
                  <option value="Cheat Sheet">Cheat Sheet</option>
                  <option value="Presentation">Presentation</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Tutorial">Tutorial</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="res-subject-in">Subject / Course</label>
                <input id="res-subject-in" type="text" className="collab-modal-input" placeholder="e.g. DBMS" required value={newSubject} onChange={(e) => setNewSubject(e.target.value)}/>
              </div>

              <div className="collab-modal-field">
                <label className="collab-modal-label" htmlFor="res-desc-in">Description</label>
                <textarea id="res-desc-in" className="collab-modal-textarea" placeholder="Add a brief summary of what this resource covers..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)}/>
              </div>

              <div className="collab-modal-actions" style={{ marginTop: '8px' }}>
                <Button className="outline" type="button" onClick={() => setShowShareModal(false)}>Cancel</Button>
                <Button className="primary" type="submit">Share</Button>
              </div>
            </form>
          </div>
        </div>)}

      {/* 6. DYNAMIC TOAST ALERTS */}
      {toastMessage && (<div className="collab-toast">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>)}

    </AppLayout>);
};
export default Resources;
