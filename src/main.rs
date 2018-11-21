#![feature(plugin)]
#![feature(custom_derive)]
#![plugin(rocket_codegen)]
#![feature(custom_attribute)]
#![allow(proc_macro_derive_resolution_fallback)]

use dotenv;
extern crate rocket;
#[macro_use]
extern crate diesel;
extern crate r2d2;
extern crate r2d2_diesel;

extern crate rocket_contrib;

pub mod app;
pub mod db;
pub mod routes;

use crate::app::App;

/// Retrieves the needed environment variables or exits
fn get_env(var: &str) -> String {
    match std::env::var(var) {
        Ok(s) => s,
        Err(_) => {
            eprintln!("error: the \"{}\" environment variable is not set.", var);
            std::process::exit(1);
        }
    }
}

fn main() {
    dotenv::dotenv().ok();

    let app = App::from(&get_env("DATABASE_URL")).expect("Failed to start app");

    rocket::ignite()
        .manage(app)
        .mount("/manifest", routes![routes::manifest::create::create])
        .launch();
}
