import React from 'react';
import { Sparkles } from 'lucide-react';
import { POPULAR_TOPICS } from '../resourcesData';

/**
 * PopularTopics component
 * 
 * Section 5: Popular topics section
 * Clickable topic chips:
 * - DBMS
 * - DSA
 * - Operating Systems
 * - Machine Learning
 * - Web Development
 * - Computer Networks
 * - System Design
 * - Placement Preparation
 * Clicking a topic applies a local filter immediately.
 */
export const PopularTopics = ({
  activeTopic,
  onSelectTopic,
}) => {
  return (
    <section className="res-topics-section" aria-label="Popular Academic Topics">
      <div className="res-topics-label-group">
        <Sparkles size={14} className="text-marigold" aria-hidden="true" />
        <span className="res-topics-label">Popular Topics:</span>
      </div>

      <div className="res-topics-chips-wrap" role="group" aria-label="Filter resources by topic">
        {POPULAR_TOPICS.map((topic) => {
          const isActive = activeTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              className={`res-topic-chip ${isActive ? 'res-topic-active' : ''}`}
              onClick={() => onSelectTopic(isActive ? 'All Subjects' : topic)}
              aria-pressed={isActive}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default PopularTopics;
