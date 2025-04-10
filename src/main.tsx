
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log("🚀 Application initializing...");
console.log("🌐 Environment:", import.meta.env.MODE);

// Add global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('🔴 Uncaught error:', event.error);
});

const rootElement = document.getElementById("root");
console.log("🔍 Root element found:", !!rootElement);

if (!rootElement) {
  console.error("❌ Critical Error: Failed to find the root element");
  document.body.innerHTML = '<div style="color: red; padding: 20px;">Failed to initialize application: Root element not found</div>';
  throw new Error("Failed to find the root element");
}

try {
  console.log("🛠️ Creating React root and rendering application...");
  const root = createRoot(rootElement);
  
  root.render(<App />);
  
  console.log("✅ Initial render complete");
} catch (error) {
  console.error("❌ Fatal rendering error:", error);
  
  // Provide visible error message
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="color: red; padding: 20px; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        <p>Please check the console for more details.</p>
      </div>
    `;
  }
}
