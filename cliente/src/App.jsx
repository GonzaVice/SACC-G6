import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BotonReserva from './component/Buttons/reserva';
import BotonCarga from './component/Buttons/carga';
import BotonDescarga from './component/Buttons/descarga';


function App() {

  return (
  <div>
    <h1>¡Bienvenido a mi aplicación!</h1>
    <BotonReserva />
    <BotonCarga />
    <BotonDescarga />
  </div>
  )
}

export default App
