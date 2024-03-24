import vscode from "vscode";
import * as socketIO from "socket.io-client";

let socket: socketIO.Socket;

export function activate(context: vscode.ExtensionContext) {
  socket = socketIO.io("http://localhost:3000", {
    reconnectionDelayMax: 10000,
  });

  const generateCmd = vscode.commands.registerCommand(
    "code-testify.generate",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the selected text
        const text = document.getText(selection);

        // Emit the socket event
        socket.emit("generate-test", {
          fileName: document.fileName,
          input: text,
        });
      }
    }
  );

  const showGenCodeCmd = vscode.commands.registerCommand(
    "code-testify.showGenCode",
    (genCode: string) => {
      vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "Generating code...",
          cancellable: false,
        },
        async () => {
          const doc = await vscode.workspace.openTextDocument({
            language: "javascript",
            content: genCode,
          });

          vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.Beside,
            preview: false,
          });
        }
      );
    }
  );

  socket.on("generate-test", (data) => {
    vscode.commands.executeCommand("code-testify.showGenCode", data);
  });

  context.subscriptions.push(generateCmd, showGenCodeCmd);
}

export function deactivate() {
  if (socket) {
    socket.disconnect();
  }
}
