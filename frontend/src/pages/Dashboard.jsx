import React, { useState, useEffect } from 'react';
import ListContainer from '../components/ListContainer';
import { Calendar, Clock, AlertCircle, RefreshCw, Filter } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const API_BASE = 'http://127.0.0.1:8000/api';

const Dashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // all, urgent, upcoming, completed

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/assignments/`);
      setAssignments(res.data);
    } catch (err) {
      console.error("Failed to fetch assignments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post(`${API_BASE}/emails/sync/`);
      await fetchAssignments();
    } catch (err) {
      console.error("Failed to sync emails", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      await axios.patch(`${API_BASE}/assignments/${id}/`, { status: 'completed' });
      // Update local state directly
      setAssignments(prev => prev.map(a => a.id === id ? { ...a, status: 'completed' } : a));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    fetchAssignments();
    // Request permission for Web Notifications on mount
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  // Watch assignments to trigger Browser Notifications
  useEffect(() => {
    if (assignments.length > 0 && "Notification" in window && Notification.permission === "granted") {
      assignments.forEach(task => {
        if (task.status !== 'completed' && task.deadline) {
          const timeDiff = new Date(task.deadline) - new Date();
          const hoursLeft = timeDiff / (1000 * 60 * 60);
          
          // If task is due in under 2 hours and hasn't been completed
          if (hoursLeft > 0 && hoursLeft <= 2) {
            // Use browser localStorage to prevent spamming notifications on every reload
            const notifKey = `notified_${task.id}`;
            if (!localStorage.getItem(notifKey)) {
              new Notification("Task Deadline Approaching!", {
                body: `'${task.title}' is due in less than 2 hours.`,
                icon: '/vite.svg'
              });
              localStorage.setItem(notifKey, "true");
            }
          }
        }
      });
    }
  }, [assignments]);

  // Filter Logic
  let filteredAssignments = assignments;
  if (activeFilter !== 'all') {
    filteredAssignments = assignments.filter(a => a.status === activeFilter);
  }

  // Sort by deadline natively
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  const urgentTasks = sortedAssignments.filter(t => t.status === 'urgent');
  const upcomingTasks = sortedAssignments.filter(t => t.status === 'upcoming' || t.status === 'pending');
  const completedTasks = sortedAssignments.filter(t => t.status === 'completed');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          {['all', 'urgent', 'upcoming', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'var(--accent-primary)' : 'transparent',
                color: activeFilter === f ? 'white' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sync Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSync}
          disabled={syncing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            cursor: syncing ? 'not-allowed' : 'pointer',
            opacity: syncing ? 0.7 : 1,
            fontWeight: 500
          }}
        >
          <motion.div animate={{ rotate: syncing ? 360 : 0 }} transition={{ repeat: syncing ? Infinity : 0, duration: 1, ease: 'linear' }}>
            <RefreshCw size={18} />
          </motion.div>
          {syncing ? 'Scanning Inbox...' : 'Fetch New Emails'}
        </motion.button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem', marginTop: '2rem' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
                <motion.div 
                   key={i}
                   animate={{ opacity: [0.5, 1, 0.5] }} 
                   transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut', delay: i * 0.1 }}
                   style={{
                       height: '120px',
                       background: 'var(--bg-secondary)',
                       borderRadius: '12px',
                       border: '1px solid var(--glass-border)'
                   }}
                />
            ))}
        </div>
      ) : (
        <>
          {(activeFilter === 'all' || activeFilter === 'urgent') && (
            <ListContainer 
              title="Urgent & Overdue" 
              icon={AlertCircle} 
              assignments={urgentTasks}
              onComplete={handleMarkComplete}
            />
          )}
          
          {(activeFilter === 'all' || activeFilter === 'upcoming') && (
            <ListContainer 
              title="Upcoming Actions" 
              icon={Calendar} 
              assignments={upcomingTasks}
              onComplete={handleMarkComplete}
            />
          )}

          {activeFilter === 'completed' && (
            <ListContainer 
              title="Completed Tasks" 
              icon={Filter} 
              assignments={completedTasks}
              onComplete={handleMarkComplete}
            />
          )}
        </>
      )}

    </div>
  );
};

export default Dashboard;
