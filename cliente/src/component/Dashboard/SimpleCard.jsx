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
    margin: margin || 0,
  };

  const numberStyle = {
    color: 'black',
    fontWeight: 'bold',
    fontSize: '1.2em',
  };

  const titleStyle = {
    color: 'lightcoral', // Cambia el color del título a rojo suave
  };

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{title}</h3>
      <p style={numberStyle}>{number}</p>
    </div>
  );
};

export default SimpleCard;
