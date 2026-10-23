import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
const getResponse = (query) => {
    const q = query.toLowerCase().trim();
    if ((q.includes('dbms') && (q.includes('resource') || q.includes('notes') || q.includes('file'))) ||
        q.includes('recommend resources for dbms') ||
        q.includes('find dbms resources')) {
        return {
            text: "I found 3 DBMS resources in the Resource Hub, including 'DBMS Notes.pdf' and 'DBMS Previous Question Papers.doc'. You can filter by subject 'DBMS' to access them.",
            action: { label: "Go to Resources", path: ROUTES.RESOURCES }
        };
    }
    if ((q.includes('dsa') && (q.includes('peer') || q.includes('partner') || q.includes('collaborator') || q.includes('react'))) ||
        q.includes('find a react study partner') ||
        q.includes('show dsa peers')) {
        return {
            text: "Based on Peer Match suggestions, Ananya Rao (95% match, React/Node.js/MongoDB) and Rahul Sharma (90% match, Python/TensorFlow) are excellent candidates interested in DSA or web projects.",
            action: { label: "Go to Peer Match", path: ROUTES.PEER_MATCH }
        };
    }
    if (q.includes('deadline') || q.includes('due') || q.includes('event') ||
        q.includes('show deadlines') ||
        q.includes('show my deadlines')) {
        return {
            text: "You have 4 upcoming deadlines this week: 'DBMS Assignment' (3 days left), 'CodeIO Hackathon' (6 days left), 'Mini-Project Review', and 'OS Lab Submission'. Ensure your submissions are ready.",
            action: { label: "View Deadlines", path: ROUTES.DASHBOARD } // stays on Dashboard
        };
    }
    if (q.includes('project') ||
        q.includes('show my projects') ||
        q.includes('what projects am i working on')) {
        return {
            text: "You are currently joined to 5 active projects: 'Academic Peer-to-Peer Network' (8/10 tasks complete), 'Campus Navigator App' (completed), and 'Regional Sentiment Analyzer' (In progress). Details are in the Projects section.",
            action: { label: "Go to Projects", path: ROUTES.PROJECTS }
        };
    }
    if (q.includes('group') || q.includes('study group') ||
        q.includes('find study groups')) {
        return {
            text: "Recommended study groups include: 'Gradient Descent' (ML, 18 members, live session active) and 'OS Internals Circle' (Systems, 9 members). Click below to view the Study Groups page.",
            action: { label: "Go to Study Groups", path: ROUTES.STUDY_GROUPS }
        };
    }
    if (q.includes('discussion') || q.includes('forum') || q.includes('open discussions')) {
        return {
            text: "Explore active discussions on normal forms or OS process schedulers in the Discussions forum. Click below to read answers or post a reply.",
            action: { label: "Go to Discussions", path: ROUTES.DISCUSSIONS }
        };
    }
    if (q.includes('study plan') || q.includes('generate a 7-day dsa study plan')) {
        return {
            text: "Here is your suggested 7-day study plan: Day 1-2: Array & Hashing review. Day 3-4: Sliding Window & Two Pointers. Day 5: Stack & Queue exercises. Day 6-7: Linked List traversal and recursion checklist.",
            action: { label: "Open Study Groups", path: ROUTES.STUDY_GROUPS }
        };
    }
    if (q.includes('missing skill') || q.includes('machine learning') || q.includes('identify missing skills')) {
        return {
            text: "To bridge ML/AI competencies, we recommend adding TensorFlow, PyTorch, or Jupyter notebooks to your skills grid. You can manage these in your Profile page.",
            action: { label: "Go to Profile", path: ROUTES.PROFILE }
        };
    }
    return {
        text: "I can help you navigate Cohort! Try asking about: resources (e.g. 'find DBMS resources'), peers (e.g. 'show DSA peers'), projects (e.g. 'what projects am I working on'), study groups, or deadlines.",
    };
};
export const AIAssistant = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef(null);
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    const handleSend = (text) => {
        if (!text.trim())
            return;
        // Add user message
        const userMsg = { sender: 'user', text };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);
        // Simulate thinking/typing delay
        setTimeout(() => {
            const response = getResponse(text);
            const aiMsg = {
                sender: 'ai',
                text: response.text,
                action: response.action,
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 400);
    };
    const handleReset = () => {
        setMessages([]);
        setInputValue('');
        setIsTyping(false);
    };
    return (<div className="ai-card">
      <div className="ai-head">
        <div className="ai-mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m12 2 2.2 5.8L20 10l-5.8 2.2L12 18l-2.2-5.8L4 10l5.8-2.2z"/>
          </svg>
        </div>
        <div className="ai-title">AI Academic Assistant</div>
        
        {messages.length > 0 && (<button className="ai-reset-btn" style={{ marginLeft: 'auto' }} onClick={handleReset}>
            Reset Chat
          </button>)}
      </div>

      {messages.length === 0 ? (<>
          <p className="ai-sub">Ask about peers, resources, or deadlines — try one of these suggestions:</p>
          
          <div className="ai-suggestions">
            <div className="ai-sugg" onClick={() => handleSend("Find a React study partner.")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
              Find a React study partner
            </div>
            <div className="ai-sugg" onClick={() => handleSend("Recommend resources for DBMS.")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
              Recommend resources for DBMS
            </div>
            <div className="ai-sugg" onClick={() => handleSend("Generate a 7-day DSA study plan.")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
              Generate a 7-day DSA study plan
            </div>
            <div className="ai-sugg" onClick={() => handleSend("Identify missing skills for Machine Learning.")}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9"/>
                <path d="M9 12h6M12 9v6"/>
              </svg>
              Identify missing skills for ML
            </div>
          </div>
        </>) : (<div className="ai-chat-log">
          {messages.map((msg, index) => (<div key={index} className={`ai-message ${msg.sender}`}>
              <div className="ai-msg-bubble">
                {msg.text}
                {msg.action && (<div className="ai-msg-action">
                    <button className="ai-btn" onClick={() => navigate(msg.action.path)}>
                      {msg.action.label}
                    </button>
                  </div>)}
              </div>
            </div>))}
          {isTyping && (<div className="ai-typing-indicator">
              <div className="ai-typing-dot"></div>
              <div className="ai-typing-dot"></div>
              <div className="ai-typing-dot"></div>
            </div>)}
          <div ref={chatEndRef}/>
        </div>)}

      {/* Input row */}
      <form className="ai-input-row" onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
        }}>
        <input type="text" className="ai-input" placeholder="Ask Cohort AI..." value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
        <button type="submit" className="ai-send-btn" aria-label="Send query">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>);
};
export default AIAssistant;
