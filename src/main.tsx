import { createRoot } from "react-dom/client";
import { App } from "./app";

export function render() {
  const root = createRoot(document.getElementById("react-app"));

  root.render(<App />);
}

render();
