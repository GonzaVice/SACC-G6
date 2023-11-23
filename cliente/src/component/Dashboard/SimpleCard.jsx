import React from 'react';

const SimpleCard = ({ title, number, margin }) => {
  const cardStyle = {
    width: '150px',
    height: '150px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: margin || 0, // Agrega esta línea para el margen
  };

  const numberStyle = {
    color: 'black',
    fontWeight: 'bold',
    fontSize: '1.2em',
  };

  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <p style={numberStyle}>{number}</p>
    </div>
  );
};

export default SimpleCard;
