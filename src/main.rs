#![feature(plugin)]
#![feature(custom_derive)]
#![plugin(rocket_codegen)]
#![feature(custom_attribute)]

#![allow(proc_macro_derive_resolution_fallback)]

use dotenv;
#[macro_use]
extern crate diesel;

pub mod app;
pub mod db;

use diesel::prelude::*;

use crate::{
    app::App,
    db::manifest::{
        schema::manifest,
        models::{Manifest, NewManifest}
    },
    db::DbConnection
};

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

    let new_manifest  = NewManifest {
        name: "test"
    };

    let con = &DbConnection(app.pool().get().unwrap());

    diesel::insert_into(manifest::table)
        .values(&new_manifest)
        .execute(con.as_ref());
}
