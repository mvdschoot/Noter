use rocket_okapi::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, JsonSchema, Clone)]
pub struct User {
    pub _id: String,
    pub user_id: String,
    pub password: String,
}