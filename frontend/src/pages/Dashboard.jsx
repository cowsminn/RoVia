import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('Se încarcă...');

    // Funcție de deconectare
    const handleLogout = () => {
        localStorage.removeItem('token'); // Ștergem token-ul
        navigate('/login'); // Trimitem utilizatorul la login
    };

    useEffect(() => {
        // Testăm dacă token-ul e valid accesând ruta securizată creată de tine
        api.get('/test/secure')
            .then(response => {
                setMessage("Acces permis! Ești autentificat securizat.");
            })
            .catch(error => {
                console.error("Eroare auth:", error);
                // Dacă tokenul e expirat sau invalid, scoatem utilizatorul
                handleLogout(); 
            });
    }, []);

    return (
        <div style={{ padding: '50px', fontFamily: 'Arial' }}>
            {/* ❌ Șterge <TopBar /> și <Sidebar /> dacă există */}
            
            <h1>🏡 Dashboard RoVia</h1>
            
            <div style={{ 
                padding: '20px', 
                backgroundColor: '#e3f2fd', 
                border: '1px solid #90caf9', 
                borderRadius: '8px', 
                marginBottom: '20px' 
            }}>
                <h3>Status: {message}</h3>
            </div>

            <p>Aici vor apărea în curând harta și atracțiile turistice.</p>
            
            <div style={{ marginTop: '20px' }}>
                <a 
                    href="/map" 
                    style={{
                        display: 'inline-block',
                        padding: '10px 20px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '500'
                    }}
                >
                    🗺️ Vezi Harta cu Atracții
                </a>
            </div>

            <button 
                onClick={handleLogout}
                style={{ 
                    padding: '10px 20px', 
                    background: '#d32f2f', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer',
                    borderRadius: '5px'
                }}
            >
                Deconectare
            </button>
        </div>
    );
}

export default Dashboard;