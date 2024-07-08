
use tauri;

pub fn app_menu() -> tauri::Menu {
  tauri::Menu::new()
      .add_submenu(tauri::Submenu::new(
          "main",
          tauri::Menu::new()
                  .add_item(tauri::CustomMenuItem::new("select","select image"))
                  .add_item(tauri::CustomMenuItem::new("config","open config"))
                  .add_item(tauri::CustomMenuItem::new("quit","quit"))
      ))
      .add_submenu(tauri::Submenu::new(
          "Help",
          tauri::Menu::new().add_item(tauri::CustomMenuItem::new("about"," about"))))
}


pub fn menu_event_handler(event: tauri::WindowMenuEvent) {
  match event.menu_item_id() {
      "select" => {
          println!("select image menu item clicked");
      }
      "config" => {
          println!("open config menu item clicked");
      }
      "quit" => {
          println!("quit menu item clicked");
      }
      "about" => {
          println!("about menu item clicked");
      }
      _ => {}
  }
}