import vscode from "vscode";
import * as socketIO from "socket.io-client";
import { API_URL } from "./constants";

let socket: socketIO.Socket;

export function activate(context: vscode.ExtensionContext) {
  socket = socketIO.io(API_URL, {
    reconnectionDelayMax: 10000,
  });

  registerCommands(context);
}

function registerCommands(context: vscode.ExtensionContext) {
  const generateCmd = vscode.commands.registerCommand(
    "code-testify.generate",
    () => handleCommand("generate-test")
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

  context.subscriptions.push(generateCmd, showGenCodeCmd);
}

async function handleCommand(commandType: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const document = editor.document;
  const selection = editor.selection;
  const text = document.getText(selection);

  // Show progress notification
  vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Processing...",
      cancellable: false,
    },
    async (progress, token): Promise<void> => {
      const timeoutHandle = setTimeout(() => {
        progress.report({ increment: 100 });
      }, 3000); // Default hide after 3 seconds

      socket.emit(commandType, {
        fileName: document.fileName,
        input: text,
      });

      return new Promise((resolve) => {
        socket.once(commandType, (data) => {
          clearTimeout(timeoutHandle); // Clear the timeout as we got the response
          vscode.commands.executeCommand("code-testify.showGenCode", data);
          resolve();
        });
      });
    }
  );
}

export function deactivate() {
  if (socket) {
    socket.disconnect();
  }
}
