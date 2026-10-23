import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { TRENDING_DISCUSSIONS } from '../../data/discussions';
export const DiscussionCard = () => {
    const navigate = useNavigate();
    return (<div className="card cursor-pointer" onClick={() => navigate(ROUTES.DISCUSSIONS)}>
      <div className="card-head">
        <span className="card-tab tab-marigold">DC</span>
        <span className="card-title">Trending discussions</span>
        <span className="card-link" style={{ marginLeft: 'auto' }}>View all →</span>
      </div>
      
      {TRENDING_DISCUSSIONS.map((disc) => (<div key={disc.id} className="disc-item cursor-pointer hover:bg-[rgba(0,0,0,0.02)] rounded-[8px] transition-colors p-1" onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.DISCUSSIONS, { state: { discussionId: disc.id } });
            }}>
          <div className="t">{disc.title}</div>
          <div className="disc-meta">
            <span className="vote-pill">▲ {disc.votes}</span>
            <span>{disc.commentsCount} comments</span>
            <span className="disc-cat">{disc.category}</span>
          </div>
        </div>))}
    </div>);
};
export default DiscussionCard;
