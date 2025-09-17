
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
