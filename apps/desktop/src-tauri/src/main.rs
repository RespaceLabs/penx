#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::time::{SystemTime, UNIX_EPOCH};

use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};

use serde::{Deserialize, Serialize};

use tauri::{
    CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

fn create_system_tray() -> SystemTray {
    let quit = CustomMenuItem::new("Quit".to_string(), "Quit");
    let show = CustomMenuItem::new("Show".to_string(), "Show");
    let hide = CustomMenuItem::new("Hide".to_string(), "Hide");
    let preferences = CustomMenuItem::new("Preferences".to_string(), "Preferences");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(hide)
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
async fn hello() -> impl Responder {
    "Hello, World!"
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

#[post("/api/upsert-extension")]
async fn upsert_extension(input: web::Json<UpsertExtensionInput>) -> HttpResponse {
    let person = Person {
        id: input.id.to_string(),
        name: "John".to_string(),
        age: 30,
    };
    HttpResponse::Ok().json(person)
}

#[tauri::command]
async fn start_server() {
    HttpServer::new(|| App::new().service(hello).service(upsert_extension))
        .bind("127.0.0.1:8080")
        .unwrap()
        .run()
        .await
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            on_button_clicked,
            greet,
            start_server
        ])
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
