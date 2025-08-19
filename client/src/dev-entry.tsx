// Development-only entry point to avoid HMR conflicts
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Disable React DevTools in development if causing issues
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot = null;
  // @ts-ignore
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberUnmount = null;
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);

// Simple render without any HMR hooks
root.render(<App />);