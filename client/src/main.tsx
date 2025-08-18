import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/mobile.css";
import { optimizeForDevice } from "./utils/theme-detector";

// Optimize for mobile devices and S24 Ultra
optimizeForDevice();

createRoot(document.getElementById("root")!).render(<App />);
