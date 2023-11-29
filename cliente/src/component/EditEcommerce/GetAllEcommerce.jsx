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
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('Error fetching ecommerces:', error);
            }
        };

        fetchEcommerces();
    }, []);

    const deleteButtonStyle = {
        backgroundColor: 'red',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '3px',
        border: 'none',
        cursor: 'pointer',
    };

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
        width: '300px',
        height: '100px',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#f0f0f0',
        color: 'black',
        cursor: 'pointer',
    };

    const handleGetReservationsClick = (ecommerceName) => {
        navigate('/GetReservation', { state: { ecommerceName } });
    };

    const handleDeleteEcommerceClick = async (ecommerceName) => {
        try {
            const csrfToken = getCsrfToken();
            const headers = {
                'X-CSRFToken': csrfToken,
            };

            await axios.post('http://127.0.0.1:8000/base/delete_ecommerce/', { name: ecommerceName }, {
                headers,
                withCredentials: true,
            });

            window.location.reload();

        } catch (error) {
            console.error('Error deleting ecommerce:', error);
        }
    };

    const handleCreateEcommerceClick = () => {
        navigate('/CreateEcommerce');
    };

    const handleEditEcommerceClick = () => {
        navigate('/EditEcommerce');
    };

    const handleBackClick = () => {
        navigate('/home');
    };

    return (
        <div style={ecommerceStyle}>
            <h1>Ecommerces:</h1>
            {ecommerces.map((ecommerce, index) => (
                <div style={ecommerceCardStyle} key={index}>
                    <div>
                        <p><strong>Name:</strong> {ecommerce.name}</p>
                        <p><strong>Key:</strong> {ecommerce.key}</p>
                    </div>
                    <button className="btn btn-tertiary" onClick={() => handleGetReservationsClick(ecommerce.name)}>
                        Ver Reservas
                    </button>
                    <button className="btn btn-delete" style={deleteButtonStyle} onClick={() => handleDeleteEcommerceClick(ecommerce.name)}>
                        Delete
                    </button>
                </div>
            ))}
            <div className="button-container">
                <button className="btn btn-tertiary" onClick={handleCreateEcommerceClick}>
                    Create Ecommerce
                </button>
                <button className="btn" onClick={handleEditEcommerceClick}>
                    Edit Ecommerce
                </button>
                <button className="btn btn-secondary" onClick={handleBackClick}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default Ecommerce;
