import React from 'react';
import { Flame } from 'lucide-react';
import { TRENDING_TOPICS } from '../discussionsData';

/**
 * TrendingTopics component
 * Highlights high-activity subject chips with discussion count badges.
 * Clicking a topic filters the feed to that specific topic.
 */
export const TrendingTopics = ({ selectedTopic, onSelectTopic }) => {
  return (
    <section className="disc-trending-wrapper" aria-label="Trending Discussion Topics">
      <div className="disc-trending-header">
        <Flame size={14} className="text-marigold flex-shrink-0" aria-hidden="true" />
        <span>Trending Academic Topics</span>
      </div>

      <div className="disc-trending-chips" role="list">
        {TRENDING_TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic.name || selectedTopic === topic.query;

          return (
            <button
              key={topic.name}
              type="button"
              className={`disc-trending-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectTopic(isSelected ? '' : topic.name)}
              aria-pressed={isSelected}
              aria-label={`Filter by ${topic.name} (${topic.count} discussions)`}
            >
              <span>{topic.name}</span>
              <span className="disc-trending-count">{topic.count}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default TrendingTopics;
