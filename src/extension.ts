// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";
import path from "path";

interface ICodeFile {
  path: string;
  content: string;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ai-test-generator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json

  const codeFileContents: ICodeFile[] = [];

  let disposable = vscode.commands.registerCommand(
    "ai-test-generator.readFile",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      // vscode.window.showInformationMessage('Hello World from ai-test-generator!');

      // read js files from workspace and ignore node modules
      vscode.workspace.findFiles("**/*.js", "**/node_modules/**").then(
        (uris): void => {
          const promises = uris.map((uri) =>
            vscode.workspace.openTextDocument(uri).then((doc) => {
              const text = doc.getText();
              const filePath = doc.fileName;
              // Get the workspace root path
              const workspaceRoot =
                vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
              const projectName = workspaceRoot?.split("/").pop();

              // Replace the workspace root path from the file path
              const relativePath = filePath.replace(
                workspaceRoot,
                projectName || ""
              );

              // console.log(`FilePath: ${relativePath}\n${text}\n\n`);
              const codeFile: ICodeFile = { path: relativePath, content: text };
              codeFileContents.push(codeFile);
            })
          );

          Promise.all(promises).then(() => {
            console.log(codeFileContents);
            vscode.window.showInformationMessage("All files read!");
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }
  );

  const quickPickCommand = vscode.commands.registerCommand(
    "ai-test-generator.quickPick",
    () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = codeFileContents.map((file, index) => ({
        label: file.path,
        content: file.content,
      }));
      quickPick.onDidChangeSelection(([item]) => {
        if (item) {
          quickPick.dispose();
          vscode.window.withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "Generating test file...",
              cancellable: false,
            },
            async (progress) => {
              const workspaceRoot =
                vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
              const projectName = workspaceRoot?.split("/").pop();
              const testFolder = `${workspaceRoot}/tests`;
              const fileName = item.label.split("/").pop() || "";
              const testFile = `${testFolder}/${fileName.split(".js")[0]}.test.js`;
              const fileContent = await fetch("http://localhost:8000/gemAI", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  inputCode: (item as unknown as ICodeFile).content,
                }),
              }).then((res) => res.text());

              vscode.workspace.fs
                .createDirectory(vscode.Uri.file(testFolder))
                .then(() => {
                  vscode.workspace.fs
                    .writeFile(
                      vscode.Uri.file(testFile),
                      Buffer.from(fileContent, "utf-8")
                    )
                    .then(() => {
                      vscode.window.showInformationMessage(
                        `File created at ${testFile}`
                      );
                    });
                });

              vscode.window.showInformationMessage(
                "Created test file for ",
                item.label
              );
            }
          );
        }
      });
      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }
  );

  const writeFileCommand = vscode.commands.registerCommand(
    "ai-test-generator.writeFile",
    async () => {
      // create a *.test.js file in a folder called tests in root directory
      const workspaceRoot =
        vscode.workspace.workspaceFolders?.[0].uri.fsPath || "";
      const projectName = workspaceRoot?.split("/").pop();
      const testFolder = `${workspaceRoot}/gemAI-tests`;
      const testFile = `${testFolder}/gemAI.test.js`;
      const fileContent = await fetch("http://localhost:8000/gemAI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputCode: codeFileContents[0] }),
      }).then((res) => res.text());

      vscode.workspace.fs
        .createDirectory(vscode.Uri.file(testFolder))
        .then(() => {
          vscode.workspace.fs
            .writeFile(
              vscode.Uri.file(testFile),
              Buffer.from(fileContent, "utf-8")
            )
            .then(() => {
              vscode.window.showInformationMessage(
                `File created at ${testFile}`
              );
            });
        });

      vscode.window.showInformationMessage("Created test file!");
    }
  );

  const createChatPanel = vscode.commands.registerCommand('ai-test-generator.createChatPanel', () => {
    const chatPanel = vscode.window.createWebviewPanel(
      "gemTestChatPanel",
      "Chat Window",
      vscode.ViewColumn.Two,
      { enableScripts: true }
    );
  
    // grab index.html from src/chat-panel/index.html and display it in the chatPanel
    chatPanel.webview.html = fs.readFileSync(path.join(context.extensionPath, 'src/chat/index.html'), 'utf-8');
  });

  context.subscriptions.push(disposable, writeFileCommand, quickPickCommand, createChatPanel);
}

// This method is called when your extension is deactivated
export function deactivate() {}
