use failure::Error;
use diesel;
use diesel::prelude::*;

use crate::{
    db::{
        DbConnection,
        manifest::models::{Manifest, NewManifest},
        manifest::schema::manifest
    }
};

#[derive(Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default)]
pub struct ManifestManager {}

impl ManifestManager {
    #[inline]
    pub fn new() -> ManifestManager {
        ManifestManager {}
    }

    pub fn create(
        db_con: &DbConnection,
        name: &str
    ) -> Result<Manifest, Error> {
        let new_manifest = NewManifest {
            name
        };

        // Insert a new manifest in database
        diesel::insert_into(manifest::table)
            .values(&new_manifest)
            .execute(db_con.as_ref())?;

        // Retrieve the inserted row
        let res : Manifest = manifest::table
            .order(manifest::id.desc())
            .first(db_con.as_ref())?;

        Ok(res)
    }
}
