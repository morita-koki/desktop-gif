import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const About: React.FC = () => {

	return (
		<div>
			<div>This is About Window.</div>
		</div>
	)
}


ReactDOM.createRoot(document.getElementById("about") as HTMLElement).render(
  <React.StrictMode>
    <About />
  </React.StrictMode>
);
