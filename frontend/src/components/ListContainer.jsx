import React from 'react';
import EmptyState from './EmptyState';
import AssignmentCard from './AssignmentCard';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

const ListContainer = ({ title, icon: Icon, assignments, onComplete }) => {
  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        marginBottom: '1rem',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '0.75rem'
      }}>
        {Icon && <Icon size={20} color="var(--text-secondary)" />}
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>{title}</h2>
        <span style={{ 
          background: 'var(--bg-secondary)', 
          padding: '2px 8px', 
          borderRadius: '12px', 
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          {assignments.length}
        </span>
      </div>

      {assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '1.25rem' 
          }}
        >
          {assignments.map((assignment, index) => (
            <motion.div key={assignment.id || index} variants={itemVariants}>
              <AssignmentCard {...assignment} onComplete={onComplete} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ListContainer;
