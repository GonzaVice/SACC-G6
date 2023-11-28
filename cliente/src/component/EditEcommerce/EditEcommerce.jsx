import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditEcommerce = () => {
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [key, setKey] = useState('');
  const navigate = useNavigate();

  const handleEditEcommerce = async () => {
    try {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        .split('=')[1];

      const headers = {
        'X-CSRFToken': csrfToken,
        'Content-Type': 'application/json',
      };

      const data = {
        name: name,
        new_name: newName,
        key: key,
      };

      const response = await axios.post('http://127.0.0.1:8000/base/edit_ecommerce/', data, {
        headers,
        withCredentials: true,
      });

      alert('Ecommerce edited successfully with name: ' + name + ' and key: ' + key);
      // Reset input fields after successful edit
      setName('');
      setNewName('');
      setKey('');
    } catch (error) {
      console.error('Error editing ecommerce:', error);
      // Handle errors appropriately
    }
  };

  const handleGoBack = () => {
    // Redirect back to previous page
    navigate('/GetAllEcommerce');
  };

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Current Name" />
      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Enter New Name" />
      <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter New Key" />
      <button onClick={handleEditEcommerce}>Edit Ecommerce</button>
      <button onClick={handleGoBack}>Go back</button>
    </div>
  );
};

export default EditEcommerce;
