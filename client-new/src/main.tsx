import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './features/app/App';
import { AppProviders } from './features/app/providers/AppProviders';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
