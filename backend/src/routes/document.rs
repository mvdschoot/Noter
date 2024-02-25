
use mongodb::Database;
use mongodb::results::InsertOneResult;
use rocket::serde::json::Json;
use rocket::State;
use rocket_okapi::openapi;

use crate::db::{customer, document};
use crate::errors::response::MyError;
use crate::models::document::{Document, DocumentCreateRequest, DocumentPreviewResponse};

#[openapi(tag = "Document")]
#[get("/documents/<user_id>?<limit>&<page>")]
pub async fn get_documents(
    db: &State<Database>,
    user_id: &str,
    limit: Option<i64>,
    page: Option<i64>,
) -> Result<Json<Vec<DocumentPreviewResponse>>, MyError> {
    let limit: i64 = limit.unwrap_or(12);
    let page: i64 = page.unwrap_or(1);
    match document::get_user_documents(&db, user_id, limit, page).await {
        Ok(_customer_docs) => Ok(Json(_customer_docs)),
        Err(_error) => {
            println!("{:?}", _error);
            return Err(MyError::build(400, Some(_error.to_string())));
        }
    }
}

#[openapi(tag = "Document")]
#[post("/documents", format="json", data="<document>")]
pub async fn create_document(
    db: &State<Database>,
    document: Json<DocumentCreateRequest>
) -> Result<String, MyError> {
    document::create_document(&db, document.0).await
}