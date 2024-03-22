// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { ICodeFile } from "./types";
import getReadProjectFilesCmd from "./commands/read-project-files";
import getPickFilesForTestGenCmd from "./commands/pick-file-for-test-gen";
import getCreateTestGenFileCmd from "./commands/create-test-gen-file";
import getOpenChatPanelCmd from "./commands/open-chat-panel";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ai-test-generator" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const codeFileContents: ICodeFile[] = [];

  const readProjectFilesCmd = getReadProjectFilesCmd(codeFileContents);
  const pickFilesForTestGenCmd = getPickFilesForTestGenCmd(codeFileContents);
  const createTestGenFileCmd = getCreateTestGenFileCmd(codeFileContents[0]);
  const openChatPanelCmd = getOpenChatPanelCmd(context);

  context.subscriptions.push(
    readProjectFilesCmd,
    pickFilesForTestGenCmd,
    createTestGenFileCmd,
    openChatPanelCmd
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
