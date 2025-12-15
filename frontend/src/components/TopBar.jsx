import { useMemo, useState, useEffect } from 'react';

function decodeJwt(token) {
	if (!token) return null;
	try {
		const payload = token.split('.')[1];
		// base64 url -> base64
		const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
		// pad
		const pad = base64.length % 4;
		const padded = base64 + (pad ? '='.repeat(4 - pad) : '');
		const json = JSON.parse(decodeURIComponent(escape(window.atob(padded))));
		return json;
	} catch {
		return null;
	}
}

function TopBar({ onMenuToggle }) {
	const username = useMemo(() => {
		const stored = localStorage.getItem('username');
		if (stored) return stored;
		const token = localStorage.getItem('token');
		const payload = decodeJwt(token);
		// common claim names
		return payload?.unique_name ?? payload?.name ?? payload?.email ?? payload?.sub ?? 'User';
	}, []);

	const [dark, setDark] = useState(() => {
		try {
			const stored = localStorage.getItem('theme');
			if (stored) return stored === 'dark';
			// default to user's OS preference
			return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		} catch { return false; }
	});

	useEffect(() => {
		const root = document.documentElement;
		if (dark) root.classList.add('dark');
		else root.classList.remove('dark');
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}, [dark]);

	return (
		<div className="topbar" style={{
			position: 'fixed',
			top: 0,
			left: 'var(--sidebar-left, 0)',
			right: 0,
			height: 'var(--topbar-height, 80px)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 16px',
			borderBottom: '1px solid var(--border)',
			background: 'var(--topbar-bg)',
			zIndex: 70
		}}>
			{/* Menu button */}
			<button 
				onClick={onMenuToggle}
				style={{
					padding: '8px',
					borderRadius: '8px',
					border: 'none',
					backgroundColor: 'transparent',
					cursor: 'pointer',
					display: 'flex',
					alignItems: 'center',
					fontSize: '16px'
				}}
			>
				<span style={{ fontSize: '20px' }}>☰</span>
				<span style={{ marginLeft: '8px', fontWeight: '500' }}>Menu</span>
			</button>

			{/* Titlu centrat */}
			<h1 style={{
				fontSize: '18px',
				fontWeight: 'bold',
				color: 'var(--text)',
				position: 'absolute',
				left: '50%',
				transform: 'translateX(-50%)'
			}}>
				RoVia - Descoperă România
			</h1>

			{/* User info - click pentru profil */}
			<div 
				style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
				onClick={() => window.location.href = '/profile'}
			>
				{/* Dark mode toggle */}
				<button
					onClick={(e) => { e.stopPropagation(); setDark(d => !d); }}
					aria-label="Toggle dark mode"
					style={{
						padding: '8px',
						borderRadius: '8px',
						border: 'none',
						background: 'transparent',
						cursor: 'pointer',
						fontSize: '18px'
					}}
				>
					{dark ? '🌙' : '☀️'}
				</button>

				<div style={{ textAlign: 'right' }}>
					<p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', margin: 0 }}>
						Bună, {username}!
					</p>
					<p style={{ fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
						Explorer
					</p>
				</div>
				<div className="topbar-avatar" style={{
					width: '40px',
					height: '40px',
					backgroundColor: 'var(--avatar-bg)',
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					color: 'white',
					fontWeight: 'bold',
					fontSize: '16px'
				}}>
					{(username && username[0])?.toUpperCase() ?? 'U'}
				</div>
			</div>
		</div>
	);
}

export default TopBar;
