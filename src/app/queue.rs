use std::collections::LinkedList;
use std::sync::Mutex;

use app::compiler::Compiler;
use app::build::Builder;
use db::DbConnection;

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

    pub fn clear_output(&mut self) {
        self.output = String::new()
    }

    pub fn append_output(&mut self, text: &str) {
        self.output += text;
        self.broadcast();
    }

    pub fn run (&mut self, builder: &Builder, connection: &DbConnection) {
        if let Some(e) = self.queuing.lock().unwrap().pop_front() {
            self.running.lock().unwrap().push_back(e.to_string());
            builder.update(connection, e.parse::<i32>().unwrap(), false, true);

        }
        self.broadcast();
        self.clear_output();
        let mut compiler = Compiler::new("./test.sh");
        while !compiler.end {
            #[allow(unused_mut)]
            let mut line = compiler.line();
            if !line.is_empty() {
                println!("{:?}", line);
                self.append_output(&line);
            }
        }

        if let Some(e) = self.running.lock().unwrap().pop_front() {
            builder.update(connection, e.parse::<i32>().unwrap(), false, false);
            builder.updateOut(connection, e.parse::<i32>().unwrap(), compiler.final_output);
            self.broadcast();
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
