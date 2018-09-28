//! Contains all packager routes

//use json;
use rocket::http::Status;
use rocket::State;
use rocket_contrib::Json;

use app::queue::Queue;
use app::{ApiError, ApiResult};
use std::sync::{Arc, Mutex};

use app::build::Builder;
use db::DbConnection;

// The following structures are used as parameter for API endpoints
#[derive(
    FromForm, Serialize, Deserialize, Clone, Eq, PartialEq, Ord, PartialOrd, Hash, Debug, Default,
)]
struct QueueParam {
    name: String
}

#[post("/", format = "application/json", data = "<data>")]
fn add(queue: State<Arc<Mutex<Queue>>>,
    builder: State<Builder>,
    connection: DbConnection,
    data: Json<QueueParam>) -> ApiResult<String, ApiError> {
    queue.lock().unwrap().push(&data.name);
    builder.update(&connection, data.name.parse::<i32>().unwrap(), true, false);
    ApiResult::success(Status::Ok, "ok".to_string())
}

#[post("/run")]
fn run(queue: State<Arc<Mutex<Queue>>>,
    builder: State<Builder>,
    connection: DbConnection) -> ApiResult<String, ApiError>{
    queue.lock().unwrap().run(&builder, &connection);

    ApiResult::success(Status::Ok, "ok".to_string())
}

#[get("/")]
fn get(queue: State<Arc<Mutex<Queue>>>) -> ApiResult<String, ApiError> {
    queue.lock().unwrap().broadcast();
    ApiResult::success(Status::Ok, "ok".to_string())
}
