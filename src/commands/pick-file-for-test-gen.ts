import vscode from "vscode";

import { ICodeFile } from "../types";

export default function getPickFilesForTestGenCmd(filesList: ICodeFile[]) {
  const disposable = vscode.commands.registerCommand(
    "ai-test-generator.quickPick",
    () => {
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = filesList.map((file, index) => ({
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
              const testFile = `${testFolder}/${
                fileName.split(".js")[0]
              }.test.js`;
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

  return disposable;
}
