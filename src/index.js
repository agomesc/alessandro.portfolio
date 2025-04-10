import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from "./Components/ErrorBoundary";
import 'typeface-roboto';

const root = ReactDOM.createRoot(document.getElementById('root'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registrado:', registration);
    }).catch((error) => {
      console.error('Erro ao registrar SW:', error);
    });
}

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
