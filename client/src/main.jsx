import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/global.css';
import './styles/admin.css';
import './components/Header.css';
import './components/Footer.css';
import './pages/Home.css';
import './pages/ChiSiamo.css';
import './pages/shared.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
