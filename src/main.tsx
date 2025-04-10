
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("🔄 main.tsx is executing");

const rootElement = document.getElementById("root");
console.log("🔍 Root element:", rootElement);

if (!rootElement) {
  console.error("❌ Failed to find the root element");
  throw new Error("Failed to find the root element");
}

try {
  console.log("🛠️ Creating React root");
  const root = createRoot(rootElement);
  
  console.log("🚀 Rendering App component");
  root.render(<App />);
  
  console.log("✅ App rendered successfully");
} catch (error) {
  console.error("❌ Error rendering the application:", error);
}
