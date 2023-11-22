import React from 'react';

const TablaDatosCasilleros = ({ data }) => {
    console.log("DATAAA", data)

    const renderReservado = (reservado) => (reservado ? 'Sí' : 'No');
    const renderOcupado = (ocupado) => (ocupado ? 'Sí' : 'No');
    const renderEstadoConexion = (estadoConexion) =>
        estadoConexion ? 'Conectado' : 'Sin conexión';

    const renderTiempoReservaCarga = (horaReserva, horaCargado) => {
        console.log('horaReserva:', horaReserva);
        console.log('horaCargado:', horaCargado);
    
        if (horaReserva === '' || horaCargado === '') {
            return 'N/A';
        }
        const inicio = horaReserva.split(':');
        const fin = horaCargado.split(':');
        return (fin[0] - inicio[0]) * 60 + (fin[1] - inicio[1]);
    };
        

    const renderTiempoCargaDescarga = (horaOcupado, horaDesocupado) => {
    if (horaOcupado === 0 || horaDesocupado === 0) {
        return 'N/A';
    }
    return horaDesocupado - horaOcupado;
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
            <th style={tableHeaderStyle}>ID Casillero</th>
            <th style={tableHeaderStyle}>Reservas</th>
            <th style={tableHeaderStyle}>Ocupado</th>
            <th style={tableHeaderStyle}>Estado Conexión</th>
            <th style={tableHeaderStyle}>Dimensiones (cm)</th>
            <th style={tableHeaderStyle}>Tiempo Reserva-Carga (mins)</th>
            <th style={tableHeaderStyle}>Tiempo Carga-Descarga</th>
            <th style={tableHeaderStyle}>Hora</th>
            </tr>
        </thead>
        <tbody>
            {data.map((casillero) => (
            <tr key={casillero.id}>
                <td style={tableCellStyle}>{casillero.id}</td>
                <td style={tableCellStyle}>{renderReservado(casillero.reservado)}</td>
                <td style={tableCellStyle}>{renderOcupado(casillero.ocupado)}</td>
                <td style={tableCellStyle}>{renderEstadoConexion(casillero.estadoConexion)}</td>
                <td style={tableCellStyle}>{casillero.dimensiones}</td>
                <td style={tableCellStyle}>{renderTiempoReservaCarga(casillero.historial[casillero.historial.length - 1].horaReserva, casillero.historial[casillero.historial.length - 1].horaCargado)}</td>
                <td style={tableCellStyle}>{casillero.historial[0].horaReserva}</td>
                <td style={tableCellStyle}>{renderTiempoReservaCarga(casillero.historial[casillero.historial.length - 1].horaCargado, casillero.historial[casillero.historial.length - 1].horaDescargado)}</td>

            </tr>))}
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

export default TablaDatosCasilleros;
