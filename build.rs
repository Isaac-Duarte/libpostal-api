use std::env;
use std::fs;
use std::path::Path;
use std::process::Command;

fn main() {
    println!("cargo:rerun-if-changed=frontend/");
    
    let _out_dir = env::var("OUT_DIR").unwrap();
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let profile = env::var("PROFILE").unwrap_or_else(|_| "debug".to_string());
    
    let frontend_dir = Path::new(&manifest_dir).join("frontend");
    let frontend_build_dir = frontend_dir.join("build").join("client");
    let static_dir = Path::new(&manifest_dir).join("static");
    
    // Only build frontend in release mode
    if profile != "release" {
        println!("cargo:warning=Skipping frontend build in {} mode. Use Vite dev server for development.", profile);
        return;
    }
    
    // Check if frontend directory exists
    if !frontend_dir.exists() {
        println!("cargo:warning=Frontend directory not found, skipping frontend build");
        return;
    }
    
    // Build the frontend
    println!("cargo:warning=Building frontend for release...");
    
    let npm_install = Command::new("npm")
        .arg("install")
        .current_dir(&frontend_dir)
        .status()
        .expect("Failed to run npm install");
    
    if !npm_install.success() {
        panic!("npm install failed");
    }
    
    let npm_build = Command::new("npm")
        .arg("run")
        .arg("build")
        .current_dir(&frontend_dir)
        .status()
        .expect("Failed to run npm build");
    
    if !npm_build.success() {
        panic!("npm build failed");
    }
    
    // Remove existing static directory if it exists
    if static_dir.exists() {
        fs::remove_dir_all(&static_dir).expect("Failed to remove static directory");
    }
    
    // Create new static directory
    fs::create_dir_all(&static_dir).expect("Failed to create static directory");
    
    // Copy frontend build files to static directory
    if frontend_build_dir.exists() {
        copy_dir_all(&frontend_build_dir, &static_dir)
            .expect("Failed to copy frontend build files");
        println!("cargo:warning=Frontend build files copied to static directory");
    } else {
        println!("cargo:warning=Frontend build directory not found: {:?}", frontend_build_dir);
    }
}

fn copy_dir_all(src: impl AsRef<Path>, dst: impl AsRef<Path>) -> std::io::Result<()> {
    fs::create_dir_all(&dst)?;
    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let ty = entry.file_type()?;
        if ty.is_dir() {
            copy_dir_all(entry.path(), dst.as_ref().join(entry.file_name()))?;
        } else {
            fs::copy(entry.path(), dst.as_ref().join(entry.file_name()))?;
        }
    }
    Ok(())
}
