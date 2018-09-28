use std::collections::LinkedList;
use std::sync::{Mutex, Arc};

use app::ws::client::WsClient;
// use std::{thread, time};
const CONNECTION: &str = "ws://127.0.0.1:2794";

#[derive(Debug, Default)]
pub struct Queue {
    pub queuing: Mutex<LinkedList<String>>,
    pub running: Mutex<LinkedList<String>>
}

impl Queue {
    pub fn new() -> Queue {
        Queue {
            queuing: Mutex::new(LinkedList::new()),
            running: Mutex::new(LinkedList::new())
        }
    }

    pub fn push (&self, name: &str) {
        self.queuing.lock().unwrap().push_back(name.to_string());
        self.broadcast();
    }

    pub fn broadcast (&self) {
        println!("[queue.broadcast]");

        let list = self.queuing.lock().unwrap();
        let mut json = String::new();
        json += "{\"queuing\":[";
        for x in list.iter() {
            if json.chars().last().unwrap() != '[' {
                json += ",";
            }
            json += "\"";
            json += x;
            json += "\"";
        }
        json += "], \"running\": [";
        let list = self.running.lock().unwrap();
        for x in list.iter() {
            json += x;
            json += ",";
        }
        json += "], \"output\": \"\"";
        json += "}";
        println!("json {}", json);

        let client = WsClient::connect(CONNECTION);
        client.send(&[".queue.broadcast", &json].join(" "));
        client.close();
    }
}
