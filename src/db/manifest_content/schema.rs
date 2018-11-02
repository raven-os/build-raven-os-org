table! {
    manifest (id) {
        id -> Integer,
        name -> Text,
    }
}

table! {
    manifest_content (id) {
        id -> Integer,
        manifest_id -> Integer,
        content -> Text,
        edition_date -> Datetime,
    }
}

joinable!(manifest_content -> manifest (manifest_id));

allow_tables_to_appear_in_same_query!(
    manifest,
    manifest_content,
);
