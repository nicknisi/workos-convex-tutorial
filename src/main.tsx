import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConvexProviderWithWorkOS } from "./ConvexProviderWithWorkOS";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthKitProvider
      clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
      redirectUri={window.location.origin + "/auth/callback"}
      devMode
    >
      <ConvexProviderWithWorkOS client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithWorkOS>
    </AuthKitProvider>
  </StrictMode>,
);
