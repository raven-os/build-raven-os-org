//! Contains all routes to serve front-end files

use std::path::{Path, PathBuf};

use rocket::response::NamedFile;

#[get("/<files..>", rank = 1)]
pub fn static_files(files: PathBuf) -> Option<NamedFile> {
    let path = Path::new("static").join(files);
    if !path.is_dir() {
        NamedFile::open(path).ok()
    } else {
        None
    }
}

#[get("/")]
pub fn index() -> Option<NamedFile> {
    NamedFile::open(Path::new("static").join("index.html")).ok()
}
