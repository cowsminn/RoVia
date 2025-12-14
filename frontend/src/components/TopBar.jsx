import { useMemo } from 'react';

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

	return (
		<div style={{
			position: 'fixed',
			top: 0,
			left: 'var(--sidebar-left, 0)',
			right: 0,
			height: 'var(--topbar-height, 80px)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			padding: '0 16px',
			borderBottom: '1px solid #e5e7eb',
			background: 'white',
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
				color: '#374151',
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
				<div style={{ textAlign: 'right' }}>
					<p style={{ fontSize: '14px', fontWeight: '500', color: '#374151', margin: 0 }}>
						Bună, {username}!
					</p>
					<p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
						Explorer
					</p>
				</div>
				<div style={{
					width: '40px',
					height: '40px',
					backgroundColor: '#3b82f6',
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
