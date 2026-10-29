import React, { useState, useEffect } from 'react';
import { X, Plus, BookOpen, Layers, Users, Calendar, Tag, FileText, Clock, Loader2 } from 'lucide-react';
import { SUBJECT_FILTER_OPTIONS, DIFFICULTY_FILTER_OPTIONS } from '../studyGroupsData';
import { studyGroupApi } from '../../../services/api';

/**
 * CreateGroupModal component
 * 
 * Section 7: Create Study Group modal
 * Fields:
 * - Group name
 * - Subject
 * - Description
 * - Difficulty
 * - Maximum members
 * - Tags
 * - Meeting schedule
 * - First session date/time
 * 
 * On submit:
 * - Validate required fields
 * - Add the new group to local page state
 * - Mark the current user as owner and joined member
 * - Close modal and trigger success toast
 * - Do not call a backend yet
 * 
 * Future Backend Architecture:
 * POST /api/study-groups -> Creates a new StudyGroup document in MongoDB and assigns req.user.id as owner
 */
export const CreateGroupModal = ({
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Machine Learning');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [maxMembers, setMaxMembers] = useState(15);
  const [tagsInput, setTagsInput] = useState('Python, Deep Learning');
  const [meetingSchedule, setMeetingSchedule] = useState('Wednesdays • 6:00 PM');
  const [firstSession, setFirstSession] = useState('Tomorrow at 6:00 PM');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setErrorMsg('');
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setErrorMsg('Please enter a group name.');
      return;
    }
    if (name.trim().length < 3 || name.trim().length > 100) {
      setErrorMsg('Group name must be between 3 and 100 characters.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please enter a description for your study group.');
      return;
    }
    if (maxMembers < 2 || maxMembers > 50) {
      setErrorMsg('A study group must have capacity between 2 and 50 members.');
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await studyGroupApi.createGroup({
        name: name.trim(),
        subject,
        description: description.trim(),
        level: difficulty.toLowerCase(),
        maxMembers: Number(maxMembers),
        topics: parsedTags.length > 0 ? parsedTags : ['Study', subject],
        meetingSchedule: meetingSchedule.trim() || 'Schedule TBD',
        location: '',
      });

      const createdGroup = res.data?.data?.group;
      if (createdGroup) {
        onCreateGroup(createdGroup);
      }
      onClose();
    } catch (err) {
      console.error('Failed to create study group:', err);
      const message =
        err.response?.data?.message ||
        'Failed to create study squad. Please check your network connection.';
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validSubjects = SUBJECT_FILTER_OPTIONS.filter((s) => s !== 'All Subjects');
  const validDifficulties = DIFFICULTY_FILTER_OPTIONS.filter((d) => d !== 'All Difficulties');

  return (
    <div
      className="sg-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sg-modal-title"
      onClick={onClose}
    >
      <div
        className="sg-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sg-modal-header">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-pine" aria-hidden="true" />
            <h2 id="sg-modal-title" className="sg-modal-title serif">
              Create Study Group
            </h2>
          </div>

          <button
            type="button"
            className="sg-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="sg-modal-form">
          {/* Group Name */}
          <div className="sg-form-group">
            <label htmlFor="create-group-name" className="sg-form-label">
              Group Name *
            </label>
            <input
              id="create-group-name"
              type="text"
              className="sg-form-input"
              placeholder="e.g. Distributed Systems Lab"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              required
              autoFocus
            />
          </div>

          {/* Subject & Difficulty Row */}
          <div className="sg-form-row">
            <div className="sg-form-group">
              <label htmlFor="create-group-subject" className="sg-form-label flex items-center gap-1.5">
                <BookOpen size={13} className="text-slate" aria-hidden="true" />
                <span>Subject *</span>
              </label>
              <select
                id="create-group-subject"
                className="sg-form-select"
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

            <div className="sg-form-group">
              <label htmlFor="create-group-diff" className="sg-form-label flex items-center gap-1.5">
                <Layers size={13} className="text-slate" aria-hidden="true" />
                <span>Difficulty *</span>
              </label>
              <select
                id="create-group-diff"
                className="sg-form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {validDifficulties.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="sg-form-group">
            <label htmlFor="create-group-desc" className="sg-form-label flex items-center gap-1.5">
              <FileText size={13} className="text-slate" aria-hidden="true" />
              <span>Description *</span>
            </label>
            <textarea
              id="create-group-desc"
              className="sg-form-textarea"
              placeholder="Describe what problems you'll tackle, course syllabus covered, or interview goals..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrorMsg('');
              }}
              rows={3}
              required
            />
          </div>

          {/* Maximum Members & Tags Row */}
          <div className="sg-form-row">
            <div className="sg-form-group">
              <label htmlFor="create-group-max" className="sg-form-label flex items-center gap-1.5">
                <Users size={13} className="text-slate" aria-hidden="true" />
                <span>Maximum Members *</span>
              </label>
              <input
                id="create-group-max"
                type="number"
                min={2}
                max={100}
                className="sg-form-input"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
                required
              />
            </div>

            <div className="sg-form-group">
              <label htmlFor="create-group-tags" className="sg-form-label flex items-center gap-1.5">
                <Tag size={13} className="text-slate" aria-hidden="true" />
                <span>Tags (comma-separated)</span>
              </label>
              <input
                id="create-group-tags"
                type="text"
                className="sg-form-input"
                placeholder="e.g. Python, LeetCode, AWS"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Meeting Schedule & First Session Date/Time */}
          <div className="sg-form-row">
            <div className="sg-form-group">
              <label htmlFor="create-group-sched" className="sg-form-label flex items-center gap-1.5">
                <Calendar size={13} className="text-slate" aria-hidden="true" />
                <span>Meeting Schedule</span>
              </label>
              <input
                id="create-group-sched"
                type="text"
                className="sg-form-input"
                placeholder="e.g. Saturdays • 4:00 PM"
                value={meetingSchedule}
                onChange={(e) => setMeetingSchedule(e.target.value)}
              />
            </div>

            <div className="sg-form-group">
              <label htmlFor="create-group-first-session" className="sg-form-label flex items-center gap-1.5">
                <Clock size={13} className="text-slate" aria-hidden="true" />
                <span>First Session Date / Time</span>
              </label>
              <input
                id="create-group-first-session"
                type="text"
                className="sg-form-input"
                placeholder="e.g. Tomorrow at 6:00 PM"
                value={firstSession}
                onChange={(e) => setFirstSession(e.target.value)}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sg-modal-footer">
            <button
              type="button"
              className="sg-modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sg-modal-submit-btn flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                  <span>Creating Squad...</span>
                </>
              ) : (
                <>
                  <Plus size={15} aria-hidden="true" />
                  <span>Create Study Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
