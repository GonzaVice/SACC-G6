import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [ecommerceName, setEcommerceName] = useState(''); // Set your ecommerce name here

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const csrfToken = getCsrfToken();
                const headers = {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                };

                const data = {
                    name: 'Falabella',
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
    }, []); 

    return (
        <div>
            <h1>Reservations:</h1>
            {reservations.map((reservation) => (
                <div key={reservation.id}>
                    <p>Name: {reservation.name}</p>
                    <p>Operador: {reservation.operador}</p>
                    <p>Cliente: {reservation.cliente}</p>
                    <p>State: {reservation.state}</p>
                    <p>Datetime: {reservation.datetime}</p>
                    <p>Hora Confirmacion Reserva: {reservation.horaConfirmacionReserva}</p>
                    <p>Hora Confirmacion Operador: {reservation.horaConfirmacionOperador}</p>
                    <p>Hora Carga: {reservation.horaCarga}</p>
                    <p>Hora Descarga: {reservation.horaDescarga}</p>
                    <p>Hora Finalizacion: {reservation.horaFinalizacion}</p>
                    <p>Hora Cancelacion: {reservation.horaCancelacion}</p>
                </div>
            ))}
        </div>
    );
};

export default Reservations;
