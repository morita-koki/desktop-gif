// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct Payload {
    selected_gif_path: String
}


#[tauri::command]
async fn open_config_window(handle: tauri::AppHandle) -> Result<String, String> {
    // Config Windowを表示
    let _config_window = tauri::WindowBuilder::new(
        &handle,
        "config_window",
        tauri::WindowUrl::App("config.html".into())
    ).build().unwrap();

    Ok("open_config_window() called successfuly.".into())
}

#[derive(Clone, serde::Deserialize, serde::Serialize)]
struct Message {
    path: String
}

#[tauri::command]
async fn gif_path_to_main_window(handle: tauri::AppHandle, message: Message) -> Result<String, String> {
    let main_window = handle.get_window("main").unwrap();
    main_window.emit("gif_path", Payload{selected_gif_path: message.path.into()}).unwrap();
    
    Ok("gif_filename_to_main() finished successfully.".into())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ 
            open_config_window,
            gif_path_to_main_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
