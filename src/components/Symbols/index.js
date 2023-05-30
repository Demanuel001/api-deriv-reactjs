import React, { useEffect, useState } from 'react';
import DerivAPIBasic from 'https://cdn.skypack.dev/@deriv/deriv-api/dist/DerivAPIBasic';
import './style.css';

const Symbols = () => {
  const app_id = 1089; // Replace with your app_id or leave the current one for testing.
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  const active_symbols_request = {
    active_symbols: 'brief',
    product_type: 'basic',
  };

  const [activeSymbols, setActiveSymbols] = useState([]);

  const activeSymbolsResponse = async (res) => {
    const data = JSON.parse(res.data);

    if (data.error !== undefined) {
      console.log('Error: ', data.error?.message);
      connection.removeEventListener('message', activeSymbolsResponse, false);
      await api.disconnect();
    }

    if (data.msg_type === 'active_symbols') {
      setActiveSymbols(data.active_symbols);
    }

    connection.removeEventListener('message', activeSymbolsResponse, false);
  };

  const getActiveSymbols = async () => {
    connection.addEventListener('message', activeSymbolsResponse);
    await api.activeSymbols(active_symbols_request);
  };

  useEffect(() => {
    const symbolsButton = document.querySelector('#symbols');

    symbolsButton.addEventListener('click', getActiveSymbols);

    return () => {
      connection.removeEventListener('message', activeSymbolsResponse, false);
    };
  }, []);

  return (
    <div className='container-symbols'>
      <h1 className='titulo-symbols'>Lista de Símbolos</h1>
      <h3 className='subtitulo-symbols'>Lista de todos os símbolos atualmente ativos</h3>
      <button className='button-symbols' id='symbols' onClick={getActiveSymbols}>Listar Símbolos</button>

      <ul>
        {activeSymbols.map((symbol) => (
          <li key={symbol.symbol}>
            Symbol: {symbol.symbol} - Ask: {symbol.ask} - Bid: {symbol.bid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Symbols;
