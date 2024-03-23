(function () {
  const vscode = acquireVsCodeApi();
  let response = "";

  window.addEventListener("message", (event) => {
    const message = event.data;
    switch (message.type) {
      case "addResponse":
        response = message.value;
        break;
      case "setPrompt":
        document.getElementById("prompt").innerText = message.value;
        break;
    }
  });

  function fixCodeBlocks(response) {
    // Use a regular expression to find all occurrences of the substring in the string
    const REGEX_CODEBLOCK = new RegExp("```", "g");
    const matches = response.match(REGEX_CODEBLOCK);

    // Return the number of occurrences of the substring in the response, check if even
    const count = matches ? matches.length : 0;
    if (count % 2 === 0) {
      return response;
    } else {
      // else append ``` to the end to make the last code block complete
      return response.concat("\n```");
    }
  }

  function setResponse() {

  }
})();
