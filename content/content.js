chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "translate") {
    console.log(`message from background: Translate`);
  }
  if (request.action === "explain") {
    console.log(`message from background: Translate`);
  }
});
