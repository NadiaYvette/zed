use std::path::Path;
use zed_extension_api::{self as zed, LanguageServerId, Result};

const SERVER_PATH: &str = "/home/nyc/src/mercury-vscode-plugin/out/server.js";

struct MercuryExtension;

impl zed::Extension for MercuryExtension {
    fn new() -> Self {
        Self
    }

    fn language_server_command(
        &mut self,
        _language_server_id: &LanguageServerId,
        _worktree: &zed::Worktree,
    ) -> Result<zed::Command> {
        if !Path::new(SERVER_PATH).is_file() {
            return Err(format!(
                "Mercury language server not found at {SERVER_PATH}; run `npm install --include=dev && npm run build` in /home/nyc/src/mercury-vscode-plugin"
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
