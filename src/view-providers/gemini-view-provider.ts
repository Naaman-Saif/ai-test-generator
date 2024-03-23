import vscode from "vscode";

export default class GeminiViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = "gem.chatView";
  private _view?: vscode.WebviewView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    // this._view = webviewView;

    // webviewView.webview.options = {
    //   enableScripts: true,
    //   localResourceRoots: [this._extensionUri],
    // };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
			</head>
			<body>
                <h1>hi mom</h1>
				<input type="text" id="prompt-input" />

				<div id="response">
				</div>
			</body>
			</html>`;
  }
}
