import React from 'react';

const BotonCarga = () => {
  const manejarClick = () => {
    console.log('Cargando');
    console.log("Esperando a que el operador cargue.")
    console.log("Casillerro cargado")
    console.log("Enviando mail a operador y cliente con las claves")
    console.log("Listo")
    console.log("\n")
  };

  return (
    <button onClick={manejarClick}>
      Cargar
    </button>
  );
};

export default BotonCarga;
