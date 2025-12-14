import { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MapPage() {
    const navigate = useNavigate();
    const [attractions, setAttractions] = useState([]);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        region: '',
        minRating: ''
    });
    const [loading, setLoading] = useState(true);
    const [mapError, setMapError] = useState(false);
    const [userName, setUserName] = useState('Demo User');
    const [mapInstance, setMapInstance] = useState(null);
    const mapRef = useRef(null);
    const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

    // Extrage numele utilizatorului din token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decodează JWT token manual (fără librării externe)
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                const email = tokenPayload.email || tokenPayload.sub || 'Utilizator';
                // Extrage numele din email (partea dinaintea @)
                const name = email.split('@')[0];
                setUserName(name.charAt(0).toUpperCase() + name.slice(1));
            } catch (error) {
                console.log('Nu s-a putut extrage numele din token:', error);
                setUserName('Utilizator');
            }
        }
    }, []);

    useEffect(() => {
        fetchAttractions();
    }, [filters]);

    const fetchAttractions = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            
            if (filters.type) params.append('type', filters.type);
            if (filters.region) params.append('region', filters.region);
            if (filters.minRating) params.append('minRating', filters.minRating);

            const response = await api.get(`/attractions?${params.toString()}`);
            setAttractions(response.data);
        } catch (error) {
            console.error('Eroare la încărcarea atracțiilor:', error);
            // Nu afișa error-ul ca să nu blocheze aplicația
            setAttractions([]);
        } finally {
            // Întotdeauna oprește loading-ul
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const getMarkerIcon = (type) => {
        const icons = {
            1: '🌿', // Natural
            2: '🎭', // Cultural
            3: '🏰', // Historic
            4: '🎢', // Entertainment
            5: '⛪'  // Religious
        };
        return icons[type] || '📍';
    };

    // Dacă nu avem API key, afișează mesaj de eroare
    if (mapError) {
        return (
            <div style={{ position: 'relative', overflow: 'hidden', minHeight: 'calc(100vh - var(--topbar-height, 80px))' }}>
                <div style={{
                    paddingTop: '64px',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f3f4f6'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <h2 style={{ color: '#ef4444', marginBottom: '16px', fontSize: '24px' }}>
                            ⚠️ Problemă cu Google Maps
                        </h2>
                        <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
                            API key-ul pentru Google Maps lipsește sau nu este valid. 
                            <br />Pentru a vedea harta, adaugă API key-ul în fișierul <code>.env</code>.
                        </p>
                        
                        <div style={{ 
                            backgroundColor: '#f9fafb', 
                            padding: '16px', 
                            borderRadius: '8px',
                            marginBottom: '24px',
                            textAlign: 'left',
                            fontFamily: 'monospace',
                            fontSize: '14px'
                        }}>
                            <strong>Pași pentru rezolvare:</strong>
                            <br />1. Obține un API key de la Google Cloud Console
                            <br />2. Creează fișierul <code>.env</code> în folder-ul frontend
                            <br />3. Adaugă: <code>VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
                            <br />4. Restart aplicația
                        </div>

                        {/* Lista atracțiilor fără hartă */}
                        <div style={{ marginTop: '24px' }}>
                            <h3 style={{ marginBottom: '16px', color: '#374151' }}>
                                📍 Atracții disponibile ({attractions.length})
                            </h3>
                            
                            {loading ? (
                                <p style={{ color: '#6b7280' }}>Se încarcă atracțiile...</p>
                            ) : (
                                <div style={{ 
                                    display: 'grid', 
                                    gap: '12px', 
                                    maxHeight: '300px', 
                                    overflowY: 'auto' 
                                }}>
                                    {attractions.map(attraction => (
                                        <div key={attraction.id} style={{
                                            backgroundColor: '#f9fafb',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            textAlign: 'left'
                                        }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <strong style={{ color: '#374151' }}>
                                                        {getMarkerIcon(attraction.type)} {attraction.name}
                                                    </strong>
                                                    <br />
                                                    <small style={{ color: '#6b7280' }}>
                                                        📍 {attraction.region} • ⭐ {attraction.rating}/5
                                                    </small>
                                                </div>
                                                <button
                                                    onClick={() => navigate(`/attractions/${attraction.id}`)}
                                                    style={{
                                                        padding: '4px 8px',
                                                        backgroundColor: '#3b82f6',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    Vezi →
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Counter atracții */}
                <div style={{
                    position: 'fixed',
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 20
                }}>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        📍 {attractions.length} atracții găsite
                    </p>
                </div>
            </div>
        );
    }

    useEffect(() => {
        // disable page scroll when on map
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    // onLoad / onUnmount handlers
    const handleMapLoad = (map) => {
        setMapInstance(map);
        console.log('GoogleMap onLoad, map instance:', map);

        // calc topbar height from CSS var (fallback 80)
        let topbarValue = getComputedStyle(document.documentElement).getPropertyValue('--topbar-height')?.trim() || '80px';
        let topPx = 80;
        if (topbarValue.endsWith('px')) topPx = parseInt(topbarValue.replace('px','')) || 80;
        else {
            const parsed = parseFloat(topbarValue);
            if (!isNaN(parsed)) topPx = parsed;
        }

        // compute height in pixels and set it explicitly on the map div
        setTimeout(() => {
            try {
                const div = map.getDiv();
                const heightPx = Math.max(200, window.innerHeight - topPx); // min 200px
                div.style.height = `${heightPx}px`;
                div.style.top = `${topPx}px`;
                // ensure it's fixed to viewport
                div.style.position = 'fixed';
                div.style.left = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-left')?.trim() || '0';
                div.style.right = '0';
                div.style.bottom = '0';
                console.log('map div size', div.clientWidth, div.clientHeight);
            } catch (e) {
                console.warn('Failed to set map div style:', e);
            }

            // force Google Maps to recalc/paint
            try {
                if (window.google && window.google.maps && window.google.maps.event) {
                    window.google.maps.event.trigger(map, 'resize');
                }
                if (typeof map.panBy === 'function') map.panBy(0, 0);
            } catch (e) { console.warn(e); }
        }, 50);
    };
    const handleMapUnmount = () => {
        setMapInstance(null);
        console.log('GoogleMap unmounted');
    };

    // changed: use top/left/right/bottom for robust full-viewport under topbar
    const mapContainerStyle = {
        position: 'fixed',
        top: 'var(--topbar-height, 80px)',
        left: 'var(--sidebar-left, 0)',
        right: 0,
        bottom: 0,
        zIndex: 1
    };

    const mapOptions = {
        mapTypeControl: false,      // remove Map / Satellite buttons
        streetViewControl: false,
        // keep fullscreenControl if you want; remove below line to hide it
        fullscreenControl: true,
        zoomControl: true
    };

    return (
        // NOTE: changed from height: '100vh' to minHeight calc to avoid total height > viewport (TopBar fixed)
        <div style={{ position: 'relative', overflow: 'hidden', height: 'calc(100vh - var(--topbar-height, 80px))' }}>
            
            {/* Loading indicator - poziționat sub TopBar */}
            {loading && (
                <div style={{
                    position: 'fixed',
                    top: 'var(--topbar-height, 80px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    zIndex: 20
                }}>
                    <p style={{ color: '#6b7280', margin: 0 }}>Se încarcă atracțiile... 🔄</p>
                </div>
            )}

            {/* Google Maps */}
            {isLoaded ? (
                <GoogleMap
                    ref={mapRef}
                    onLoad={handleMapLoad}
                    onUnmount={handleMapUnmount}
                    mapContainerStyle={mapContainerStyle}
                    zoom={7}
                    center={{ lat: 45.9432, lng: 24.9668 }}
                    options={mapOptions}
                >
                    {attractions.map(attraction => (
                        <Marker
                            key={attraction.id}
                            position={{ lat: attraction.latitude, lng: attraction.longitude }}
                            onClick={() => setSelectedAttraction(attraction)}
                            title={attraction.name}
                        />
                    ))}

                    {selectedAttraction && (
                        <InfoWindow
                            position={{ lat: selectedAttraction.latitude, lng: selectedAttraction.longitude }}
                            onCloseClick={() => setSelectedAttraction(null)}
                        >
                            <div style={{ textAlign: 'center', minWidth: '200px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', color: '#374151' }}>{selectedAttraction.name}</h3>
                                <p style={{ margin: '4px 0', color: '#6b7280', fontSize: '14px' }}>
                                    {selectedAttraction.region} • {selectedAttraction.type}
                                </p>
                                <p style={{ margin: '8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                                    ⭐ {selectedAttraction.rating}/5
                                </p>
                                <button onClick={() => navigate(`/attractions/${selectedAttraction.id}`)} style={{ marginTop: '8px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
                                    Vezi detalii →
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            ) : (
                <div style={{
                    position: 'fixed',
                    top: 'var(--topbar-height, 80px)',
                    left: 'var(--sidebar-left, 0)',
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    zIndex: 10
                }}>
                    <p style={{ color: '#6b7280', fontSize: '18px', margin: 0 }}>Se încarcă harta Google Maps...</p>
                </div>
            )}
        </div>
    );
}
