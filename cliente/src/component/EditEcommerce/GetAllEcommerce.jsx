import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const Ecommerce = () => {
    const [ecommerces, setEcommerces] = useState([]);
    const navigate = useNavigate(); // Call useNavigate here

    useEffect(() => {
        const fetchEcommerces = async () => {
            try {
                const csrfToken = getCsrfToken();
                const headers = {
                    'X-CSRFToken': csrfToken,
                };

                const response = await axios.get('http://127.0.0.1:8000/base/get_all_ecommerce/', {
                    headers,
                    withCredentials: true,
                });

                setEcommerces(response.data.ecommerce_info);
                console.log(response)
            } catch (error) {
                console.error('Error al obtener los ecommerce:', error);
            }
        };

        fetchEcommerces();
    }, []); 

    const ecommerceStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const ecommerceCardStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '200px',
        height: '50px',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
        color: 'black',
        cursor: 'pointer',
    };

    const handleGetReservationsClick = () => {
        navigate('/GetReservation');
    };

    return (
        <div style={ecommerceStyle}>
            <h1>Ecommerces:</h1>
            {ecommerces.map((ecommerce) => (
                <div style={ecommerceCardStyle} key={ecommerce.key}>
                    {ecommerce.name}
                </div>
            ))}
            <button className="btn btn-tertiary" onClick={handleGetReservationsClick}>
            Ver Reservas
            </button>
        </div>
    );
};

export default Ecommerce;
