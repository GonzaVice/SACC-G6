import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AllLockers.css';

const getCsrfToken = () => {
    return document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];
}

const EditLockerPopup = ({ lockerId, lockers, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        length: '',
        width: '',
        height: '',
    });
    const [lockerName, setLockerName] = useState('');
  
    useEffect(() => {

        const lockerInfo = lockers.find(locker => locker.id === lockerId);
        if (lockerInfo) {
            console.log('INFO: ', lockerInfo)
            setFormData({
                name: lockerInfo.name,
                length: lockerInfo.length,
                width: lockerInfo.width,
                height: lockerInfo.height,
            });
            setLockerName(lockerInfo.name)
        }
    }, [lockerId, lockers]);

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleEditLocker = async () => {
      try {
        const csrfToken = getCsrfToken();
        const headers = {
          'X-CSRFToken': csrfToken,
        };
  
        const response = await axios.post(`http://127.0.0.1:8000/base/edit_locker/`, 
        {
            'locker_id': lockerId,
            'name': formData.name,
            'length': formData.length,
            'width':formData.width,
            'height':formData.height
        }, {
          headers,
          withCredentials: true,
        });
        
        console.log('Locker edited successfully:', response.data);
        window.location.reload();
        onClose();
      } catch (error) {
        console.error('Error editing locker:', error);
      }
    };
  
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>{`Edit Locker ${lockerName}`}</h2>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
          <br/>
          <label htmlFor="name">Length: </label>
          <input type="text" id="length" name="length" value={formData.length} onChange={handleChange} />
          <br/>
          <label htmlFor="name">Width: </label>
          <input type="text" id="width" name="width" value={formData.width} onChange={handleChange} />
          <br/>
          <label htmlFor="name">Height: </label>
          <input type="text" id="height" name="height" value={formData.height} onChange={handleChange} />
          <br/>
          <button onClick={handleEditLocker}>Save</button>
          <span className="button-space"></span>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    );
};

const AllLockers = () => {
    const navigate = useNavigate();
    const [lockers, setLockers] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [selectedLockerId, setSelectedLockerId] = useState(null);

    useEffect(() => {
        const fetchLockers = async () => {
          try {

            const csrfToken = getCsrfToken();
            const headers = {
                'X-CSRFToken': csrfToken,
            };

            const response = await axios.get('http://127.0.0.1:8000/base/lockers/', {
                headers,
                withCredentials: true,
            });
            console.log('Lockers data:', response.data);
            setLockers(response.data);
          } catch (error) {
            console.error('Error fetching lockers:', error);
          }
        };

        fetchLockers();
    }, []);

    const handleCreateLockerClick = () => {
        navigate('/CreateLocker');
    };

    const handleDeleteLocker =  async (name) => {
        try {
            const csrfToken = getCsrfToken();
            const headers = {
                'X-CSRFToken': csrfToken,
            };

            // Realiza la solicitud POST para eliminar el casillero
            await axios.post(`http://127.0.0.1:8000/base/delete_locker/`, { 'locker_name':name }, {
                headers,
                withCredentials: true,
            });

            // Recarga la página después de eliminar el casillero
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleEditLocker = (id) => {
        setSelectedLockerId(id);
        setShowEditPopup(true);
    };

    const handleCloseEditPopup = () => {
        setShowEditPopup(false);
        setSelectedLockerId(null);
    };

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Dimensiones</th>
                    </tr>
                </thead>
                <tbody>
                    {lockers.map((locker) => (
                        <tr key={locker.id}>
                            <td>{locker.id}</td>
                            <td>{locker.name}</td>
                            <td>{locker.state}</td>
                            <td>{`${locker.length}x${locker.width}x${locker.height}`}</td>
                            <td>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteLocker(locker.name)}
                            >
                                Eliminar
                            </button>
                            </td>
                            <td>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleEditLocker(locker.id)}
                            >
                                Editar
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <button className="btn btn-secondary" onClick={handleCreateLockerClick}>
                Create new locker
            </button>
            {showEditPopup && (
                <EditLockerPopup lockerId={selectedLockerId} lockers={lockers} onClose={handleCloseEditPopup} />
            )}
        </div>
    );
};

export default AllLockers;