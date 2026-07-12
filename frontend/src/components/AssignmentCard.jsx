import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Check } from 'lucide-react';

const AssignmentCard = ({ id, title, deadline, status, onComplete }) => {
  let statusColor, bgColor, bgAccent, Icon;

  switch (status) {
    case 'urgent':
      statusColor = 'var(--status-urgent)';
      bgColor = 'var(--bg-secondary)';
      bgAccent = 'var(--status-urgent-bg)';
      Icon = AlertCircle;
      break;
    case 'upcoming':
    case 'pending':
      statusColor = 'var(--status-upcoming)';
      bgColor = 'var(--bg-secondary)';
      bgAccent = 'var(--status-upcoming-bg)';
      Icon = Clock;
      break;
    case 'completed':
      statusColor = 'var(--status-completed)';
      bgColor = 'rgba(30, 41, 59, 0.4)'; 
      bgAccent = 'var(--status-completed-bg)';
      Icon = CheckCircle;
      break;
    default:
      statusColor = 'var(--text-secondary)';
      bgColor = 'var(--bg-secondary)';
      bgAccent = 'transparent';
      Icon = Clock;
  }

  // Format deadline for UI safely assuming ISO 8601 parsing
  let displayDate = "No Specific Deadline";
  if (deadline) {
      const d = new Date(deadline);
      displayDate = d.toLocaleString(undefined, { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit' 
      });
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        background: bgColor,
        borderRadius: '12px',
        padding: '1.25rem',
        border: '1px solid var(--glass-border)',
        borderLeft: `4px solid ${statusColor}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        opacity: status === 'completed' ? 0.7 : 1,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '1rem', 
          fontWeight: 500,
          color: status === 'completed' ? 'var(--text-secondary)' : 'var(--text-primary)',
          textDecoration: status === 'completed' ? 'line-through' : 'none',
          paddingRight: '1rem'
        }}>
          {title}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '20px',
          background: bgAccent,
          color: statusColor,
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          flexShrink: 0
        }}>
          <Icon size={14} />
          {status === 'pending' ? 'upcoming' : status}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          <Clock size={16} />
          <span>{displayDate}</span>
        </div>

        {status !== 'completed' && onComplete && (
            <button 
               onClick={() => onComplete(id)}
               style={{
                   display: 'flex',
                   alignItems: 'center',
                   gap: '4px',
                   background: 'transparent',
                   border: '1px solid var(--glass-border)',
                   color: 'var(--text-secondary)',
                   padding: '0.25rem 0.6rem',
                   borderRadius: '6px',
                   cursor: 'pointer',
                   fontSize: '0.75rem',
                   transition: 'all 0.2s',
               }}
               onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--status-completed)'; e.currentTarget.style.borderColor = 'var(--status-completed)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
            >
                <Check size={14} /> Complete
            </button>
        )}
      </div>
    </motion.div>
  );
};

export default AssignmentCard;
