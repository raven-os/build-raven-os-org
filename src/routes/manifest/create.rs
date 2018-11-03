use serde_derive::{Serialize, Deserialize};
use rocket::http::Status;
use rocket_contrib::Json;

use crate::{
    app::{
        ApiError,
        ApiResult,
        ManifestManager
    },
    db::{
       DbConnection,
       manifest_content::models::{ManifestContent}
   }
};

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct Params {
    name: String,
    content: String
}

#[post("/", format = "application/json", data = "<data>")]
fn create(
    connection: DbConnection,
    data: Json<Params>,
) -> ApiResult<ManifestContent, ApiError> {
    if let Ok(manifest) = ManifestManager::create(
        &connection,
        &data.name,
        &data.content
    ) {
        ApiResult::success(Status::Created, manifest)
    } else {
        ApiResult::error(
            Status::BadRequest,
            ApiError::from("unknown error", "unexpected"),
        )
    }
}
