use failure::Error;
use diesel;
use diesel::prelude::*;
use chrono::Local;

use crate::{
    db::{
        DbConnection,
        manifest::{
            schema::manifest,
            models::{Manifest, NewManifest}
        },
        manifest_content::{
            schema::manifest_content,
            models::{ManifestContent, NewManifestContent}
        }
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
        name: &str,
        content: &str
    ) -> Result<ManifestContent, Error> {

        // Create new Manifest object
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

        // Create new ManifestContent object
        let new_manifest_content = NewManifestContent {
            manifest_id: res.id(),
            content,
            edition_date: &Local::now().naive_local()
        };

        diesel::insert_into(manifest_content::table)
            .values(&new_manifest_content)
            .execute(db_con.as_ref())?;

        // Retrieve the inserted row
        let res : ManifestContent = manifest_content::table
            .order(manifest_content::id.desc())
            .first(db_con.as_ref())?;

        Ok(res)
    }
}
