import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import { Buffer } from "buffer";
import { ClerkProvider } from "@clerk/clerk-react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (typeof window !== "undefined" && !window.Buffer) {
    window.Buffer = Buffer;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <Provider store={store}>
          <App />
          </Provider>
    </ClerkProvider>
  
    // </React.StrictMode>
);
