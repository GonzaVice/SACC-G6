import React from 'react';

const BotonDescarga = () => {
  const manejarClick = () => {
    console.log('Descargando');
    console.log("Solicitando clave")
    console.log("Clave correcta")
    console.log("Abriendo casillero...")
    console.log("Paquete retirado")
    console.log("Cerrando casillero...")
    console.log("Listo")
    console.log("\n")
  };

  return (
    <button onClick={manejarClick}>
      Descargar
    </button>
  );
};

export default BotonDescarga;
