
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Listen for service worker messages to force reload
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'FORCE_RELOAD') {
      console.log('Service Worker: Force reload requested');
      window.location.reload();
    }
  });
}

// Simple initialization with error boundary
try {
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Failed to initialize React app:', error);
}
