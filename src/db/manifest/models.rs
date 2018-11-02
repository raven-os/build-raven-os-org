use serde_derive::{Serialize, Deserialize};

use crate::db::manifest::schema::manifest;

#[derive(Queryable, Deserialize, Serialize, Debug, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct Manifest {
    id: i32,
    name: String
}

impl Manifest {
    pub fn id(&self) -> &i32 {
        &self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}

#[derive(Insertable, Copy, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug)]
#[table_name = "manifest"]
pub struct NewManifest<'a> {
    pub name: &'a str
}

impl<'a> NewManifest<'a> {
    pub fn name(&self) -> &'a str {
        &self.name
    }
}
