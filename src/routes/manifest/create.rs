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
       manifest::models::{Manifest}
   }
};

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct Params {
    name: String,
}

#[post("/", format = "application/json", data = "<data>")]
fn create(
    connection: DbConnection,
    data: Json<Params>,
) -> ApiResult<Manifest, ApiError> {
    if let Ok(manifest) = ManifestManager::create(
        &connection,
        &data.name
    ) {
        ApiResult::success(Status::Created, manifest)
    } else {
        ApiResult::error(
            Status::BadRequest,
            ApiError::from("unknown error", "unexpected"),
        )
    }
}
