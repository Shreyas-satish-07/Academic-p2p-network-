import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { ROUTES } from '../../constants/routes';
const listVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};
export const ActivityTimeline = ({ activities }) => {
    const navigate = useNavigate();
    const handleActivityClick = (title) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('resource') || lowerTitle.includes('uploaded')) {
            navigate(ROUTES.RESOURCES);
        }
        else if (lowerTitle.includes('project')) {
            navigate(ROUTES.PROJECTS);
        }
        else if (lowerTitle.includes('study group') || lowerTitle.includes('gradient descent')) {
            navigate(ROUTES.STUDY_GROUPS);
        }
        else if (lowerTitle.includes('connected') || lowerTitle.includes('message') || lowerTitle.includes('collaboration')) {
            navigate(ROUTES.MESSAGES);
        }
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-slate">AC</span>
        <CardTitle>Activity feed</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div className="flex flex-col" variants={listVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {activities.map((activity, index) => {
            const isClickable = activity.title.toLowerCase().includes('resource') ||
                activity.title.toLowerCase().includes('project') ||
                activity.title.toLowerCase().includes('study group') ||
                activity.title.toLowerCase().includes('gradient descent') ||
                activity.title.toLowerCase().includes('connected') ||
                activity.title.toLowerCase().includes('message') ||
                activity.title.toLowerCase().includes('collaboration');
            return (<motion.div key={activity.id} className={`activity-item ${isClickable ? 'cursor-pointer' : ''}`} variants={itemVariants} onClick={isClickable ? () => handleActivityClick(activity.title) : undefined}>
                {index < activities.length - 1 && (<div className="activity-line"/>)}
                <div className="activity-dot"/>
                <div className="activity-body">
                  <div className="t">{activity.title}</div>
                  <div className="s">{activity.time}</div>
                </div>
              </motion.div>);
        })}
        </motion.div>
      </CardContent>
    </Card>);
};
export default ActivityTimeline;
