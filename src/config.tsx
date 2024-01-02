import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { readDir, BaseDirectory, writeBinaryFile, readBinaryFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";


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

const getAllGifPath = async () => {
	const entries = await readDir("", { dir: BaseDirectory.AppLocalData, recursive: false });
	return entries.filter(entry => !entry.children && entry.name && /\.gif$/.test(entry.name))
					.map(entry => convertFileSrc(entry.path));
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

type GifViewerType = {
	path: string;
}

const GifViewer: React.FC<GifViewerType> = ({path}) => {
    return (
        <img data-tauri-drag-region
             src={path} 
             alt="confused dog gif" 
             width="100vw" 
             height="100vh"/>
    )
}

type AllGifViewerType = {
	paths: string[] | undefined;
}

const AllGifViewer: React.FC<AllGifViewerType> = ({paths}) => {
	if (!paths) return (<div></div>)
	return (
		<div>
			{paths.map(path => <GifViewer path={path} />)}
		</div>
	)
}

const Config: React.FC = () => {

	const [allGifPath, setAllGifPath] = useState<string[]|undefined>();

	useEffect(() => {

		(async () => {
			const paths = await getAllGifPath();
			setAllGifPath(paths);
		}) ();

	}, [])


	return (
		<div>
			<div>This is Config Window.</div>
			<button onClick={selectImage}>add gif image</button>
			<AllGifViewer paths={allGifPath} />
		</div>
	)
}


ReactDOM.createRoot(document.getElementById("config") as HTMLElement).render(
  <React.StrictMode>
    <Config />
  </React.StrictMode>
);
