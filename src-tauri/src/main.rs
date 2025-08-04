// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use sqlx::{
    sqlite::{Sqlite, SqlitePoolOptions},
    migrate::MigrateDatabase,
    Pool, FromRow,
};
use tauri::{App, Manager};
use futures::TryStreamExt;

type Db = Pool<Sqlite>;

struct AppState {
    db: Db,
}

// ------------------------ Project Logic ------------------------

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct Project {
    id: i64,
    project_name: String,
    nodes_json: Option<String>,
    edges_json: Option<String>,
}

#[tauri::command]
async fn add_project(
    state: tauri::State<'_, AppState>,
    project_name: String,
    nodes_json: Option<String>,
    edges_json: Option<String>
) -> Result<Project, String> {
    let result = sqlx::query_as::<_, Project>(
        "INSERT INTO projects (project_name, nodes_json, edges_json)
         VALUES (?1, ?2, ?3)
         RETURNING *"
    )
    .bind(project_name)
    .bind(nodes_json)
    .bind(edges_json)
    .fetch_one(&state.db)
    .await
    .map_err(|e| format!("Error inserting project: {}", e))?;

    Ok(result)
}

#[tauri::command]
async fn get_all_projects(state: tauri::State<'_, AppState>) -> Result<Vec<Project>, String> {
    sqlx::query_as::<_, Project>("SELECT * FROM projects")
        .fetch(&state.db)
        .try_collect()
        .await
        .map_err(|e| format!("Failed to get projects: {}", e))
}

#[tauri::command]
async fn get_project_by_id(state: tauri::State<'_, AppState>, id: i64) -> Result<Project, String> {
    sqlx::query_as::<_, Project>("SELECT * FROM projects WHERE id = ?1")
        .bind(id)
        .fetch_one(&state.db)
        .await
        .map_err(|e| format!("Project not found: {}", e))
}

#[tauri::command]
async fn update_project(
    state: tauri::State<'_, AppState>,
    project: Project
) -> Result<Project, String> {
    sqlx::query_as::<_, Project>(
        "UPDATE projects
         SET project_name = ?1, nodes_json = ?2, edges_json = ?3
         WHERE id = ?4
         RETURNING *"
    )
    .bind(&project.project_name)
    .bind(&project.nodes_json)
    .bind(&project.edges_json)
    .bind(project.id)
    .fetch_one(&state.db)
    .await
    .map_err(|e| format!("Failed to update project: {}", e))
}

#[tauri::command]
async fn delete_project(state: tauri::State<'_, AppState>, id: i64) -> Result<(), String> {
    sqlx::query("DELETE FROM projects WHERE id = ?1")
        .bind(id)
        .execute(&state.db)
        .await
        .map_err(|e| format!("Failed to delete project: {}", e))?;
    Ok(())
}

// ------------------------ Setup ------------------------

async fn setup_db(app: &App) -> Db {
    let mut path = app.path().app_data_dir().expect("failed to get data_dir");

    std::fs::create_dir_all(&path).expect("failed to create app data dir");
    path.push("db.sqlite");

    if !path.exists() {
        Sqlite::create_database(path.to_str().unwrap())
            .await
            .expect("failed to create database");
    }

    let db = SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await
        .expect("failed to connect to db");

    sqlx::migrate!("./migrations")
        .run(&db)
        .await
        .expect("failed to run migrations");

    db
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            add_project,
            get_all_projects,
            get_project_by_id,
            update_project,
            delete_project
        ])
        .setup(|app| {
            tauri::async_runtime::block_on(async move {
                let db = setup_db(app).await;
                app.manage(AppState { db });
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
