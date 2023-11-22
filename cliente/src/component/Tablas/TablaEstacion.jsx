import {React, useState} from 'react';

const TablaEstacion = ({ data, conexion }) => {

  const handleViewReserva = (station) => {
    console.log(`Redirigiendo a Reserva ${station.address}`);
  };

  const handleViewCasillero = (casillero) => {
    console.log(`Redirigiendo a Historial ${casillero.id}`);
  };

  const renderReservado = (reservado) => (reservado ? 'Sí' : 'No');
  const renderOcupado = (ocupado) => (ocupado ? 'Sí' : 'No');
  const renderEstadoConexion = (estadoConexion) =>
    estadoConexion ? 'Conectado' : 'Sin conexión';

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
          <th style={tableHeaderStyle}>Casillero</th>
          <th style={tableHeaderStyle}>Dimensiones (cm)</th>
          <th style={tableHeaderStyle}>Reservado</th>
          <th style={tableHeaderStyle}>ID Reserva</th>
          <th style={tableHeaderStyle}>Hora Reserva</th>
          <th style={tableHeaderStyle}>Ocupado</th>
          <th style={tableHeaderStyle}>Hora Ocupado</th>
          <th style={tableHeaderStyle}>Estado Conexión</th>
          <th style={tableHeaderStyle}>Porcentaje de Uso</th>
          <th style={tableHeaderStyle}>Ver Reserva</th>
          <th style={tableHeaderStyle}>Historial Casillero</th>
        </tr>
      </thead>
      <tbody>
      {data.map((casillero) => (
        <tr key={casillero.id}>
            <td style={tableCellStyle}>{casillero.id}</td>
            <td style={tableCellStyle}>{casillero.dimensiones}</td>
            <td style={tableCellStyle}>{renderReservado(casillero.reservado)}</td>
            <td style={tableCellStyle}>
                {casillero.reservado ? (
                    <div key={casillero.historial[casillero.historial.length - 1].idReserva}>
                    {casillero.historial[casillero.historial.length - 1].idReserva}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>
                {casillero.reservado ? (
                    <div key={casillero.historial[casillero.historial.length - 1].horaReserva}>
                    {casillero.historial[casillero.historial.length - 1].horaReserva}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>{renderOcupado(casillero.ocupado)}</td>
            <td style={tableCellStyle}>
                {casillero.reservado ? (
                    <div key={casillero.historial[casillero.historial.length - 1].horaCargado}>
                    {casillero.historial[casillero.historial.length - 1].horaCargado}
                    </div>
                ) : (
                    'N/A'
                )}
            </td>
            <td style={tableCellStyle}>
            {renderEstadoConexion(conexion)}
            </td>
            <td style={tableCellStyle}>{casillero.porcentajeUso}</td>
            <td style={tableCellStyle}>
            <button onClick={() => handleViewReserva(casillero.idReserva)}>
                Ver Reserva
            </button>
            </td>
            <td style={tableCellStyle}>
            <button onClick={() => handleViewCasillero(casillero)}>
                Ver Historial
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

export default TablaEstacion;
