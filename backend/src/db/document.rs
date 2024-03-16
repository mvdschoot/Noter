use std::fmt::format;
use std::str::FromStr;
use std::time::{SystemTime, UNIX_EPOCH};

use bson::{doc, Bson, Timestamp};
use bson::oid::ObjectId;
use futures::stream::StreamExt;
use mongodb::results::DeleteResult;
use mongodb::Database;
use mongodb::options::FindOptions;
use crate::errors::response::MyError;

use crate::models::document::{Document, DocumentCreateRequest, DocumentPreviewResponse, DocumentUpdateRequest, FullDocumentResponse};

pub async fn get_user_documents(
    db: &Database,
    user_id: &str,
    limit: i64,
    page: i64,
) -> mongodb::error::Result<Vec<DocumentPreviewResponse>> {
    let collection = db.collection::<Document>("document");

    let find_options = FindOptions::builder()
        .sort(doc! {"last_modified": -1})
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

    let time: i64;
    if let Ok(t) = SystemTime::now().duration_since(UNIX_EPOCH) {
        time = t.as_secs() as i64;
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

pub async fn update_document(
    db: &Database,
    doc: DocumentUpdateRequest
) -> Result<(), MyError> {
    let collection = db.collection::<Document>("document");

    let time: i64;
    if let Ok(t) = SystemTime::now().duration_since(UNIX_EPOCH) {
        time = t.as_secs() as i64;
    } else {
        return Err(MyError::build(500, Some("A problem with retrieving the current time".to_string())))
    }

    let filter = match ObjectId::from_str(&doc.id) {
        Ok(obj_id) => doc! {"_id": obj_id},
        Err(_) => return Err(MyError::build(400, Some(format!("Invalid  ID '{}'", &doc.id))))
    };


    let mut doc_update = doc! {"last_modified": time};
    if doc.content.is_some() {
        doc_update.insert("content", doc.content.unwrap());
    }
    if doc.title.is_some() {
        doc_update.insert("title", doc.title.unwrap());
    }

    if let Ok(_) = collection.update_one(filter, doc! {"$set": doc_update}, None).await {
        Ok(())
    } else {
        Err(MyError::build(500, Some(format!("Cannot update document '{}'", doc.id).to_string())))
    }
}

pub async fn get_full_document(
    db: &Database,
    id: &str
) -> Result<FullDocumentResponse, MyError> {
    let collection = db.collection::<Document>("document");

    let filter = match ObjectId::from_str(id) {
        Ok(obj_id) => doc! {"_id": obj_id},
        Err(_) => return Err(MyError::build(400, Some(format!("Invalid  ID '{}'", id))))
    };

    match collection.find_one(filter, None).await {
        Ok(Some(doc)) => Ok(FullDocumentResponse {
            id: doc._id.to_hex(),
            user_id: doc.user_id,
            created_on: doc.created_on,
            last_modified: doc.last_modified,
            title: doc.title,
            content: doc.content,
        }),
        _ => Err(MyError::build(404, Some(format!("Can't find a document with _id '{}'", id))))
    }
}

pub async fn delete_document(
    db: &Database,
    id: &str
) -> Result<DeleteResult, MyError> {
    let collection = db.collection::<Document>("document");

    let filter = match ObjectId::from_str(id) {
        Ok(obj_id) => doc! {"_id": obj_id},
        Err(_) => return Err(MyError::build(400, Some(format!("Invalid  ID '{}'", id))))
    };

    match collection.delete_one(filter, None).await {
        Ok(res) => Ok(res),
        Err(err) => Err(MyError::build(404, Some(format!("Failed to delete the document, err is: {}", err))))
    }
}