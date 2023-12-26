// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

// import { appWindow }  from "@tauri-apps/api/window"
import confuseDog from "./assets/confuse.gif"

function App() {
  return (
    <div data-tauri-drag-region className="container">
      <img data-tauri-drag-region src={confuseDog} alt="confused dog gif" width="100vw" height="100vh"/>
    </div>
  );
}

export default App;
