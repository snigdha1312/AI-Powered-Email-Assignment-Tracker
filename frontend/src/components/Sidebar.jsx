import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  return (
    <div style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1.5rem',
      borderRight: '1px solid var(--glass-border)',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-primary), #8b5cf6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Mail size={20} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>StoriMail</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <NavLink to="/" end style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          fontWeight: isActive ? 500 : 400,
          transition: 'all 0.2s ease',
        })}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/settings" style={({ isActive }) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0.85rem 1rem',
          borderRadius: '10px',
          background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
          color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
          fontWeight: isActive ? 500 : 400,
          transition: 'all 0.2s ease',
        })}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
