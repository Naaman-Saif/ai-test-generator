import vscode from "vscode";

import { ICodeFile } from "../types";

export default function getReadProjectFilesCmd(filesList: ICodeFile[]) {
  const disposable = vscode.commands.registerCommand(
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
              filesList.push(codeFile);
            })
          );

          Promise.all(promises).then(() => {
            console.log(filesList);
            vscode.window.showInformationMessage("All files read!");
          });
        },
        (err) => {
          console.error(err);
        }
      );
    }
  );

  return disposable;
}
