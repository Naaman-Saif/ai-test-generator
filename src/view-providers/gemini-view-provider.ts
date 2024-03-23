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
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "chat", "script.js"));

    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.jsdelivr.net/npm/@unocss/runtime/mini.global.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js"></script>
            </head>
            <body>
                <div id="container">
                    <div id="prompt" class="text-sm my-2">here can be your prompt</div>
                    <div id="response" class="text-sm my-2">here can be the response of gemini</div>
                    <div class="divide-solid h-0.25 bg-#fafafa"></div>
                    <div absolute bottom-5 right-0 left-0 text-center>
                        <textarea
                            id="prompt-input"
                            class="px-2 py-1 w-48 rounded-2 placeholder:text-#fafafa bg-gray text-#f9f9f9 font-sans focus:outline-none border-1 focus:border-blue transition-border-color"
                            placeholder="something to ask..."
                        ></textarea>
                    </div>
                </div>

                <script src="${scriptUri}"></script>
            </body>
            </html>`;
  }
}
