use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Deserialize, Serialize, Debug, Clone, Eq, PartialEq, Ord, PartialOrd, Hash)]
pub struct Manifest {
    id: i32,
    name: String,
}

impl Manifest {
    pub fn id(&self) -> i32 {
        self.id
    }

    pub fn name(&self) -> &str {
        &self.name
    }
}
