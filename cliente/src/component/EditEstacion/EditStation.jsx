import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const EditStation = () => {
  const { station_id } = useParams();
  const navigate = useNavigate();
  const [newStationName, setNewStationName] = useState('');

  const handleSaveChanges = async () => {
    try {
      const csrfToken = getCsrfToken();
      const headers = {
        'X-CSRFToken': csrfToken,
      };

      // Realiza la solicitud POST para editar el nombre de la estación
      await axios.post(`http://127.0.0.1:8000/base/edit_station/`, 
      { 
        'station_id': station_id,
        'name': newStationName,
      }, {
        headers,
        withCredentials: true,
      });

      // Redirige a la página de detalles de la estación o a donde sea necesario
      navigate('/DashboardActualPorEstacion', { state: 
        { 
            station_name: newStationName, 
            station_id: station_id 
        } 
    });
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  };

  return (
    <div>
      <h1>Edit Station</h1>
      <label>
        Nuevo nombre de la estación:
        <input
          type="text"
          value={newStationName}
          onChange={(e) => setNewStationName(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSaveChanges}>Guardar Cambios</button>
    </div>
  );
};

export default EditStation;
