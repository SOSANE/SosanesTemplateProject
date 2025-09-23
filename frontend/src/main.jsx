import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LocalizationProvider } from "./state/contexts/LocalizationProvider.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <LocalizationProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </LocalizationProvider>
);
