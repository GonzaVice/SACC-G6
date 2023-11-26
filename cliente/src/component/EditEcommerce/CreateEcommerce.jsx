import React, { useState } from 'react';
import axios from 'axios';

const CreateEcommerce = () => {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');

  const handleCreateEcommerce = async () => {
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
        key: key,
      };

      const response = await axios.post('http://127.0.0.1:8000/base/create_ecommerce/', data, {
        headers,
        withCredentials: true,
      });

      console.log(response.data); // Assuming the response contains a message
      // Add further handling as needed after ecommerce creation

    } catch (error) {
      console.error('Error creating ecommerce:', error);
      // Handle errors appropriately
    }
  };

  return (
    <div>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter Name" />
      <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter Key" />
      <button onClick={handleCreateEcommerce}>Create Ecommerce</button>
    </div>
  );
};

export default CreateEcommerce;
