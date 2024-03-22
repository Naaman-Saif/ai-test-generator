import vscode from "vscode";

import { ICodeFile } from "../types";

export default function getCreateTestGenFileCmd(fileCode: ICodeFile) {
  const disposable = vscode.commands.registerCommand(
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
        body: JSON.stringify({ inputCode: fileCode }),
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

  return disposable;
}
