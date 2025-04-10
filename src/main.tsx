
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("main.tsx is executing");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  console.error("Failed to find the root element");
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);
console.log("Root created, rendering app");

root.render(<App />);
console.log("App rendered");
