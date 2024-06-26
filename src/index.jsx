import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import Provider from './api/Provider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
