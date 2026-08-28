# Mercury support for Zed

This extension provides Mercury language detection, Tree-sitter syntax highlighting,
editor snippets, and integration with the Mercury Language Plugin server.

## Local development

Build the Mercury Language Plugin in `~/src/mercury-vscode-plugin`:

```bash
npm install --include=dev
npm run build
```

The extension first looks for an executable named `mercury-language-server` on the
worktree `PATH`. A local wrapper can be installed as:

```sh
#!/bin/sh
exec node "$HOME/src/mercury-vscode-plugin/out/server.js" "$@"
```

Save it as `~/.local/bin/mercury-language-server`, make it executable, and ensure
`~/.local/bin` is in the environment used to launch Zed.

## Development installation

Run the source-built Zed binary from the Zed checkout:

```bash
cd ~/src/zed
export PATH="$HOME/.local/bin:$PATH"
./target/debug/zed ~/src/surd
```

Open **Extensions**, choose **Install Dev Extension**, and select:

```text
~/src/zed/extensions/mercury
```

If an older copy is installed, fully quit Zed and remove only the installed copy:

```bash
rm -rf ~/.local/share/zed/extensions/installed/mercury
```

Then install the development extension again.

## File detection

Mercury files with `.m` and `.moo` suffixes are supported. Files with a leading
comment prologue are recognized when a later line contains a Mercury module
 declaration such as:

```mercury
:- module example.
```

## Current LSP features

The bundled server currently advertises diagnostics, completion, hover, document
symbols, and text-document synchronization. Their quality depends on the Mercury
Language Plugin's compiler/indexing state and project configuration.
