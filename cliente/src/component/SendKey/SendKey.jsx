import React, { useState } from 'react';
import axios from 'axios';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const SendKey = () => {
    const [lockerKey, setLockerKey] = useState('');
    const [stationId, setStationID] = useState('');
    const [lockerId, setLockerID] = useState('');
    const [userMail, setUserMail] = useState('');
    const [userType, setUserType] = useState('');

    const handleInputChangeStation = (event) => {
        setStationID(event.target.value);
    };

    const handleInputChangeLocker = (event) => {
        setLockerID(event.target.value);
    };
    
    const handleInputChangeKey = (event) => {
        setLockerKey(event.target.value);
    };

    const handleInputChangeMail = (event) => {
        setUserMail(event.target.value);
    };

    const handleUserTypeChange = (event) => {
        setUserType(event.target.value);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stationId || !lockerId || !lockerKey || !userType) {
            console.log('Por favor, complete todos los campos.');
            return;
        }

        try {

            const apiUrl = userType === 'operador' ? 'http://127.0.0.1:8000/base/operador_abre/' : 'http://127.0.0.1:8000/base/cliente_abre/';
            const response = await axios.post(apiUrl, {
                "station_name":stationId,
                "locker_name":lockerId,
                "usuario_clave":lockerKey,
                "usuario":userMail
            }, {
                headers: {
                  'X-CSRFToken': getCsrfToken()
                },
                withCredentials: true
            });

            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            // Manejar errores de la llamada Axios
            console.error('Error al realizar la solicitud:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ textAlign: 'right', width: '300px' }}>
                <label>
                    Estación: 
                    <input
                        type="text"
                        value={stationId}
                        onChange={handleInputChangeStation}
                        placeholder="Ingresar ID de estación..."
                    />
                </label>
                <br />
                <label>
                    N° De casillero:  
                    <input
                        type="number"
                        value={lockerId}
                        onChange={handleInputChangeLocker}
                        placeholder="Ingresar casillero..."
                    />
                </label>
                <br />
                <label>
                    Locker Key: 
                    <input
                        type="text"
                        value={lockerKey}
                        onChange={handleInputChangeKey}
                        placeholder="Ingresar locker key..."
                    />
                </label>
                <br />
                <label>
                    Mail: 
                    <input
                        type="text"
                        value={userMail}
                        onChange={handleInputChangeMail}
                        placeholder="Ingresar mail de usuario..."
                    />
                </label>
                <br />
                <label>
                    Tipo de Usuario:
                    <select value={userType} onChange={handleUserTypeChange}>
                        <option value="" disabled hidden>Seleccionar...</option>
                        <option value="operador">Operador</option>
                        <option value="cliente">Cliente</option>
                    </select>
                </label>
                <br />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
};

export default SendKey;