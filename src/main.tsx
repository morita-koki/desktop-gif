import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

import { useState } from "react";
import { useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from "@tauri-apps/api/event";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { resolve } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import confuseDog from "/Users/koki/Library/Application Support/com.tauri.dev/image_0.gif";
import settingIcon from "./assets/setting_icon.svg";


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

type SettingButtonType = {
  openConfig: () => {};
}

const SettingButton: React.FC<SettingButtonType> = ({openConfig}) => {
  return(
    <div style={{position: "absolute", top: "3px", right: "3px"}}>
      <img onClick={openConfig} src={settingIcon} alt="setting icon" height="20vh"/>
    </div>
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

  const openConfig = async () => {
    await invoke("open_config_window");
  };

  // "gif_path"経由でMessageを受けるlistenは一度だけ呼んでほしいから
  // useEffectを使う
  useEffect(() => {
    let unlisten: any;
    
    (async () => {
      const app_local_data_dir = await appLocalDataDir();
      unlisten = await listen("gif_path", async (event: CommandGifPathEvent) => {
        if (event?.payload?.selected_gif_path) {
          const gif_path = await resolve(app_local_data_dir, event.payload.selected_gif_path)
          setGifPath(convertFileSrc(gif_path));
        }
      })
    }) ();

    return () => {
      if (unlisten) unlisten();
    };
  }, [])


  return (
    <div style={{position: "relative"}}>
      <SettingButton openConfig={openConfig} />
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
