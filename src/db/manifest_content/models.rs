use serde_derive::{Serialize, Deserialize};
use chrono;

use crate::db::manifest_content::schema::manifest_content;

#[derive(Queryable, Deserialize, Serialize, Debug, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct ManifestContent {
    id: i32,
    manifest_id: i32,
    content: String,
    edition_date: chrono::NaiveDateTime
}

impl ManifestContent {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn manifest_id(&self) -> &i32 {
        &self.manifest_id
    }

    pub fn content(&self) -> &str {
        &self.content
    }

    pub fn edition_date(&self) -> &chrono::NaiveDateTime {
        &self.edition_date
    }
}

#[derive(Insertable, Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug)]
#[table_name = "manifest_content"]
pub struct NewManifestContent<'a> {
    pub manifest_id: &'a i32,
    pub content: &'a str,
    pub edition_date: &'a chrono::NaiveDateTime
}

impl<'a> NewManifestContent<'a> {
    pub fn manifest_id(&self) -> &'a i32 {
        &self.manifest_id
    }

    pub fn content(&self) -> &'a str {
        &self.content
    }

    pub fn edition_date(&self) -> &'a chrono::NaiveDateTime {
        &self.edition_date
    }
}
