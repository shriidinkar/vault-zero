import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Gracefully handle any benign container websocket connection errors
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      (typeof event.reason.message === 'string' &&
        (event.reason.message.includes('WebSocket') ||
          event.reason.message.includes('ws://') ||
          event.reason.message.includes('wss://')))
    ) {
      event.preventDefault();
    }
  });

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    if (
      args[0] &&
      typeof args[0] === 'string' &&
      (args[0].includes('failed to connect to websocket') ||
        args[0].includes('[vite] failed to connect to websocket'))
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
