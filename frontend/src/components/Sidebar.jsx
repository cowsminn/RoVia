import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Icon = ({ name }) => {
  // SVGs use currentColor so they inherit text color from CSS variables
  if (name === 'home') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 21V11h14v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === 'trophy') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3h8v4a4 4 0 01-4 4 4 4 0 01-4-4V3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 8v2a5 5 0 005 5h4a5 5 0 005-5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === 'mail') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 8.5v7a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 8.5L12 14 3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === 'user') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M5.5 20a7 7 0 0113 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === 'plus') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if (name === 'shield') return <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 5-3.6 9.7-7 10-3.4-.3-7-5-7-10V6l7-3z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return null;
};

export default function Sidebar({ isOpen, onToggle, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    try { localStorage.removeItem('token'); } catch (e) { /* ignore */ }
    if (onClose) onClose();
    navigate('/login');
  };
  // token/role detection (same as before)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  let isAuth = false, roleId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAuth = true;
      roleId = payload.roleId ?? payload.RoleId ?? payload.role ?? null;
    } catch (e) { isAuth = false; }
  }
  const isAdmin = Number(roleId) === 3;
  const isPromoter = Number(roleId) === 2 || isAdmin;

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 70,
    background: 'var(--card-bg)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'RoviaUI, Inter, system-ui',
    width: isOpen ? 320 : 64,
    transition: 'width 320ms cubic-bezier(.2,.8,.2,1), box-shadow 320ms cubic-bezier(.2,.8,.2,1)',
    boxShadow: isOpen ? 'rgba(2,6,23,0.12) 6px 0 20px' : 'none'
  };

  const iconBox = {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--topbar-bg)',
    borderRadius: 8
  };

  const itemRowBase = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 8px',
    cursor: 'pointer',
    borderRadius: 8,
    color: 'var(--text)',
    textDecoration: 'none'
  };

  const navItems = [
    { icon: 'home', label: 'Acasă', to: '/map' },
    { icon: 'trophy', label: 'Clasament', to: '/leaderboard' },
    { icon: 'mail', label: 'Contact', to: '/contact' },
  ];

  return (
    <div style={containerStyle}>
      {/* header / toggle */}
      <div style={{ padding: 12, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 12, top: 12 }}>
          <button
            onClick={onToggle}
            aria-label="toggle menu"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* nav: icon-only when closed; icon + labels when open (labels only rendered if isOpen) */}
      <div style={{ padding: 12, borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {navItems.map((it, idx) => {
          const itemStyle = { ...itemRowBase, justifyContent: isOpen ? 'flex-start' : 'center', marginTop: idx === 0 ? 0 : 0 };
          return (
            <Link key={it.label} to={it.to} style={itemStyle}>
              <div style={iconBox}><Icon name={it.icon} /></div>
              {isOpen && <div style={{ marginLeft: 6, transition: 'opacity 220ms ease, transform 220ms ease' }}>{it.label}</div>}
            </Link>
          );
        })}

        {!isAuth && (
          <Link to="/login" style={{ ...itemRowBase, justifyContent: isOpen ? 'flex-start' : 'center', marginTop: 4 }}>
            <div style={iconBox}><Icon name="user" /></div>
            {isOpen && <div style={{ marginLeft: 6 }}>Login / Register</div>}
          </Link>
        )}

        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isPromoter && (
            <Link to="/dashboard" style={{ display: 'flex', justifyContent: isOpen ? 'flex-start' : 'center', textDecoration: 'none' }}>
              <div style={iconBox}><Icon name="plus" /></div>
              {isOpen && <div style={{ marginLeft: 6 }}>Adaugă Atracție</div>}
            </Link>
          )}
          {isAdmin && (
            <Link to="/dashboard" style={{ display: 'flex', justifyContent: isOpen ? 'flex-start' : 'center', textDecoration: 'none' }}>
              <div style={iconBox}><Icon name="shield" /></div>
              {isOpen && <div style={{ marginLeft: 6 }}>Admin Dashboard</div>}
            </Link>
          )}
        </div>
      </div>

      {/* attractions area */}
      <div style={{
        flex: 1,
        overflowY: isOpen ? 'auto' : 'hidden',
        padding: isOpen ? 12 : 0,
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 260ms ease, padding 200ms ease',
      }}>
        {isOpen ? (
          <>
            <p style={{ fontSize: 12, color: 'var(--muted)', margin: '6px 0 12px 0' }}>ATRACȚII TURISTICE</p>
            {/* simplified static content */}
            <details>
              <summary style={{ padding: 10, borderRadius: 8, background: 'var(--card-bg)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 34, height: 34, background: 'var(--accent)', borderRadius: 8, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>▾</span>
                <span>Muntenia <small style={{ color: 'var(--muted)', marginLeft: 6 }}>(3)</small></span>
              </summary>
              <div style={{ padding: 8 }}>
                <div style={{ borderRadius: 8, background: 'var(--card-bg)', padding: 8, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>📍</div>
                  <div>
                    <div style={{ fontSize: 14 }}>Palatul Parlamentului</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>București</div>
                  </div>
                </div>
              </div>
            </details>
            {/* other regions... */}
          </>
        ) : null}
      </div>

      {/* footer */}
      {isOpen && (
        <div style={{ borderTop: '1px solid var(--border)', padding: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>© 2025 Descoperă România</div>
        </div>
      )}

      {/* logout footer - stays at bottom */}
      <div style={{ marginTop: 'auto', padding: 12, borderTop: '1px solid var(--border)' }}>
        {isOpen ? (
          <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false" style={{ flex: '0 0 18px' }}>
              <path d="M16 17l5-5-5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 5v14a2 2 0 002 2h8" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Deconectare</span>
          </button>
        ) : (
          <button onClick={handleLogout} aria-label="Deconectare" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false"><path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 5v14a2 2 0 002 2h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
