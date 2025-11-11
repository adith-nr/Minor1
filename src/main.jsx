import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import store from "./store";
import { Provider } from "react-redux";
import { Buffer } from "buffer";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { PrivyProvider } from "@privy-io/react-auth";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID;

if (typeof window !== "undefined" && !window.Buffer) {
  window.Buffer = Buffer;
}

/* -----------------------------------------
   Privy–Clerk bridge wrapper
------------------------------------------ */
function PrivyBridge({ children }) {
  const { getToken, userId } = useAuth();

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        embeddedWallets: {
          createOnLogin: "users-without-wallets", // auto-create wallets
        },
        appearance: {
          theme: "dark",
          accentColor: "#5C6CFF",
        },
        loginMethods: ["email", "wallet"],

        // Bridge Clerk session → Privy external auth
        externalAuth: async () => {
          const token = await getToken({ template: "privy" });
          return token ? { jwt: token, userId } : null;
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

/* -----------------------------------------
   React root render
------------------------------------------ */
ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    navigate={(to) => window.history.pushState(null, "", to)} // ✅ required for React Router
    afterSignOutUrl="/"
  >
    <Provider store={store}>
      <PrivyBridge>
        <App />
      </PrivyBridge>
    </Provider>
  </ClerkProvider>
);
