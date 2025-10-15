import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import store from "./app/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store = {store}>
      <BrowserRouter>
        <App />   {/* ✅ Now App (and Navbar) has Router context */}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
