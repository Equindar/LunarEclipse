import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './viteApp.js';
import './assets/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
