import React, { useEffect, useState } from 'react';
import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic';

const App = () => {
  const app_id = 1089; // ID TESTE
  const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
  const api = new DerivAPIBasic({ connection });

  const contracts_for_symbol_request = {
    proposal: 1,
    subscribe: 1,
    amount: 1,
    basis: 'stake',
    contract_type: 'CALL',
    currency: 'USD',
    duration: 1,
    duration_unit: 'm',
    symbol: 'R_100',
    barrier: '+0.1',
  };

  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const contractsForSymbolResponse = async (res) => {
      const data = JSON.parse(res.data);

      if (data.error !== undefined) {
        console.log('Error: ', data.error?.message);
        connection.removeEventListener('message', contractsForSymbolResponse, false);
        await api.disconnect();
      }

      if (data.msg_type === 'contracts_for') {
        setContracts(data.contracts_for);
      }

      connection.removeEventListener('message', contractsForSymbolResponse, false);
    };

    const getContractsForSymbol = async () => {
      connection.addEventListener('message', contractsForSymbolResponse);
      await api.contractsFor(contracts_for_symbol_request);
    };

    const symbol_button = document.querySelector('#contractsForSymbol');
    symbol_button.addEventListener('click', getContractsForSymbol);

    return () => {
      symbol_button.removeEventListener('click', getContractsForSymbol);
    };
  }, []);

  return (
    <div>
      <button id="contractsForSymbol">Listar Contratos</button>
      <ul>
      {Array.isArray(contracts) && contracts.map((contract, index) => (
        <li key={index}>{JSON.stringify(contract)}</li>
      ))}
      </ul>
    </div>
  );
};

export default App;
