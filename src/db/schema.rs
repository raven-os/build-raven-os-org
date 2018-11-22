table! {
    manifest (id) {
        id -> Int4,
        name -> Varchar,
    }
}

table! {
    manifest_content (id) {
        id -> Int4,
        manifest_id -> Int4,
        content -> Text,
        edition_date -> Timestamp,
    }
}

joinable!(manifest_content -> manifest (manifest_id));

allow_tables_to_appear_in_same_query!(manifest, manifest_content,);
