import { useState } from "react";
import frenchFlag from "./assets/french-flag.svg";
import "./App.css";
import { GuessVerb } from "./components/GuessVerb";

function App() {
  return (
    <div className="App">
      <h1>
        <img src={frenchFlag} className="logo" alt="Vite logo" />
        French Verbs Game
      </h1>
      <div className="card">
        <GuessVerb />
      </div>
    </div>
  );
}

export default App;
