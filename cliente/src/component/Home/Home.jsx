import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const Home = () => {
    const [stations, setStations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStations = async () => {
            try {
        
                const csrfToken = getCsrfToken();
                const headers = {
                    'X-CSRFToken': csrfToken,
                };

                const response = await axios.get('http://127.0.0.1:8000/base/get_stations_info/', {
                    headers,
                    withCredentials: true,
                });

                setStations(response.data.station_info);
                console.log(response)
            } catch (error) {
                console.error('Error al obtener las estaciones:', error);
            }
        };

        fetchStations();
    }, []); 

    const handleButtonClick = (station) => {
        navigate('/DashboardActualPorEstacion', { state: { station_name: station.name, connection: station.conexion } });
    };

    const handleCreateStationClick = () => {
        navigate('/CreateEstacion');
    };

    const handleCreateLockerClick = () => {
        navigate('/CreateLocker');
    };
 
    const handleCreateEcommerceClick = () => {
        navigate('/CreateEcommerce');
    };

    return (
        <div>
            <h1>Estaciones:</h1>
            {stations.map((station) => (
                <button key={station.name} onClick={() => handleButtonClick(station)}>
                    {station.name}
                </button>
            ))}

            <button onClick={handleCreateStationClick}>
                Create Station
            </button>
            <button onClick={handleCreateLockerClick}>
                Create Locker
            </button>
            <button onClick={handleCreateEcommerceClick}>
                Create Ecommerce
            </button>
            
        </div>
    );
};

export default Home;

