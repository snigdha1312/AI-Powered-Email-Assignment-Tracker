import React from 'react';

const Settings = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '2rem' }}>Settings</h2>
      
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: '12px',
        padding: '2rem',
        border: '1px solid var(--glass-border)'
      }}>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Account Preferences</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          This is a placeholder for the settings page. You can configure notification preferences, connected email accounts, and integration keys here later.
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '0.5rem 1rem',
            background: 'var(--accent-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
