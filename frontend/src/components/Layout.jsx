import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ErrorBoundary from './ErrorBoundary';

function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // helper: trigger resize after a short delay (gives CSS transitions time)
    const triggerResize = useCallback((delay = 220) => {
        setTimeout(() => {
            try { window.dispatchEvent(new Event('resize')); } catch (e) { /* ignore */ }
        }, delay);
    }, []);

    // When route changes, if we land on /map trigger resize so map reflows
    useEffect(() => {
        triggerResize(180);
    }, [location.pathname, triggerResize]);

    // Pagini fără TopBar și Sidebar
    const noLayoutPages = ['/login', '/register'];
    const showLayout = !noLayoutPages.includes(location.pathname);

    if (!showLayout) {
        return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    return (
        <ErrorBoundary>
            <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
                {/* Sidebar is overlay now */}
                <Sidebar isOpen={open} onToggle={() => { setOpen(p => !p); triggerResize(280); }} onClose={() => { setOpen(false); triggerResize(280); }} />

                {/* top header: fixed position, NOT moved by sidebar */}
                <header style={{
                    position: 'fixed',
                    left: 64, // fixed so header doesn't shift when sidebar opens
                    right: 0,
                    top: 0,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 16px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    background: '#fff',
                    zIndex: 55,
                    transition: 'none'
                }}>
                    <div style={{ width: 36 }} /> {/* left spacer */}
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>RoVia</div>
                    {/* profile / login button on the right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* determine auth */}
                        {(() => {
                            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
                            try {
                                if (token) {
                                    // logged in -> show profile button
                                    return (
                                        <button onClick={() => navigate('/profile')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="#111827" strokeWidth="1.5"/><path d="M5.5 20a7 7 0 0113 0" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        </button>
                                    );
                                }
                            } catch (e) { /* ignore */ }
                            // not logged in -> show login shortcut
                            return (
                                <button onClick={() => navigate('/login')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6 }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 17l5-5-5-5" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12h14" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                </button>
                            );
                        })()}
                    </div>
                </header>

                {/* overlay for small screens when sidebar expanded */}
                {open && (
                    <div
                        onClick={() => { setOpen(false); triggerResize(280); }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            top: 56, // below header
                            background: 'rgba(0,0,0,0.18)',
                            zIndex: 54,
                            transition: 'opacity 180ms ease'
                        }}
                    />
                )}

                {/* main content area: below header; fixed left margin so map/container keeps same size */}
                <main style={{
                    flex: 1,
                    marginLeft: 64, // constant: sidebar is overlay, don't push content
                    transition: 'none',
                    minHeight: '100vh',
                    paddingTop: 56, // leave space for fixed header
                    background: '#ffffff'
                }}>
                    <div style={{ minHeight: 20 }} />
                    {children}
                </main>
            </div>
        </ErrorBoundary>
    );
}

export default Layout;
