import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

import { useState } from "react";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";

import confuseDog from "/Users/koki/Library/Application Support/com.tauri.dev/image_0.gif";


type MainGifViewerType = {
  path: string;
}

const MainGifViewer: React.FC<MainGifViewerType> = ({path}) => {
  return (
    <img data-tauri-drag-region
         src={path} 
         alt="confused dog gif" 
         width="100vw" 
         height="100vh"/>
  )
}

type CommandGifPathEvent = {
  event: string;
  windowLabel: string;
  payload: {
    selected_gif_path: string;
  };
  id: number;
}

const App = () => {

  const [gifPath, setGifPath] = useState<string>(confuseDog);

  // "gif_path"経由でMessageを受けるlistenは一度だけ呼んでほしいから
  // useEffectを使う
  useEffect(() => {
    let unlisten: any;
    
    (async () => {
      unlisten = await listen("gif_path", async (event: CommandGifPathEvent) => {
        if (event?.payload?.selected_gif_path) {
          setGifPath(event.payload.selected_gif_path);
        }
      })
    }) ();

    return () => {
      if (unlisten) unlisten();
    };
  }, [])


  return (
    <div style={{position: "relative"}}>
      <div data-tauri-drag-region className="container">
        <MainGifViewer path={gifPath}/>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
