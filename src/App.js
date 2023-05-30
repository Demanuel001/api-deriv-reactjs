import React, { useState } from 'react';
import './App.css';
import Ticks from './components/Ticks';
import Symbols from './components/Symbols';
import Contracts from './components/Contracts';

function App() {
  const [exibirTicks, setExibirTicks] = useState(false);
  const [exibirContracts, setExibirContracts] = useState(false);
  const [exibirSymbols, setExibirSymbols] = useState(false);

  const limparTela = () =>{
    setExibirTicks(false);
    setExibirContracts(false);
    setExibirSymbols(false);
  }

  const handleClickTicks = () => {
    limparTela()
    setExibirTicks(true);
  };

  const handleClickContracts = () => {
    limparTela()
    setExibirContracts(true);
  };

  const handleClickSymbols = () => {
    limparTela()
    setExibirSymbols(true);
  };

  return (
    <div className="container-main">
      <div className="sidebar">
        <h1 className='titulo-main'>Deriv.api</h1>
        <button className='button-sidebar' onClick={handleClickTicks}>Listar Ticks</button>
        <button className='button-sidebar' onClick={handleClickSymbols}>Listar Simbolos</button>
        <button className='button-sidebar' onClick={handleClickContracts}>Listar Contracts</button>
      </div>

      <div className="content">
        {exibirTicks && <Ticks />}
        {exibirSymbols && <Symbols />}
        {exibirContracts && <Contracts />}
      </div>
    </div>
  );
}

export default App;
