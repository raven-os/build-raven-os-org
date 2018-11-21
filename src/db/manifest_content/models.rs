use chrono;
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Deserialize, Serialize, Debug, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct ManifestContent {
    id: i32,
    manifest_id: i32,
    content: String,
    edition_date: chrono::NaiveDateTime,
}

impl ManifestContent {
    pub fn id(&self) -> i32 {
        self.id
    }

    pub fn manifest_id(&self) -> i32 {
        self.manifest_id
    }

    pub fn content(&self) -> &str {
        &self.content
    }

    pub fn edition_date(&self) -> &chrono::NaiveDateTime {
        &self.edition_date
    }
}
