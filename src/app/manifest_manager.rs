use chrono::Local;
use diesel;
use diesel::prelude::*;
use failure::Error;

use crate::db::{manifest_content::models::ManifestContent, schema, DbConnection};

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
        content: &str,
    ) -> Result<ManifestContent, Error> {
        // Insert a new manifest in database
        let manifest_id: i32 = diesel::insert_into(schema::manifest::table)
            .values(&schema::manifest::name.eq(name))
            .returning(schema::manifest::id)
            .get_result(db_con.as_ref())?;

        // Create new ManifestContent object
        let new_manifest_content = (
            schema::manifest_content::manifest_id.eq(manifest_id),
            schema::manifest_content::content.eq(content),
            schema::manifest_content::edition_date.eq(Local::now().naive_local()),
        );

        // Insert a new manifest_content in database
        let manifest_content: ManifestContent =
            diesel::insert_into(schema::manifest_content::table)
                .values(&new_manifest_content)
                .get_result(db_con.as_ref())?;

        Ok(manifest_content)
    }
}
