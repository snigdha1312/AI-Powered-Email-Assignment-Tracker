import React from 'react';
import { Bell, User } from 'lucide-react';

const Topbar = () => {
  return (
    <header style={{
      height: 'var(--topbar-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      borderBottom: '1px solid var(--glass-border)',
      background: 'var(--bg-color)',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Welcome back to your assignments.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          position: 'relative'
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--status-urgent)',
            borderRadius: '50%',
          }}></span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>Alex Doe</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Product Manager</p>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--glass-border)'
          }}>
            <User size={20} color="var(--text-secondary)" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
