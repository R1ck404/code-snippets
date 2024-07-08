#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::{collections::HashMap, fs, sync::Mutex};
use tauri::{State, AppHandle};
use tauri::Manager;
use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use uuid::Uuid;
use dirs;

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Group {
    name: String,
    members: Vec<String>,
    color: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Collection {
    name: String,
    groups: Vec<Group>,
    snippets: Vec<CodeSnippet>,
    color: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct CodeSnippet {
    name: String,
    description: String,
    files: Vec<String>,
    updated_by: String,
    updated_at: String,
}

#[derive(Default)]
struct AppState {
    groups: Mutex<HashMap<String, Group>>,
    collections: Mutex<HashMap<String, Collection>>,
}

#[tauri::command]
fn create_group(name: &str, members: Vec<String>, color: &str, state: State<'_, AppState>) -> String {
    let mut groups = state.groups.lock().unwrap();
    
    if groups.contains_key(name) {
        return format!("Error: A group with the name '{}' already exists.", name);
    }
    
    let group = Group {
        name: name.to_string(),
        members,
        color: color.to_string(),
    };
    
    groups.insert(name.to_string(), group.clone());
    save_groups(&groups, &app_data_dir());
    
    format!("Group created: {}", name)
}

#[tauri::command]
fn get_groups(state: State<'_, AppState>) -> Vec<Group> {
    let groups = state.groups.lock().unwrap();
    groups.values().cloned().collect()
}

#[tauri::command]
fn get_group(name: &str, state: State<'_, AppState>) -> Option<Group> {
    let groups = state.groups.lock().unwrap();
    groups.get(name).cloned()
}


#[tauri::command]
fn delete_group(name: &str, state: State<'_, AppState>) -> String {
    let mut groups = state.groups.lock().unwrap();
    
    if !groups.contains_key(name) {
        return format!("Error: Group '{}' not found.", name);
    }
    
    groups.remove(name);
    save_groups(&groups, &app_data_dir());
    
    format!("Group deleted: {}", name)
}

#[tauri::command]
fn rename_group(name: &str, new_name: &str, state: State<'_, AppState>) -> String {
    let mut groups = state.groups.lock().unwrap();
    
    if !groups.contains_key(name) {
        return format!("Error: Group '{}' not found.", name);
    }
    
    if groups.contains_key(new_name) {
        return format!("Error: A group with the name '{}' already exists.", new_name);
    }
    
    if let Some(mut group) = groups.remove(name) {
        group.name = new_name.to_string();
        groups.insert(new_name.to_string(), group);
        save_groups(&groups, &app_data_dir());
        format!("Group renamed: {} -> {}", name, new_name)
    } else {
        format!("Group not found: {}", name)
    }
}

#[tauri::command]
fn create_collection(name: &str, groups: Vec<Group>, snippets: Vec<CodeSnippet>, color: &str, state: State<'_, AppState>) -> String {
    let mut collections = state.collections.lock().unwrap();
    
    if collections.contains_key(name) {
        return format!("Error: A collection with the name '{}' already exists.", name);
    }
    
    let collection = Collection {
        name: name.to_string(),
        groups,
        snippets,
        color: color.to_string(),
    };
    
    collections.insert(name.to_string(), collection.clone());
    save_collections(&collections, &app_data_dir());
    
    format!("Collection created: {}", name)
}

#[tauri::command]
fn get_collections(state: State<'_, AppState>) -> Vec<Collection> {
    let collections = state.collections.lock().unwrap();
    collections.values().cloned().collect()
}

#[tauri::command]
fn get_collection(name: &str, state: State<'_, AppState>) -> Option<Collection> {
    let collections = state.collections.lock().unwrap();
    collections.get(name).cloned()
}

#[tauri::command]
fn delete_collection(group_name: &str, collection_name: &str, state: State<'_, AppState>) -> String {
    let mut groups = state.groups.lock().unwrap();

    if let Some(group) = groups.get_mut(group_name) {
        let mut collections = state.collections.lock().unwrap();
        
        if let Some(collection) = collections.get(collection_name) {
            if collection.groups.iter().any(|g| g.name == group_name) {
                collections.remove(collection_name);
                save_collections(&collections, &app_data_dir());
                return format!("Collection '{}' deleted from group '{}'", collection_name, group_name);
            } else {
                return format!("Error: Collection '{}' is not part of group '{}'.", collection_name, group_name);
            }
        } else {
            return format!("Error: Collection '{}' not found.", collection_name);
        }
    } else {
        return format!("Error: Group '{}' not found.", group_name);
    }
}

#[tauri::command]
fn rename_collection(name: &str, new_name: &str, state: State<'_, AppState>) -> String {
    let mut collections = state.collections.lock().unwrap();
    
    if !collections.contains_key(name) {
        return format!("Error: Collection '{}' not found.", name);
    }
    
    if collections.contains_key(new_name) {
        return format!("Error: A collection with the name '{}' already exists.", new_name);
    }
    
    if let Some(mut collection) = collections.remove(name) {
        collection.name = new_name.to_string();
        collections.insert(new_name.to_string(), collection);
        save_collections(&collections, &app_data_dir());
        format!("Collection renamed: {} -> {}", name, new_name)
    } else {
        format!("Collection not found: {}", name)
    }
}

fn save_groups(groups: &HashMap<String, Group>, app_data_dir: &str) {
    if let Err(e) = fs::create_dir_all(app_data_dir) {
        println!("Error creating directory: {}", e);
    }

    let groups_json = serde_json::to_string(groups).unwrap();
    fs::write(format!("{}/groups.json", app_data_dir), groups_json).expect("Unable to save groups");
}

fn save_collections(collections: &HashMap<String, Collection>, app_data_dir: &str) {
    if let Err(e) = fs::create_dir_all(app_data_dir) {
        println!("Error creating directory: {}", e);
    }

    let collections_json = serde_json::to_string(collections).unwrap();
    fs::write(format!("{}/collections.json", app_data_dir), collections_json).expect("Unable to save collections");
}

fn load_groups(app_data_dir: &str) -> HashMap<String, Group> {
    let groups_file_path = format!("{}/groups.json", app_data_dir);

    let groups = if let Ok(groups_json) = fs::read_to_string(&groups_file_path) {
        serde_json::from_str(&groups_json).unwrap_or_default()
    } else {
        HashMap::new()
    };

    let mut groups = if groups.is_empty() {
        let mut default_groups = HashMap::new();
        default_groups.insert(
            "default".to_string(),
            Group {
                name: "default".to_string(),
                members: vec!["default_member".to_string()],
                color: "violet".to_string(),
            },
        );

        save_groups(&default_groups, app_data_dir);

        default_groups
    } else {
        groups
    };

    groups
}

fn load_collections(app_data_dir: &str) -> HashMap<String, Collection> {
    if let Ok(collections_json) = fs::read_to_string(format!("{}/collections.json", app_data_dir)) {
        serde_json::from_str(&collections_json).unwrap_or_default()
    } else {
        HashMap::new()
    }
}

fn app_data_dir() -> String {
    let mut path = dirs::data_dir().expect("Failed to get data directory");
    path.push("code_snippets");
    path.to_str().expect("Failed to convert path to string").to_string()
}

#[tauri::command]
fn create_snippet(
    group_name: &str,
    collection_name: &str,
    snippet_name: &str,
    description: &str,
    files: Vec<String>,
    updated_by: &str,
    updated_at: &str,
    state: State<'_, AppState>
) -> String {
    let groups = state.groups.lock().unwrap();

    if let Some(group) = groups.get(group_name) {
        let mut collections = state.collections.lock().unwrap();
        
        if let Some(collection) = collections.get_mut(collection_name) {
            if collection.groups.iter().any(|g| g.name == group_name) {
                if collection.snippets.iter().any(|snippet| snippet.name == snippet_name) {
                    return format!("Error: A snippet with the name '{}' already exists in the collection '{}'.", snippet_name, collection_name);
                }

                let snippet = CodeSnippet {
                    name: snippet_name.to_string(),
                    description: description.to_string(),
                    files,
                    updated_by: updated_by.to_string(),
                    updated_at: updated_at.to_string(),
                };

                collection.snippets.push(snippet);
                save_collections(&collections, &app_data_dir());
                
                format!("Snippet created: {}", snippet_name)
            } else {
                format!("Error: Collection '{}' is not part of group '{}'.", collection_name, group_name)
            }
        } else {
            format!("Error: Collection '{}' not found.", collection_name)
        }
    } else {
        format!("Error: Group '{}' not found.", group_name)
    }
}

#[tauri::command]
fn delete_snippet(
    group_name: &str,
    collection_name: &str,
    snippet_name: &str,
    state: State<'_, AppState>
) -> String {
    let groups = state.groups.lock().unwrap();

    if let Some(group) = groups.get(group_name) {
        let mut collections = state.collections.lock().unwrap();
        
        if let Some(collection) = collections.get_mut(collection_name) {
            if collection.groups.iter().any(|g| g.name == group_name) {
                if let Some(index) = collection.snippets.iter().position(|snippet| snippet.name == snippet_name) {
                    collection.snippets.remove(index);
                    save_collections(&collections, &app_data_dir());
                    format!("Snippet '{}' deleted from collection '{}' in group '{}'", snippet_name, collection_name, group_name)
                } else {
                    format!("Error: Snippet '{}' not found in collection '{}'.", snippet_name, collection_name)
                }
            } else {
                format!("Error: Collection '{}' is not part of group '{}'.", collection_name, group_name)
            }
        } else {
            format!("Error: Collection '{}' not found.", collection_name)
        }
    } else {
        format!("Error: Group '{}' not found.", group_name)
    }
}

fn main() {
    let app_data_dir = app_data_dir();
    let state = AppState {
        groups: Mutex::new(load_groups(&app_data_dir)),
        collections: Mutex::new(load_collections(&app_data_dir)),
    };
    tauri::Builder::default()
        .manage(state)
        .setup(|app| {
            let main_window = app.get_window("main").unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            create_group,
            get_groups,
            get_group,
            delete_group,
            rename_group,
            create_collection,
            get_collections,
            get_collection,
            delete_collection,
            rename_collection,
            create_snippet,
            delete_snippet
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
