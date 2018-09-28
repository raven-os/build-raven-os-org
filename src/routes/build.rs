//! Contains all packager routes

//use json;
use rocket::http::Status;
use rocket::State;
use rocket_contrib::Json;

use app::build::Builder;
use app::{ApiError, ApiResult};
use chrono::Local;
use db::build::Build;
use db::DbConnection;

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct NewBuild {
    manifest: String,
}


#[derive(FromForm, Debug)]
pub struct Filters {
    pub running: Option<bool>,
    pub queuing: Option<bool>,
    pub exit_status: Option<i32>,
    pub created_at: Option<String>,
    pub order_by: Option<String>,
}

impl Filters {
    pub fn running(&self) -> &Option<bool> {
        &self.running
    }
    pub fn queuing(&self) -> &Option<bool> {
        &self.queuing
    }
    pub fn exit_status(&self) -> &Option<i32> {
        &self.exit_status
    }
    pub fn created_at(&self) -> &Option<String> {
        &self.created_at
    }
    pub fn order_by(&self) -> &Option<String> {
        &self.order_by
    }
}

#[post("/compile/<id>", format = "application/json")]
fn compile(builder: State<Builder>, id: String) -> ApiResult<String, ApiError> {
    let output = builder.compile(&id);
    ApiResult::success(Status::Ok, output)
}

#[post("/", format = "application/json", data = "<data>")]
fn add(
    builder: State<Builder>,
    connection: DbConnection,
    data: Json<NewBuild>,
) -> ApiResult<Build, ApiError> {
    if let Ok(build) = builder.add_build(
        &connection,
        &data.manifest,
        &Local::now().naive_local(),
    ) {
        ApiResult::success(Status::Created, build)
    } else {
        ApiResult::error(
            Status::BadRequest,
            ApiError::from("already_registered", "The build is already registered"),
        )
    }
}


#[get("/?<filters>")]
fn dump_filter(
    builder: State<Builder>,
    connection: DbConnection,
    filters: Option<Filters>,
) -> ApiResult<Vec<Build>, ApiError> {
    if let Ok(builds) = builder.builds(&connection, &filters) {
        ApiResult::success(Status::Ok, builds)
    } else {
        ApiResult::error(Status::InternalServerError, ApiError::internal_error())
    }
}

#[get("/<id>")]
fn get (
    builder: State<Builder>,
    connection: DbConnection,
    id: i32
) -> ApiResult<Build, ApiError> {
    if let Ok(build) = builder.get(&connection, id) {
        ApiResult::success(Status::Ok, build)
    } else {
        ApiResult::error(Status::InternalServerError, ApiError::internal_error())
    }
}

#[get("/")]
fn dump(builder: State<Builder>, connection: DbConnection) -> ApiResult<Vec<Build>, ApiError> {
    if let Ok(builds) = builder.builds(&connection, &None) {
        ApiResult::success(Status::Ok, builds)
    } else {
        ApiResult::error(Status::InternalServerError, ApiError::internal_error())
    }
}
