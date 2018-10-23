//! This is the API for Raven Website
//!
//! Is contains for now only the newsletter endpoints

#![feature(plugin)]
#![feature(custom_derive)]
#![plugin(rocket_codegen)]
#![cfg_attr(feature = "cargo-clippy", allow(needless_pass_by_value))]
#![cfg_attr(feature = "cargo-clippy", allow(doc_markdown))]
#![cfg_attr(feature = "cargo-clippy", allow(print_literal))]
#![feature(extern_prelude)]
// TODO: allow these warnings when they will be fixed on diesel and rocket
#![cfg_attr(feature = "cargo-clippy", allow(suspicious_else_formatting))]
#![allow(proc_macro_derive_resolution_fallback)]

extern crate dotenv;
extern crate rocket;
#[macro_use]
extern crate diesel;
extern crate r2d2;
extern crate r2d2_diesel;
#[macro_use]
extern crate serde_derive;
extern crate chrono;
extern crate failure;
extern crate rocket_contrib;
extern crate rocket_cors;
extern crate serde;
extern crate serde_json as json;
extern crate websocket;
#[macro_use]
extern crate serde_json;

pub mod app;
pub mod db;
pub mod routes;

use app::build::Builder;
use app::ws;
use app::App;
use app::queue::Queue;
use std::thread;
use std::sync::{Arc, Mutex};

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

    let queue = Arc::new(Mutex::new(Queue::new()));
    let q2 = queue.clone();

    thread::spawn(move || {
        ws::server::serve(q2);
    });

    let app = App::from(&get_env("DATABASE_URL")).expect("Failed to start app");
    let builder = Builder::new();

    let options = rocket_cors::Cors {
        ..Default::default()
    };

    rocket::ignite()
        .manage(app)
        .manage(builder)
        .manage(queue)
        .mount(
            "/",
            routes![routes::frontend::static_files, routes::frontend::index,],
        )
        .mount(
            "/builds/",
            routes![
                routes::build::add,
                routes::build::dump,
                routes::build::dump_filter,
                routes::build::get,
                //routes::package::compile
            ],
        )
        .mount(
            "/queue",
            routes![
                routes::queue::add,
                routes::queue::get,
                routes::queue::run,
            ]
        )
        .attach(options)
        .catch(catchers![routes::error::not_found,])
        .launch();
}
