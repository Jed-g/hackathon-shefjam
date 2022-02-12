import "./App.css";
import React from "react";
import Game from "./components/Game";

function App() {
  return (
    <main
      style={{
        height: window.innerHeight * 2,
        width: window.innerWidth * 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Game />
    </main>
  );
}

export default App;
