use tauri::{self, Manager};

/**
 * * this function sets up the menu for the app.
 * @return
 * 		tauri::Menu
 */
pub fn app_menu() -> tauri::Menu {
  tauri::Menu::new()
      .add_submenu(tauri::Submenu::new(
          "main",
          tauri::Menu::new()
                  .add_item(tauri::CustomMenuItem::new("select","image"))
                  .add_item(tauri::CustomMenuItem::new("config","config"))
									.add_item(tauri::CustomMenuItem::new("about", "about"))
                  .add_item(tauri::CustomMenuItem::new("quit","quit"))
      ))
      .add_submenu(tauri::Submenu::new(
          "Help",
          tauri::Menu::new().add_item(tauri::CustomMenuItem::new("about"," about"))))
}


pub fn menu_event_handler(event: tauri::WindowMenuEvent) -> () {
  match event.menu_item_id() {
		"select" => {
			select(event.window().app_handle()).unwrap();
		}
		"config" => {
			config(event.window().app_handle()).unwrap();
		}
		"about" => {
			about(event.window().app_handle()).unwrap();
		}
		"quit" => {
				std::process::exit(0);
		}
		_ => {}
  }
}


/** 
 * * these are menu handlers. 
 * * they are called when the menu item is clicked.
 * * they create a new window if it doesn't exist.
 * @param 
 * 		handle: tauri::AppHandle
 * @return
 * 		Result<String, String>
 * 			- Ok("message".into())
 * 			- Err("message".into())
 */
#[tauri::command]
fn config(handle: tauri::AppHandle) -> Result<String, String> {
	let config_window = handle.get_window("config_window");
	match config_window {
		Some(_) => {
			Ok("config window already exists.".into())
		}
		None => {
			let _config_window = tauri::WindowBuilder::new(
				&handle,
				"config_window",
				tauri::WindowUrl::App("window/config.html".into())
			).build().unwrap().set_title("Config");
		
			Ok("config() called successfuly.".into())
		}		
	}
}

#[tauri::command]
fn select(handle: tauri::AppHandle) -> Result<String, String> {
	let select_window = handle.get_window("select_window");
	match select_window {
		Some(_) => {
			Ok("select window already exists.".into())
		}
		None => {
			let _select_window = tauri::WindowBuilder::new(
				&handle,
				"select_window",
				tauri::WindowUrl::App("window/select.html".into())
			).build().unwrap().set_title("Select");
		
			Ok("select() called successfuly.".into())
		}		
	}
}

#[tauri::command]
fn about(handle: tauri::AppHandle) -> Result<String, String> {
	let about_window = handle.get_window("about_window");
	match about_window {
		Some(_) => {
			Ok("about window already exists.".into())
		}
		None => {
			let _about_window = tauri::WindowBuilder::new(
				&handle,
				"about_window",
				tauri::WindowUrl::App("window/about.html".into())
			).build().unwrap().set_title("About");
		
			Ok("about() called successfuly.".into())
		}
	}
}

// End of menu.rs
