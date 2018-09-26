use std::collections::LinkedList;
use std::sync::Mutex;

#[derive(Debug, Default)]
pub struct Queue {
    pub waiting: Mutex<LinkedList<String>>,
    pub running: Mutex<LinkedList<String>>
}

impl Queue {
    pub fn new() -> Queue {
        Queue {
            waiting: Mutex::new(LinkedList::new()),
            running: Mutex::new(LinkedList::new())
        }
    }

    pub fn push (&self, name: &str) {
        self.waiting.lock().unwrap().push_back(name.to_string())
    }

    pub fn broadcast (&self) {
        let list = self.waiting.lock().unwrap();
        for x in list.iter() {
            println!("iter {}", x)
        }
    }
}
