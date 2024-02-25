use mongodb::{Client, Collection, Cursor};
use mongodb::bson::doc;
use mongodb::options::{ClientOptions, FindOptions};
use mongodb::results::InsertOneResult;

use crate::entity::{Document, User};

pub struct Database {
    connection: Client,

    database: mongodb::Database,
    document_collection: Collection<Document>,
    user_collection: Collection<User>,
}

impl Database {
    pub async fn open() -> Self {
        let client_options = ClientOptions::parse("mongodb://localhost:27017").await?;
        let connection = Client::with_options(client_options)?;
        let database = connection.database("local");
        let document_collection = database.collection::<Document>("document");
        let user_collection = database.collection::<User>("user");

        Database{
            connection,
            database,
            document_collection,
            user_collection
        }
    }

    pub async fn insert_document(&self, doc: Document) -> InsertOneResult {
        self.document_collection.insert_one(doc, None).await?
    }

    pub async fn get_documents_for_user(&self, user_id: String) -> Result<Cursor<Document>, String> {
        let filter = doc! {"user_id": user_id};
        let options = FindOptions::builder().sort(doc! {"last_modified": 1}).build();
        self.document_collection.find(filter, options)
    }

    pub async fn insert_user(&self, doc: Document) -> InsertOneResult {
        self.document_collection.insert_one(doc, None).await?
    }
}