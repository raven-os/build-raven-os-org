use std::collections::LinkedList;
use std::sync::{Mutex, Arc};

use app::ws::client::WsClient;
// use std::{thread, time};
const CONNECTION: &str = "ws://127.0.0.1:2794";

#[derive(Debug, Default)]
pub struct Queue {
    pub queuing: Mutex<LinkedList<String>>,
    pub running: Mutex<LinkedList<String>>,
    pub output: String
}

impl Queue {
    pub fn new() -> Queue {
        Queue {
            queuing: Mutex::new(LinkedList::new()),
            running: Mutex::new(LinkedList::new()),
            output: String::new()
        }
    }

    pub fn run (&self) {
        if let Some(e) = self.queuing.lock().unwrap().pop_front() {
            self.running.lock().unwrap().push_back(e);
        }
        self.broadcast();
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
        let list2 = self.running.lock().unwrap();
        for x in list2.iter() {
            if json.chars().last().unwrap() != '[' {
                json += ",";
            }
            json += "\"";
            json += x;
            json += "\"";
        }
        json += "], \"output\": \"";
        json += &self.output;
        json += "\"";
        json += "}";
        println!("json {}", json);

        let client = WsClient::connect(CONNECTION);
        client.send(&[".queue.broadcast", &json].join(" "));
        client.close();
    }
}
