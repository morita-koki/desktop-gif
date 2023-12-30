// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
async fn open_config_window(handle: tauri::AppHandle) -> String {
    let _config_window = tauri::WindowBuilder::new(
        &handle,
        "config_window",
        tauri::WindowUrl::App("config.html".into())
    ).build().unwrap();
    format!("open_config_window() called!")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![ 
            open_config_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
