import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './assets/styles/global.css';

import {App} from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
