use std::fmt;
use std::net::TcpStream;
use std::sync::Arc;
use std::sync::Mutex;
use std::thread;
use websocket::sender::Writer;
use websocket::sync::Server;
use websocket::OwnedMessage;
use app::queue::Queue;

pub enum ConnectionType {
    Server,
    Client,
}

pub struct Client {
    ip: String,
    id: String,
    tx: Writer<TcpStream>,
}

impl Client {
    pub fn new(ip: &str, id: &str, tx: Writer<TcpStream>) -> Client {
        Client {
            ip: ip.to_string(),
            id: id.to_string(),
            tx,
        }
    }

    pub fn id(&self) -> &str {
        &self.id
    }

    pub fn ip(&self) -> &str {
        &self.ip
    }

    pub fn tx_mut(&mut self) -> &mut Writer<TcpStream> {
        &mut self.tx
    }
}

impl fmt::Debug for Client {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Client {{ ip: {}, id: {} }}", self.ip(), self.id())
    }
}

impl fmt::Display for Client {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "(ip: {}, id: {})", self.ip(), self.id())
    }
}

pub fn serve(q: Arc<Mutex<Queue>>) {

    pub fn add_client(list: &Arc<Mutex<Vec<Client>>>, client: Client, queue: Arc<Mutex<Queue>>) {
        let clients = &mut *match list.lock() {
            Ok(c) => c,
            Err(s) => {
                println!("[ws.server.add.error] from {}, {}", client, s);
                return;
            }
        };
        println!("[ws.server.add] from {}", client);
        clients.push(client);
        queue.lock().unwrap().broadcast();

        /*
        let data = queue.lock().unwrap().broadcast();
        // send_message(list, "tmp", &data);
        client
            .tx_mut()
            .send_message(&OwnedMessage::Text(data));
        */
    }

    pub fn remove_client(list: &Arc<Mutex<Vec<Client>>>, ip: &str) {
        let clients = &mut *match list.lock() {
            Ok(c) => c,
            Err(s) => {
                println!("[ws.server.remove.error] from {}, {}", ip, s);
                return;
            }
        };

        let removed = clients
            .iter()
            .position(|c| c.ip == ip)
            .map(|e| clients.remove(e))
            .is_some();
        println!("[ws.server.remove] from {}: {}", ip, removed);
    }

    pub fn send_message(list: &Arc<Mutex<Vec<Client>>>, id: &str, message: &str) {
        let clients = &mut *match list.lock() {
            Ok(c) => c,
            Err(s) => {
                println!("[ws.server.send_message.error] build {}, {}", id, s);
                return;
            }
        };
        let mut build_clients: Vec<&mut Client> = clients
            .iter_mut()
            // .filter(|c| c.id != "%")
            .collect();

        build_clients.iter_mut().for_each(|client| {
            if let Err(e) = client
                .tx_mut()
                .send_message(&OwnedMessage::Text(message.to_string()))
            {
                println!("[ws.server.send_message.error] to {}, {}", client, e);
            }
        });
    }

    let server = Server::bind("127.0.0.1:2794").unwrap();
    println!("[ws.server.started] ok");
    let clients = Arc::new(Mutex::new(Vec::new()));

    for request in server.filter_map(Result::ok) {
        let conn = Arc::clone(&clients);

        let q2 = q.clone();
        thread::spawn(move || {
            if !request.protocols().contains(&"rust-websocket".to_string()) {
                request.reject().unwrap();
                return;
            }

            let client = request.use_protocol("rust-websocket").accept().unwrap();

            let ip = client.peer_addr().unwrap();
            let mut id: Option<String> = None;
            let mut connection_type: Option<ConnectionType> = None;

            println!("[ws.server.connection] from {}", ip);

            let (mut receiver, sender) = client.split().unwrap();
            let mut sender = Some(sender);

            for message in receiver.incoming_messages() {
                let q3 = q2.clone();
                let message = match message {
                    Ok(m) => m,
                    Err(e) => {
                        println!("[ws.server.message] from {}, build {:?}, {}", ip, id, e);
                        remove_client(&conn, &ip.to_string());
                        break;
                    }
                };

                match message {
                    OwnedMessage::Close(_) => {
                        if let Some(ConnectionType::Client) = connection_type {
                            remove_client(&conn, &ip.to_string());
                        }
                        break;
                    }
                    OwnedMessage::Text(ref txt) if txt.starts_with(".packager.compile.server ") => {
                        if sender.take().is_some() {
                            let v: Vec<&str> = txt.split(' ').collect();
                            connection_type = Some(ConnectionType::Server);
                            id = Some(v[1].to_string());
                        }
                    }
                    OwnedMessage::Text(ref txt) if txt.starts_with(".queue.broadcast ") => {
                        if sender.take().is_some() {
                            let v: Vec<&str> = txt.splitn(2, ' ').collect();
                            connection_type = Some(ConnectionType::Server);
                            id = Some(v[1].to_string());// id is the message to broadcast
                            send_message(&conn, v[1], v[1]);
                        }
                    }
                    OwnedMessage::Text(ref txt) if txt.starts_with(".packager.compile.client ") => {
                        if let Some(s) = sender.take() {
                            let v: Vec<&str> = txt.split(' ').collect();
                            connection_type = Some(ConnectionType::Client);
                            id = Some(v[1].to_string());
                            let client = Client::new(&ip.to_string(), v[1], s);
                            add_client(&conn, client, q3);
                        }
                    }
                    OwnedMessage::Text(txt) => {
                        if let (Some(ConnectionType::Server), Some(ref id)) =
                            (&connection_type, &id)
                        {
                            send_message(&conn, &id, &txt);
                        }
                    }
                    m => {
                        println!("Not implemented {:?}", m);
                    }
                }
            }
        });
    }
}
