use rocket::http::Status;
use rocket_contrib::Json;
use serde_derive::{Deserialize, Serialize};

use crate::{
    app::{ApiError, ApiResult, ManifestManager},
    db::{manifest_content::models::ManifestContent, DbConnection},
};

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct Params {
    content: String,
}

#[put("/<id>", format = "application/json", data = "<data>")]
fn update(
    connection: DbConnection,
    id: i32,
    data: Json<Params>,
) -> ApiResult<ManifestContent, ApiError> {
    if let Err(_) = ManifestManager::get(&connection, id) {
        return ApiResult::error(
            Status::NotFound,
            ApiError::from("Not Found", "manifest not found"),
        );
    }

    if let Ok(manifest) = ManifestManager::insert_content(&connection, id, &data.content) {
        ApiResult::success(Status::Created, manifest)
    } else {
        ApiResult::error(
            Status::InternalServerError,
            ApiError::from(
                "Internal Error",
                "Manifest creation failed, try again later",
            ),
        )
    }
}
