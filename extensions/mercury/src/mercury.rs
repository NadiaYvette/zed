use std::path::Path;
use zed_extension_api::{self as zed, LanguageServerId, Result};

const SERVER_PATH: &str = "/home/nyc/src/mercury-vscode-plugin/out/server.js";
const SERVER_COMMAND: &str = "mercury-language-server";

struct MercuryExtension;

impl zed::Extension for MercuryExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        if let Some(command) = worktree.which(SERVER_COMMAND) {
            return Ok(zed::Command {
                command,
                args: vec!["--stdio".to_string()],
                env: Default::default(),
            });
        }

        if !Path::new(SERVER_PATH).is_file() {
            return Err(format!(
                "Mercury language server not found: install '{SERVER_COMMAND}' on PATH or build {SERVER_PATH}"
            ));
        }

        Ok(zed::Command {
            command: zed::node_binary_path()?,
            args: vec![SERVER_PATH.to_string(), "--stdio".to_string()],
            env: Default::default(),
        })
    }
}

zed::register_extension!(MercuryExtension);
