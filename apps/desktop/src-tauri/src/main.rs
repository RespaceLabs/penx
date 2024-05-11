#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{
    sync::Mutex,
    thread,
    time::{SystemTime, UNIX_EPOCH},
};

use actix_web::{get, middleware, post, web, App, HttpResponse, HttpServer, Responder};

use serde::{Deserialize, Serialize};

use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem, Window,
};

struct TauriAppState {
    app: Mutex<AppHandle>,
}

struct AppState {
    app_name: String,
}

#[derive(Serialize)]
struct Person {
    id: String,
    name: String,
    age: u32,
}

#[derive(Deserialize)]
struct UpsertExtensionInput {
    id: String,
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("Quit".to_string(), "Quit");
    let show = CustomMenuItem::new("Show".to_string(), "Show");
    let hide = CustomMenuItem::new("Hide".to_string(), "Hide");
    let editor = CustomMenuItem::new("Editor".to_string(), "Editor");
    let preferences = CustomMenuItem::new("Preferences".to_string(), "Preferences");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
        .add_item(editor)
        .add_item(preferences)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    SystemTray::new().with_menu(tray_menu)
}

#[tauri::command]
fn on_button_clicked() -> String {
    let start = SystemTime::now();
    let since_the_epoch = start
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_millis();
    format!("on_button_clicked called from Rust! (timestamp: {since_the_epoch}ms)")
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[get("/")]
async fn hello(data: web::Data<AppState>) -> impl Responder {
    let app_name = &data.app_name; // <- get app_name
    app_name.to_string()
}

#[post("/api/upsert-extension")]
async fn upsert_extension(
    input: web::Json<UpsertExtensionInput>,
    data: web::Data<AppState>,
) -> HttpResponse {
    let app_name = &data.app_name; // <- get app_name
    let person = Person {
        id: input.id.to_string(),
        name: app_name.to_string(),
        age: 30,
    };

    HttpResponse::Ok().json(person)
}

// This struct represents state

#[actix_web::main]
pub async fn start_server(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(AppState {
                app_name: String::from("Actix Web"),
            }))
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(hello)
            .service(upsert_extension)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![on_button_clicked, greet,])
        .system_tray(create_system_tray())
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "Hide" => {
                    let window = app.get_window("main").unwrap();
                    window.hide().unwrap();
                }
                "Show" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Editor" => {
                    let window = app.get_window("editor").unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Preferences" => {
                    let window = app.get_window("main").unwrap();
                    window.emit("PreferencesClicked", Some("Yes")).unwrap();
                    window.show().unwrap();
                    window.center().unwrap();
                }
                "Quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            let handle = app.handle();
            let boxed_handle = Box::new(handle);

            thread::spawn(move || start_server(*boxed_handle).unwrap());

            // emit the `event-name` event to all webview windows on the frontend
            app.emit_all(
                "APP_INITED",
                Payload {
                    message: "Tauri is awesome!".into(),
                },
            )
            .unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
