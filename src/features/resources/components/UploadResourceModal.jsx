import React, { useState, useEffect } from 'react';
import { X, Upload, BookOpen, Layers, Tag, FileText, Globe, FileCheck, AlertCircle } from 'lucide-react';
import { SUBJECT_FILTER_OPTIONS, TYPE_FILTER_OPTIONS } from '../resourcesData';

/**
 * UploadResourceModal component
 * 
 * Section 6: Upload Resource modal
 * Fields:
 * - Title
 * - Description
 * - Subject
 * - Resource type
 * - Tags
 * - File input (supports PDF, DOCX, PPTX, PNG, JPG)
 * - External resource URL optional
 * 
 * Future Cloudinary Integration:
 * 1. Frontend sends FormData with multipart/form-data to POST /api/uploads/resource
 * 2. Express server streams file stream to Cloudinary storage bucket (raw/image/pdf preset)
 * 3. Cloudinary returns secure_url and public_id
 * 4. Express saves Resource document in MongoDB with fileUrl: secure_url, cloudinaryId: public_id
 */
export const UploadResourceModal = ({
  isOpen,
  onClose,
  onUploadResource,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('DBMS');
  const [type, setType] = useState('PDF');
  const [tagsInput, setTagsInput] = useState('Notes, Semester 6');
  const [selectedFile, setSelectedFile] = useState(null);
  const [externalUrl, setExternalUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validFileTypes = ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'png', 'jpg', 'jpeg'];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !validFileTypes.includes(ext)) {
      setErrorMsg(`Invalid file type (.${ext}). Accepted formats: PDF, DOCX, PPTX, PNG, JPG.`);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setErrorMsg('');

    // Prepopulate title if empty
    if (!title.trim()) {
      setTitle(file.name);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Title, Subject, Type, and one of File or URL
    if (!title.trim()) {
      setErrorMsg('Please enter a resource title.');
      return;
    }
    if (!subject || subject === 'All Subjects') {
      setErrorMsg('Please select a subject area.');
      return;
    }
    if (!type || type === 'All Types') {
      setErrorMsg('Please select a resource type.');
      return;
    }
    if (!selectedFile && !externalUrl.trim()) {
      setErrorMsg('Please select a file to upload or provide an external resource URL.');
      return;
    }

    // Format file size string
    let sizeStr = '1.5 MB';
    if (selectedFile) {
      sizeStr =
        selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(selectedFile.size / 1024).toFixed(0)} KB`;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    /**
     * Future Backend API & Cloudinary upload call:
     * const formData = new FormData();
     * formData.append('file', selectedFile);
     * formData.append('title', title);
     * formData.append('subject', subject);
     * formData.append('type', type);
     * formData.append('description', description);
     * const res = await axios.post('/api/resources', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
     */

    const newResource = {
      id: `res-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Shared by Shreyas Rao for peer learning.',
      subject,
      type,
      tags: parsedTags.length > 0 ? parsedTags : [subject, type],
      uploader: 'Shreyas Rao',
      uploaderInitials: 'SR',
      uploadDate: 'Just now',
      downloadCount: 0,
      viewCount: 0,
      fileSize: sizeStr,
      fileUrl: externalUrl.trim() || (selectedFile ? `/mock/files/${selectedFile.name}` : '#'),
      thumbnailColor: '#2F5D50',
      isSaved: false,
      isFeatured: false,
    };

    onUploadResource(newResource);
    onClose();
  };

  const validSubjects = SUBJECT_FILTER_OPTIONS.filter((s) => s !== 'All Subjects');
  const validTypes = TYPE_FILTER_OPTIONS.filter((t) => t !== 'All Types');

  return (
    <div
      className="res-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={onClose}
    >
      <div
        className="res-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="res-modal-header">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-pine" aria-hidden="true" />
            <h2 id="upload-modal-title" className="res-modal-title serif">
              Upload Academic Resource
            </h2>
          </div>

          <button
            type="button"
            className="res-modal-close-btn"
            onClick={onClose}
            aria-label="Close upload modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
            <AlertCircle size={14} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="res-modal-form">
          {/* File Picker */}
          <div className="res-form-group">
            <label className="res-form-label">
              Upload File (PDF, DOCX, PPTX, PNG, JPG)
            </label>

            {/* Hidden native input */}
            <input
              id="file-picker-input"
              type="file"
              style={{ display: 'none' }}
              accept=".pdf,.docx,.doc,.pptx,.ppt,.png,.jpg,.jpeg"
              onChange={handleFileChange}
            />

            {!selectedFile ? (
              <label htmlFor="file-picker-input" className="res-file-picker-trigger">
                <Upload size={24} className="text-pine" aria-hidden="true" />
                <span className="text-sm font-semibold text-ink">
                  Click to browse or drop document
                </span>
                <span className="text-xs text-ink-faint">
                  Supports PDF, DOCX, PPTX, PNG, JPG up to 25MB
                </span>
              </label>
            ) : (
              <div className="res-file-selected-box">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileCheck size={18} className="text-pine flex-shrink-0" aria-hidden="true" />
                  <div className="truncate">
                    <span className="text-sm font-medium text-ink block truncate">
                      {selectedFile.name}
                    </span>
                    <span className="res-file-meta-text">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-rust hover:underline ml-2"
                  onClick={handleRemoveFile}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* External URL Alternative */}
          <div className="res-form-group">
            <label htmlFor="res-external-url" className="res-form-label flex items-center gap-1.5">
              <Globe size={13} className="text-slate" aria-hidden="true" />
              <span>External Resource URL (Optional alternative to file)</span>
            </label>
            <input
              id="res-external-url"
              type="url"
              className="res-form-input"
              placeholder="https://drive.google.com/... or https://arxiv.org/..."
              value={externalUrl}
              onChange={(e) => {
                setExternalUrl(e.target.value);
                setErrorMsg('');
              }}
            />
          </div>

          {/* Title */}
          <div className="res-form-group">
            <label htmlFor="upload-res-title" className="res-form-label">
              Resource Title *
            </label>
            <input
              id="upload-res-title"
              type="text"
              className="res-form-input"
              placeholder="e.g. Operating Systems Concurrency Notes.pdf"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrorMsg('');
              }}
              required
            />
          </div>

          {/* Subject & Type Row */}
          <div className="res-form-row">
            <div className="res-form-group">
              <label htmlFor="upload-res-subject" className="res-form-label flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate" aria-hidden="true" />
                <span>Subject Area *</span>
              </label>
              <select
                id="upload-res-subject"
                className="res-form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {validSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="res-form-group">
              <label htmlFor="upload-res-type" className="res-form-label flex items-center gap-1.5">
                <Layers size={13} className="text-slate" aria-hidden="true" />
                <span>Resource Type *</span>
              </label>
              <select
                id="upload-res-type"
                className="res-form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {validTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="res-form-group">
            <label htmlFor="upload-res-desc" className="res-form-label flex items-center gap-1.5">
              <FileText size={13} className="text-slate" aria-hidden="true" />
              <span>Description & Key Topics</span>
            </label>
            <textarea
              id="upload-res-desc"
              className="res-form-textarea"
              placeholder="Summary of syllabus units, problem solutions, or topics covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {/* Tags */}
          <div className="res-form-group">
            <label htmlFor="upload-res-tags" className="res-form-label flex items-center gap-1.5">
              <Tag size={13} className="text-slate" aria-hidden="true" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              id="upload-res-tags"
              type="text"
              className="res-form-input"
              placeholder="e.g. SQL, Paging, Cheatsheet"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="res-modal-footer">
            <button
              type="button"
              className="res-secondary-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="res-primary-btn"
            >
              Upload Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResourceModal;
