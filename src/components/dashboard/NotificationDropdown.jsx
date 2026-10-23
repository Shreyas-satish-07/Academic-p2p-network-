import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NOTIFICATIONS } from '../../data/notifications';
import { ROUTES } from '../../constants/routes';
export const NotificationDropdown = ({ isOpen }) => {
    const navigate = useNavigate();
    const handleNotifClick = (notif) => {
        switch (notif.type) {
            case 'message':
            case 'meeting':
                navigate(ROUTES.MESSAGES);
                break;
            case 'invitation':
                if (notif.title.toLowerCase().includes('project')) {
                    navigate(ROUTES.PROJECTS);
                }
                else {
                    navigate(ROUTES.STUDY_GROUPS);
                }
                break;
            case 'resource':
                navigate(ROUTES.RESOURCES);
                break;
            case 'reminder':
                navigate(ROUTES.PROJECTS);
                break;
            default:
                break;
        }
    };
    const renderNotifIcon = (type) => {
        switch (type) {
            case 'message':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>);
            case 'invitation':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <path d="M3 9h18M8 4v5"/>
          </svg>);
            case 'resource':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>);
            case 'reminder':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 7v5l3 3"/>
          </svg>);
            case 'meeting':
                return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <circle cx="8" cy="9" r="3"/>
            <circle cx="17" cy="9" r="3"/>
            <path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6M13 14c3.3 0 6 2.7 6 6"/>
          </svg>);
            default:
                return null;
        }
    };
    return (<div className={`notif-panel ${isOpen ? 'open' : ''}`} id="notifPanel">
      <div className="notif-head">
        <span className="t">Notifications</span>
        <span className="n">12</span>
      </div>
      
      {NOTIFICATIONS.map((notif) => (<div key={notif.id} className={`notif-item cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors duration-150 ${notif.unread ? 'unread' : ''}`} onClick={() => handleNotifClick(notif)}>
          {notif.unread ? (<div className="notif-unread-dot"></div>) : (<div className="notif-spacer"></div>)}
          <div className="notif-ico" style={{ background: notif.bgClass, color: notif.textClass }}>
            {renderNotifIcon(notif.type)}
          </div>
          <div className="notif-body">
            <div className="t">{notif.title}</div>
            <div className="s">{notif.time}</div>
          </div>
        </div>))}
    </div>);
};
export default NotificationDropdown;
