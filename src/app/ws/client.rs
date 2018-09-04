use std::sync::mpsc::channel;
use std::sync::mpsc::Sender;
use std::{thread, time};

use websocket::client::ClientBuilder;
use websocket::{CloseData, Message, OwnedMessage};

pub struct WsClient {
    join_handler: thread::JoinHandle<()>,
    tx: Sender<OwnedMessage>,
}

impl WsClient {
    pub fn connect(uri: &str) -> WsClient {
        let client = ClientBuilder::new(uri)
            .unwrap()
            .add_protocol("rust-websocket")
            .connect_insecure()
            .unwrap();
        println!("[ws.client.connect] success");
        let (_, mut sender) = client.split().unwrap();
        let tuple = channel();
        let tx = tuple.0;
        let rx = tuple.1;
        let join_handler = thread::spawn(move || {
            loop {
                // Send loop
                let message = match rx.recv() {
                    Ok(m) => m,
                    Err(e) => {
                        println!("[ws.client.connect] thread received: {:?}", e);
                        return;
                    }
                };

                if let OwnedMessage::Close(_) = message {
                    let _ = sender.send_message(&message);
                    break;
                }

                // Send the message
                match sender.send_message(&message) {
                    Ok(()) => (),
                    Err(e) => {
                        println!("[ws.client.send_message] {:?}", e);
                        let _ = sender.send_message(&Message::close());
                        break;
                    }
                }
            }
        });

        WsClient {
            join_handler,
            tx,
        }
    }

    pub fn send(&self, data: &str) {
        if let Err(e) = self.tx.send(OwnedMessage::Text(data.to_string())) {
            println!("[ws.client.send.error] {}", e);
        }
    }

    pub fn close(self) {
        thread::sleep(time::Duration::from_millis(100));
        if let Err(e) = self.tx.send(OwnedMessage::Close(Some(CloseData::new(
            1000,
            "".to_string(),
        )))) {
            println!("[ws.client.close.send.error] {}", e);
        }
        thread::sleep(time::Duration::from_millis(100));
        if let Err(e) = self.join_handler.join() {
            println!("[ws.client.close.join.error] {:?}", e);
        }
    }
}
