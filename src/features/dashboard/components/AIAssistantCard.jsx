import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, CheckCircle2, MessageSquare } from 'lucide-react';

/**
 * AIAssistantCard component
 * Frontend preview for Cohort's academic copilot.
 * Offers contextual peer and deadline insights plus quick prompt chips.
 */
export const AIAssistantCard = ({ previewData }) => {
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isOpenAssistantModal, setIsOpenAssistantModal] = useState(false);

  const handlePromptClick = (chip) => {
    setSelectedPrompt(chip);
    setIsOpenAssistantModal(true);
  };

  return (
    <>
      <article className="dashboard-card ai-assistant-card" aria-labelledby="ai-assistant-heading">
        <div className="ai-assistant-glow" aria-hidden="true" />
        
        <div className="dashboard-card-header ai-header">
          <div className="card-title-group">
            <div className="ai-icon-badge" aria-hidden="true">
              <Bot size={20} className="ai-bot-icon" />
            </div>
            <div>
              <div className="ai-tag">
                <Sparkles size={11} aria-hidden="true" />
                <span>{previewData.badge || 'Academic Copilot'}</span>
              </div>
              <h2 id="ai-assistant-heading" className="card-title ai-title">
                {previewData.heading || 'AI Study Assistant'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            className="ai-open-btn"
            onClick={() => setIsOpenAssistantModal(true)}
            aria-label="Open AI Study Assistant preview dialog"
          >
            <span>Open Assistant</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>

        <div className="ai-message-bubble">
          <p className="ai-message-text">{previewData.summary}</p>
        </div>

        <div className="ai-chips-container" aria-label="Suggested study assistant prompts">
          <span className="ai-chips-label">Suggested queries:</span>
          <div className="ai-chips-list">
            {previewData.promptChips.map((chip) => (
              <button
                key={chip}
                type="button"
                className="ai-chip"
                onClick={() => handlePromptClick(chip)}
                aria-label={`Ask assistant: ${chip}`}
              >
                <Sparkles size={11} className="chip-sparkle" aria-hidden="true" />
                <span>{chip}</span>
              </button>
            ))}
          </div>
        </div>
      </article>

      {/* Lightweight modal dialog for preview */}
      {isOpenAssistantModal && (
        <div
          className="collab-modal-overlay"
          onClick={() => setIsOpenAssistantModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="assistant-modal-title"
        >
          <div
            className="collab-modal assistant-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="assistant-modal-header">
              <div className="card-title-group">
                <div className="ai-icon-badge" aria-hidden="true">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 id="assistant-modal-title" className="collab-modal-title">
                    Cohort Academic Copilot
                  </h3>
                  <p className="card-subtitle">AI powered study group & resource matchmaking</p>
                </div>
              </div>
            </div>

            <div className="assistant-modal-body">
              {selectedPrompt ? (
                <div className="assistant-query-box">
                  <div className="user-query-pill">
                    <MessageSquare size={13} aria-hidden="true" />
                    <span>Query: "{selectedPrompt}"</span>
                  </div>
                  <div className="assistant-response-card">
                    <p>
                      Analyzing your course syllabus for <strong>DBMS</strong> and <strong>React</strong>...
                    </p>
                    <ul className="assistant-results-list">
                      <li>
                        <CheckCircle2 size={13} className="text-pine" />
                        Found 3 active students currently revising this topic.
                      </li>
                      <li>
                        <CheckCircle2 size={13} className="text-pine" />
                        Retrieved 2 verified class slide decks in your Resource Hub.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-ink-soft" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {previewData.summary}
                </p>
              )}
              <p className="assistant-note">
                Note: This is a frontend preview. Live AI integration connects here via your Cohort AI microservice.
              </p>
            </div>

            <div className="assistant-modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setSelectedPrompt(null);
                  setIsOpenAssistantModal(false);
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantCard;
