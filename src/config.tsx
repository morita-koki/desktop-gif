import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { readDir, BaseDirectory, writeBinaryFile, readBinaryFile } from "@tauri-apps/api/fs";


const getNewFilename = async () => {
    // AppLocalDataDir内の画像数をカウントしてその数をsuffixをつけてファイル名を返す
    const entries = await readDir("", { dir: BaseDirectory.AppLocalData, recursive: false });
    let count = 0;
    for (const entry of entries) {
        if (entry.children) continue;
        else count += 1;
    }
    return `image_${count.toString()}.gif`;
}

const selectImage = async () => {
    const selected = await open({ // openが返すのは選択されたfilepath
        multiple: false,
        filters: [{
            name: "Image",
            extensions: ["gif"] // now allowed only "gif"
        }]
    });

    if (Array.isArray(selected)) return;
    if (selected == null) return;

    // 選択されたがgifをAppLocalDataDirにコピー
    const binary_image = await readBinaryFile(selected);
    const file_name = await getNewFilename();
    await writeBinaryFile(file_name, binary_image, { dir: BaseDirectory.AppLocalData }); 

    // 保存したpathを新しく表示するgifとしてmain windowに送る
    const new_selected_path = await appLocalDataDir() + file_name;
    await invoke("gif_path_to_main_window", { message: { path: new_selected_path }})
            .then(msg => {console.log(msg)});
}

const Config: React.FC = () => {
    return (
        <div>
            <div>This is Config Window.</div>
            <button onClick={selectImage}>add gif image</button>
        </div>
    )
}


ReactDOM.createRoot(document.getElementById("config") as HTMLElement).render(
  <React.StrictMode>
    <Config />
  </React.StrictMode>
);
