import React from 'react';
import ReactDOM from 'react-dom/client'; // importe da nova API de React 18
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Crie um root com createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o app com a nova API
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);

// Report web vitals (opcional)
reportWebVitals();
