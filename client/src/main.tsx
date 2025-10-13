import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Buffer } from 'buffer';
import App from './App.tsx';
import "./index.css";

// Polyfill Buffer for browser
declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}
window.Buffer = Buffer;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
