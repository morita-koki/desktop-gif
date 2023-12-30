import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

function Config() {
    return (
        <div>This is Config Window.</div>
    )
}



ReactDOM.createRoot(document.getElementById("config") as HTMLElement).render(
  <React.StrictMode>
    <Config />
  </React.StrictMode>,
);
