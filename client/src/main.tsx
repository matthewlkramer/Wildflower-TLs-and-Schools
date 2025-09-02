import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initAgGridEnterprise } from "./lib/ag-grid-enterprise";

// Ensure AG Grid Enterprise modules are registered before React renders
(async () => {
  await initAgGridEnterprise();
  createRoot(document.getElementById("root")!).render(<App />);
})();
