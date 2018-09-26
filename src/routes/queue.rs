//! Contains all packager routes

//use json;
use rocket::http::Status;
use rocket::State;
use rocket_contrib::Json;

use app::queue::Queue;
use app::{ApiError, ApiResult};
// use db::build::Build;
// use db::DbConnection;

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct QueueParam {
    name: String
}

#[post("/", format = "application/json", data = "<data>")]
fn add(queue: State<Queue>, data: Json<QueueParam>) -> ApiResult<String, ApiError> {
    queue.push(&data.name);
    ApiResult::success(Status::Ok, "ok".to_string())
}

#[get("/")]
fn get(queue: State<Queue>) -> ApiResult<String, ApiError> {
    queue.broadcast();
    ApiResult::success(Status::Ok, "ok".to_string())
}
