import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

import Config from "./config";

// import { appWindow }  from "@tauri-apps/api/window"
import confuseDog from "./assets/confuse.gif";
import settingIcon from "./assets/setting_icon.svg";

// const click_handler = () => {
//   // invoke("open_config_window").then(msg => console.log(msg));
//   console.log("click_handler() called");
// }

const GifViewer = ({path}: {path: string}) => {
  return (
    <img data-tauri-drag-region
         src={path} 
         alt="confused dog gif" 
         width="100vw" 
         height="100vh"/>
  )
}

const SettingButton = ({setConfig}: {setConfig: (func: (prev: boolean) => boolean) => void}) => {
  return(
    <div style={{position: "absolute", top: "3px", right: "3px"}}>
      <img onClick={() => setConfig(prev => !prev)} src={settingIcon} alt="setting icon" height="20vh"/>
    </div>
  )
}


const App = () => {

  const [config, setConfig] = useState<boolean>(false);
  const [gifPath, setGifPath] = useState<string>(confuseDog);
  // const [isLocked, setIsLocked] = useState<boolean>(true);
  
  return (
    <div style={{position: "relative"}}>
      <SettingButton setConfig={setConfig} />
      {config 
        ? <Config />
        : <div data-tauri-drag-region className="container">
            <GifViewer path={gifPath}/>
          </div> 
      }
    </div>
  );
}

export default App;
