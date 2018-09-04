table! {
    builds (id) {
        id -> Integer,
        manifest -> Text,
        running -> Bool,
        queuing -> Bool,
        exit_status -> Nullable<Integer>,
        output -> Nullable<Text>,
        created_at -> Datetime,
        started_at -> Nullable<Datetime>,
        ended_at -> Nullable<Datetime>,
    }
}
