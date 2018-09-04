use std::io::{BufRead, BufReader};
use std::process::{ChildStdout, Command, Stdio};

pub struct Compiler {
    pub final_output: String,
    pub end: bool,
    cmd_out: BufReader<ChildStdout>,
}

impl Compiler {
    pub fn new(program: &str) -> Compiler {
        let cmd = Command::new(program)
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();

        Compiler {
            cmd_out: BufReader::new(cmd.stdout.unwrap()),
            final_output: String::new(),
            end: false,
        }
    }

    pub fn line(&mut self) -> String {
        let mut out = String::new();
        let r = self.cmd_out.read_line(&mut out).unwrap();
        if r == 0 {
            self.end = true;
            out
        } else {
            self.final_output.push_str(&out);
            out
        }
    }
}
