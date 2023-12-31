import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

// import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
// import { appLocalDataDir, appDataDir } from "@tauri-apps/api/path";
import { readDir, BaseDirectory, writeBinaryFile, readBinaryFile } from "@tauri-apps/api/fs";

const getNewFilename = async () => {
    const entries = await readDir("", { dir: BaseDirectory.AppLocalData, recursive: false });
    let count = 0;
    for (const entry of entries) {
        if (entry.children) continue;
        else count += 1;
    }
    return "image_" + count.toString() + ".gif";
}

const selectImage = async () => {
    console.log("selectImage() called");
    const selected = await open({
        multiple: false,
        filters: [{
            name: "Image",
            extensions: ["gif", "png", "jpg", "jpeg"]
        }]
    });
    console.log("file is selected: ",selected);

    console.log("file: ", selected, " is saving.");
    if (Array.isArray(selected)) return;
    if (selected == null) return;

    const binary_image = await readBinaryFile(selected);
    const file_name = await getNewFilename();
    await writeBinaryFile(file_name, binary_image, { dir: BaseDirectory.AppLocalData }); 
    console.log(`file<<${selected}>> is saved as <<${file_name}>>`);
}

const Config = () => {
    return (
        <div>
            <div>This is Config Window.</div>
            <button onClick={selectImage}>add gif image</button>
        </div>
    )
}

export default Config;

// ReactDOM.createRoot(document.getElementById("config") as HTMLElement).render(
//   <React.StrictMode>
//     <Config />
//   </React.StrictMode>,
// );
