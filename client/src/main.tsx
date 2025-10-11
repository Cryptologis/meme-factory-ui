import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletContextProvider } from "./contexts/WalletContextProvider";

createRoot(document.getElementById("root")!).render(
  <WalletContextProvider>
    <App />
  </WalletContextProvider>
);
