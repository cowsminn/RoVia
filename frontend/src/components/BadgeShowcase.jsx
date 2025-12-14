function BadgeShowcase({ badges = [] }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginTop: '16px'
    }}>
      <h2 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '18px' }}>
        🏆 Insignele Tale
      </h2>
      
      {badges.length === 0 ? (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>
          Nu ai obținut nicio insignă încă. Completează quiz-uri pentru a debloca!
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '12px'
        }}>
          {badges.map(badge => (
            <div
              key={badge.id}
              style={{
                textAlign: 'center',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '2px solid #fbbf24'
              }}
            >
              <div style={{
                fontSize: '48px',
                marginBottom: '8px'
              }}>
                {badge.iconUrl || '⭐'}
              </div>
              <h4 style={{ margin: '0 0 4px 0', color: '#374151', fontSize: '12px' }}>
                {badge.name}
              </h4>
              <p style={{ margin: '0', color: '#9ca3af', fontSize: '10px' }}>
                {new Date(badge.unlockedAt).toLocaleDateString('ro-RO')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgeShowcase;
