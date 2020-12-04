import React from "react";
import "./App.css";
import HomePage from "./screens/HomePage";
import env from "./env.js";
console.log(env);

function App() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}

export default App;
