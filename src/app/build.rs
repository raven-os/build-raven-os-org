//use rocket::http::Status;

// TODO: used for add_package
#![cfg_attr(feature = "cargo-clippy", allow(too_many_arguments))]

use diesel;
use diesel::prelude::*;
use std::fs;
use std::fs::File;

use failure::Error;

//use app::ApiError;
use chrono::NaiveDateTime;
use db::build::models::{NewBuild, Build};
use db::build::schema::builds;
use db::DbConnection;
use routes::build::Filters;

use app::compiler::Compiler;
use app::ws::client::WsClient;
// use std::{thread, time};
const CONNECTION: &str = "ws://127.0.0.1:2794";

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default)]
pub struct Builder {}

impl Builder {
    #[inline]
    pub fn new() -> Builder {
        Builder {}
    }


    pub fn compile(&self, id: &str) -> String {
        println!("[builder.compile] start");
        let client = WsClient::connect(CONNECTION);

        client.send(&[".builder.compile.server", id].join(" "));
        let mut compiler = Compiler::new("./test.sh");
        while !compiler.end {
            #[allow(unused_mut)]
            let mut line = compiler.line();
            if !line.is_empty() {
                client.send(&line);
            }
        }
        client.close();
        compiler.final_output
    }

    #[allow(unused)]
    pub fn add_build(
        &self,
        db_con: &DbConnection,
        manifest: &str,
        name: &str,
        created_at: &NaiveDateTime,
    ) -> Result<Build, Error> {
        let new_build = NewBuild {
            manifest,
            name,
            running: &false,
            queuing: &false,
            created_at,
        };

        // Create a row in db for the build
        diesel::insert_into(builds::table)
            .values(&new_build)
            .execute(db_con.as_ref())?;

        // Retrieve the row
        let res : Build = builds::table
            .order(builds::id.desc())
            .first(db_con.as_ref())?;

        // Save the manifest with the build's id as name
        fs::create_dir_all("manifests/")?;
        File::create("manifests/".to_string() + &res.id().to_string() + ".py")?;
        fs::write("manifests/".to_string() + &res.id().to_string() + ".py", manifest.to_string())?;
        Ok(res)
    }

    pub fn builds(
        &self,
        db_con: &DbConnection,
        filters: &Option<Filters>,
    ) -> Result<Vec<Build>, Error> {
        use db::build::schema::builds::dsl::*;

        let mut query = builds.into_boxed();
        if let Some(p) = filters {
            if let Some(r) = p.running() {
                query = query.filter(running.eq(r));
            }
            if let Some(c) = p.queuing() {
                query = query.filter(queuing.eq(c));
            }
            if let Some(n) = p.exit_status() {
                query = query.filter(exit_status.eq(n));
            }
            match p.order_by().as_ref().map(String::as_ref) {
                Some("running") => query = query.order_by(running),
                Some("queuing") => query = query.order_by(queuing),
                Some("exit_status") => query = query.order_by(exit_status),
                _ => (),
            }
        }
        Ok(query
            .then_order_by(created_at)
            .load::<Build>(db_con.as_ref())?)
    }

    pub fn get(
        &self,
        db_con: &DbConnection,
        build_id: i32
    ) -> Result<Build, Error> {
        use db::build::schema::builds::dsl::*;

        let query = builds.find(build_id);

        Ok(query
            .first::<Build>(db_con.as_ref())?)
    }

    pub fn update(
        &self,
        db_con: &DbConnection,
        build_id: i32,
        new_queuing: Option<bool>,
        new_running: Option<bool>,
        new_output: Option<String>,
        new_started_at: Option<&NaiveDateTime>,
        new_ended_at: Option<&NaiveDateTime>
    ) -> Result<Build, Error> {
        use db::build::schema::builds::dsl::*;

        let query = builds.find(build_id);

        let update = diesel::update(query);

        // TODO: execute only 1 request ?
        if let Some(is_queuing) = new_queuing {
            update.set(queuing.eq(is_queuing)).execute(db_con.as_ref());
        }
        if let Some(is_running) = new_running {
            update.set(running.eq(is_running)).execute(db_con.as_ref());;
        }
        if let Some(out) = new_output {
            update.set(output.eq(out)).execute(db_con.as_ref());;
        }
        if let Some(started) = new_started_at {
            update.set(started_at.eq(started)).execute(db_con.as_ref());;
        }
        if let Some(ended) = new_ended_at {
            update.set(ended_at.eq(ended)).execute(db_con.as_ref());;
        }

        Ok(query
            .first::<Build>(db_con.as_ref())?)
    }
}
