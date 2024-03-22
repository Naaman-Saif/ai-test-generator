import vscode from "vscode";
import fs from "fs";
import path from "path";

export default function getOpenChatPanelCmd(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "ai-test-generator.createChatPanel",
    () => {
      const chatPanel = vscode.window.createWebviewPanel(
        "gemTestChatPanel",
        "Chat Window",
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );

      // grab index.html from src/chat-panel/index.html and display it in the chatPanel
      chatPanel.webview.html = fs.readFileSync(
        path.join(context.extensionPath, "src/chat/index.html"),
        "utf-8"
      );
    }
  );

  return disposable;
}
