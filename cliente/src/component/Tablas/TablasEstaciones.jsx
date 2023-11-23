import React from 'react';

const TablasEstaciones = ({ data }) => {
  const handleViewStation = (station) => {
    console.log(`Redirigiendo a estación ${station.address}`);
    // Aquí puedes agregar lógica adicional, como redireccionar a una nueva página
  };

  if (!data) {
    return <p>Cargando...</p>;
  }

  if (data.length === 0) {
    return <p>No hay datos disponibles.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th style={tableHeaderStyle}>Estación</th>
          <th style={tableHeaderStyle}>Dirección</th>
          <th style={tableHeaderStyle}># Total de Casilleros</th>
          <th style={tableHeaderStyle}># Casilleros Disponibles</th>
          <th style={tableHeaderStyle}>Ver Estación</th>
        </tr>
      </thead>
      <tbody>
        {data.map((station) => (
          <tr key={station.id}>
            <td style={tableCellStyle}>{station.id}</td >
            <td style={tableCellStyle}>{station.address}</td>
            <td style={tableCellStyle}>{station.cantidadCasilleros}</td>
            <td style={tableCellStyle}>{station.cantidadCasillerosDisponibles}</td>
            <td style={tableCellStyle}>
              <button onClick={() => handleViewStation(station)}>
                Ver Estación
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const tableHeaderStyle = {
    textAlign: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };
  
  const tableCellStyle = {
    textAlign: 'center',
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };
  
export default TablasEstaciones;
