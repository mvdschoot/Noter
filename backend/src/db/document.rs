use std::time::{SystemTime, UNIX_EPOCH};

use bson::doc;
use bson::oid::ObjectId;
use futures::stream::StreamExt;
use mongodb::Database;
use mongodb::options::FindOptions;
use crate::errors::response::MyError;

use crate::models::document::{Document, DocumentCreateRequest, DocumentPreviewResponse};

pub async fn get_user_documents(
    db: &Database,
    user_id: &str,
    limit: i64,
    page: i64,
) -> mongodb::error::Result<Vec<DocumentPreviewResponse>> {
    let collection = db.collection::<Document>("document");

    let find_options = FindOptions::builder()
        .limit(limit)
        .skip(u64::try_from((page - 1) * limit).unwrap())
        .build();

    let filter = doc! {"user_id": user_id.to_string()};
    let mut cursor = collection.find(filter, find_options).await?;

    let mut documents: Vec<DocumentPreviewResponse> = vec![];
    while let Some(Ok(result)) = cursor.next().await {
        let document_json = DocumentPreviewResponse {
            id: result._id.to_hex(),
            created_on: result.created_on.clone(),
            last_modified: result.last_modified.clone(),
            title: result.title.clone()
        };
        documents.push(document_json);
    }

    Ok(documents)
}

pub async fn create_document(
    db: &Database,
    doc: DocumentCreateRequest
) -> Result<String, MyError> {
    let collection = db.collection::<Document>("document");

    let time: u64;
    if let Ok(t) = SystemTime::now().duration_since(UNIX_EPOCH) {
        time = t.as_millis() as u64;
    } else {
        return Err(MyError::build(500, Some("A problem with retrieving the current time".to_string())))
    }

    let doc_entity = Document {
        _id: ObjectId::new(),
        user_id: doc.user_id,
        created_on: time,
        last_modified: time,
        title: doc.title,
        content: doc.content,
    };

    if let Ok(res) = collection.insert_one(doc_entity, None).await {
        Ok(res.inserted_id.as_object_id().unwrap().to_hex())
    } else {
        Err(MyError::build(500, Some("Cannot insert the document into the data base".to_string())))
    }
}