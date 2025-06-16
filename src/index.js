import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from "./Components/ErrorBoundary";
import 'typeface-roboto';
import { HelmetProvider } from 'react-helmet-async'; // Importe aqui
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>

    <ErrorBoundary>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

serviceWorker.register(); // Registra o Service Worker

