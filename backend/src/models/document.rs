use mongodb::bson::oid::ObjectId;
use rocket::Request;
use rocket::request::{FromRequest, Outcome};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Document {
    pub _id: ObjectId,
    pub user_id: String,
    pub created_on: u64,
    pub last_modified: u64,
    pub title: String,
    pub content: String
}

#[derive(Debug, Serialize, JsonSchema, Clone)]
pub struct DocumentPreviewResponse {
    pub id: String,
    pub created_on: u64,
    pub last_modified: u64,
    pub title: String,
}

#[derive(Debug, Deserialize, JsonSchema, Clone)]
pub struct DocumentCreateRequest {
    pub user_id: String,
    pub title: String,
    pub content: String,
}

#[derive(Debug, Deserialize, Clone)]
pub struct DocumentUpdateRequest {
    pub id: String,
    pub title: Option<String>,
    pub content: Option<String>,
}