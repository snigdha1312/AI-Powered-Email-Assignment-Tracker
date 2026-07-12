import React from 'react';
import { Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

const EmptyState = ({ message = "No assignments here yet." }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 2rem',
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        borderStyle: 'dashed',
        color: 'var(--text-secondary)'
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <Inbox size={32} opacity={0.6} />
      </div>
      <p style={{ margin: 0, fontWeight: 500 }}>{message}</p>
      <span style={{ fontSize: '0.875rem', opacity: 0.7, marginTop: '0.5rem' }}>
        Check back later or relax!
      </span>
    </motion.div>
  );
};

export default EmptyState;
