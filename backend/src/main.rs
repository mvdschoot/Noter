#[macro_use]
extern crate rocket;

use dotenv::dotenv;
use rocket_okapi::openapi_get_routes;
use rocket_okapi::swagger_ui::{make_swagger_ui, SwaggerUIConfig};

mod db;
mod errors;
mod fairings;
mod models;
mod routes;

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    rocket::build()
        .attach(db::init())
        .mount(
            "/",
            openapi_get_routes![
                routes::document::get_documents,
                routes::document::get_full_document,
                routes::document::create_document,
                routes::document::update_document,
                routes::document::delete_document,
            ],
        )
        .mount(
            "/api-docs",
            make_swagger_ui(&SwaggerUIConfig {
                url: "../openapi.json".to_owned(),
                ..Default::default()
            }),
        )
}