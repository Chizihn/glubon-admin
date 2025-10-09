import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- import BrowserRouter
import "./index.css";
import App from "./App.tsx";
import { ApolloProviderWrapper } from "./components/ApolloProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProviderWrapper>
        <App />
      </ApolloProviderWrapper>
    </BrowserRouter>
  </StrictMode>
);
