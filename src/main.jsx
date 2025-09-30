import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// 1. import `ChakraProvider` component
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { store } from "./store";

import "./index.css";
import App from "./App.jsx";

// ✅ Define theme before usage
const theme = extendTheme({
  styles: {},
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
