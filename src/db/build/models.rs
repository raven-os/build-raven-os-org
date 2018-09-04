//! This module contains structures used to represent all data stored in database
//! by the build system.

use db::build::schema::builds;

use chrono;

/// Represents a build stored in the buildr
// TODO impl Default with chrono::NaiveDateTime
#[derive(Queryable, Deserialize, Serialize, Debug, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct Build {
    id: i32,
    manifest: String,
    running: bool,
    queuing: bool,
    exit_status: Option<i32>,
    output: Option<String>,
    created_at: chrono::NaiveDateTime,
    started_at: Option<chrono::NaiveDateTime>,
    ended_at: Option<chrono::NaiveDateTime>,
}

impl Build {
    /// Return the build's id
    pub fn id(&self) -> &i32 {
        &self.id
    }

    /// Return the build's manifest
    pub fn manifest(&self) -> &str {
        &self.manifest
    }

    /// Return the build's running
    pub fn running(&self) -> &bool {
        &self.running
    }

    /// Return the build's queuing
    pub fn queuing(&self) -> &bool {
        &self.queuing
    }

    /// Return the build's exit_status
    pub fn exit_status(&self) -> &Option<i32> {
        &self.exit_status
    }

    /// Return the build's output
    pub fn output(&self) -> &Option<String> {
        &self.output
    }

    /// Return the build's created_at
    pub fn created_at(&self) -> &chrono::NaiveDateTime {
        &self.created_at
    }

    /// Return the build's started_at
    pub fn started_at(&self) -> &Option<chrono::NaiveDateTime> {
        &self.started_at
    }

    /// Return the build's ended_at
    pub fn ended_at(&self) -> &Option<chrono::NaiveDateTime> {
        &self.ended_at
    }
}

/// Represents a build to store in the builder
#[derive(Insertable, Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug)]
#[table_name = "builds"]
pub struct NewBuild<'a> {
    pub manifest: &'a str,
    pub running: &'a bool,
    pub queuing: &'a bool,
    pub created_at: &'a chrono::NaiveDateTime,
}

impl<'a> NewBuild<'a> {
    /// Return the build's manifest
    pub fn manifest(&self) -> &'a str {
        &self.manifest
    }

    /// Return the build's runnin
    pub fn running(&self) -> &'a bool {
        &self.running
    }

    /// Return the build's queuing
    pub fn queuing(&self) -> &'a bool {
        &self.queuing
    }

    /// Return the build's created_at
    pub fn created_at(&self) -> &'a chrono::NaiveDateTime {
        &self.created_at
    }
}
