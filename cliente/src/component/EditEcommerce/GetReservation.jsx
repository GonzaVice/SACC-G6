import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Add this line to import useLocation

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}
const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [ecommerceName, setEcommerceName] = useState('');
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.ecommerceName) {
            setEcommerceName(location.state.ecommerceName);

            const fetchReservations = async () => {
                try {
                    const csrfToken = getCsrfToken();
                    const headers = {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    };

                    const data = {
                        name: location.state.ecommerceName, // Use the passed e-commerce name
                    };

                    const response = await axios.post('http://127.0.0.1:8000/base/get_reservations_of_ecommerce/', data, {
                        headers,
                        withCredentials: true,
                    });

                    setReservations(response.data.data.reservations);
                    console.log("Esta es la response:", response);
                } catch (error) {
                    console.error('Error al obtener las reservas:', error);
                }
            };

            fetchReservations();
        }
    }, [location.state]);

    const reservationsStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const reservationCardStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '300px',
        margin: '10px',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: '#333',
        color: 'white',
    };
    const attributeTitleStyle = {
        fontWeight: 'bold', // Make the attribute title text bold
    };
    const titleStyle = {
        fontWeight: 'bold', // Make the title text bold
    };
    
    return (
        <div style={reservationsStyle}>
            <h1 style={titleStyle}>Reservations:</h1> {/* Apply the titleStyle to the title */}
            {reservations.map((reservation) => (
                <div style={reservationCardStyle} key={reservation.id}>
                    <p><span style={attributeTitleStyle}>ID:</span> {reservation.id}</p>
                    <p><span style={attributeTitleStyle}>Operador:</span> {reservation.operador}</p>
                    <p><span style={attributeTitleStyle}>Cliente:</span> {reservation.cliente}</p>
                    <p><span style={attributeTitleStyle}>State:</span> {reservation.state}</p>
                    <p><span style={attributeTitleStyle}>Datetime:</span> {reservation.datetime}</p>
                    <p><span style={attributeTitleStyle}>Hora Confirmacion Reserva:</span> {reservation.horaConfirmacionReserva}</p>
                    <p><span style={attributeTitleStyle}>Hora Confirmacion Operador:</span> {reservation.horaConfirmacionOperador}</p>
                    <p><span style={attributeTitleStyle}>Hora Carga:</span> {reservation.horaCarga}</p>
                    <p><span style={attributeTitleStyle}>Hora Descarga:</span> {reservation.horaDescarga}</p>
                    <p><span style={attributeTitleStyle}>Hora Finalizacion:</span> {reservation.horaFinalizacion}</p>
                    <p><span style={attributeTitleStyle}>Hora Cancelacion:</span> {reservation.horaCancelacion}</p>
                </div>
            ))}
        </div>
    );
    
};

export default Reservations;
