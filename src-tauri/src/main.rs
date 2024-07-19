#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tauri::Manager;
mod menu;

#[derive(Clone, serde::Serialize)]
struct Payload {
    selected_gif_path: String
}


#[derive(Clone, serde::Deserialize, serde::Serialize)]
struct Message {
    path: String
}

#[tauri::command]
async fn gif_path_to_main_window(handle: tauri::AppHandle, message: Message) -> Result<String, String> {
    // (config windowから受け取った)gif pathをmain windowに送る
    let main_window = handle.get_window("main").unwrap();
    main_window.emit("gif_path", Payload{selected_gif_path: message.path.into()}).unwrap();

    Ok("gif_filename_to_main() finished successfully.".into())
}

fn main() {
    tauri::Builder::default()
        .menu(menu::app_menu())
        .on_menu_event(menu::menu_event_handler)
        .invoke_handler(tauri::generate_handler![ 
            gif_path_to_main_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
