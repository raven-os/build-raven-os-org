//! Contains error catcher

extern crate rocket;

use rocket::response::content;

#[catch(404)]
fn not_found(req: &rocket::Request) -> content::Html<String> {
    content::Html(format!(
        "<p>Sorry, but '{}' is not a valid path!</p>",
        req.uri()
    ))
}
