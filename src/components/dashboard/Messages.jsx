import React from 'react';
import { MESSAGES } from '../../data/students';
export const Messages = () => {
    return (<div className="card">
      <div className="card-head">
        <span className="card-tab tab-slate">MSG</span>
        <span className="card-title">Messages</span>
        <span className="card-count">3 new</span>
      </div>
      
      {MESSAGES.map((msg) => (<div key={msg.id} className="msg-row">
          <div className="msg-avatar" style={{ background: msg.bgClass, color: msg.textClass }}>
            {msg.avatarInitials}
          </div>
          <div className="msg-info">
            <div className="n">
              {msg.senderName} 
              {msg.online && <span className="online-dot"></span>}
            </div>
            <div className="p">{msg.previewText}</div>
          </div>
          <span className="msg-time">{msg.time}</span>
        </div>))}
    </div>);
};
export default Messages;
