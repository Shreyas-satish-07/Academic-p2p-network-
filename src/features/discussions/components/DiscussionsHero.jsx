import React from 'react';
import { Plus, MessageSquare, CheckCircle, HelpCircle, Sparkles } from 'lucide-react';

/**
 * DiscussionsHero component
 * Prominent header with title, value proposition, summary metrics, and Ask a Question CTA.
 */
export const DiscussionsHero = ({ onAskQuestionClick }) => {
  return (
    <section className="disc-hero" aria-label="Discussions Hub Introduction">
      <div className="disc-hero-accent" aria-hidden="true" />

      <div className="disc-hero-main">
        <div className="disc-hero-title-area">
          <div>
            <h1 className="disc-hero-title">Learn through better questions</h1>
            <p className="disc-hero-subtitle">
              Ask, explain, discuss, and grow with your cohort. Turn tricky technical hurdles into collaborative learning milestones.
            </p>
          </div>

          <button
            type="button"
            className="disc-hero-ask-btn"
            onClick={onAskQuestionClick}
            aria-label="Ask a new question"
          >
            <Plus size={16} aria-hidden="true" />
            <span>Ask a Question</span>
          </button>
        </div>

        <div className="disc-hero-badges" role="region" aria-label="Community discussion statistics">
          <div className="disc-hero-badge">
            <span className="disc-hero-badge-dot active" aria-hidden="true" />
            <HelpCircle size={14} className="text-pine flex-shrink-0" aria-hidden="true" />
            <span>126 discussions</span>
          </div>

          <div className="disc-hero-badge">
            <span className="disc-hero-badge-dot answers" aria-hidden="true" />
            <MessageSquare size={14} className="text-blue-500 flex-shrink-0" aria-hidden="true" />
            <span>438 answers</span>
          </div>

          <div className="disc-hero-badge">
            <span className="disc-hero-badge-dot solved" aria-hidden="true" />
            <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" aria-hidden="true" />
            <span>78 solved questions</span>
          </div>

          <div className="disc-hero-badge" style={{ marginLeft: 'auto' }}>
            <Sparkles size={14} className="text-marigold flex-shrink-0" aria-hidden="true" />
            <span>Verified Peer Answers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscussionsHero;
