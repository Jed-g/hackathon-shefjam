import "./App.css";
import React from "react";
import Game from "./components/Game";
import {
  CssBaseline,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";

const theme = responsiveFontSizes(
  createMuiTheme({
    typography: {
      fontFamily: [
        'Syne Tactile',
        'cursive',
      ].join(','),
    },
    palette: {
      primary: {
        main: "#00acc1",
      },
      error: {
        main: "#e53935",
      },
      type: "dark",
    },
  })
);

function App() {
  return (
    <main>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Game />
      </ThemeProvider>
    </main>
  );
}

export default App;
