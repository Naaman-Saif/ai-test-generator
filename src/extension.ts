// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// import { ICodeFile } from "./types";
// import getReadProjectFilesCmd from "./commands/read-project-files";
// import getPickFilesForTestGenCmd from "./commands/pick-file-for-test-gen";
// import getCreateTestGenFileCmd from "./commands/create-test-gen-file";
// import getOpenChatPanelCmd from "./commands/open-chat-panel";
import GeminiViewProvider from "./view-providers/gemini-view-provider";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ai-test-generator" is now active!'
  );

  const geminiViewProvier = new GeminiViewProvider(context.extensionUri);

  const renderGeminiChatView = vscode.window.registerWebviewViewProvider(
    GeminiViewProvider.viewType,
    geminiViewProvier,
    { webviewOptions: { retainContextWhenHidden: true } }
  );

  // const codeFileContents: ICodeFile[] = [];

  // const readProjectFilesCmd = getReadProjectFilesCmd(codeFileContents);
  // const pickFilesForTestGenCmd = getPickFilesForTestGenCmd(codeFileContents);
  // const createTestGenFileCmd = getCreateTestGenFileCmd(codeFileContents[0]);
  // const openChatPanelCmd = getOpenChatPanelCmd(context);

  context.subscriptions.push(
    renderGeminiChatView,
    // readProjectFilesCmd,
    // pickFilesForTestGenCmd,
    // createTestGenFileCmd,
    // openChatPanelCmd
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
