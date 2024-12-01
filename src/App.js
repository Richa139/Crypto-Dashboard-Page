import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CryptoChart from "./CryptoChart";

const theme = createTheme({
  palette: { mode: "dark" },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <div style={{ padding: "20px" }}>
      <CryptoChart />
    </div>
  </ThemeProvider>
);

export default App;
