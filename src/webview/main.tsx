import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { App } from "./app";
import store from "@/webview/store";

const ReduxApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export function render() {
  const root = createRoot(document.getElementById("react-app"));

  root.render(<ReduxApp />);
}

render();
