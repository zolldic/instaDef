chrome.runtime.onInstalled.addListener(async () => {
  // reload the extention automatically.
  chrome.commands.onCommand.addListener((shortcut) => {
    if (shortcut.includes("+Q")) {
      chrome.runtime.reload();
    }
  });

  // create a context menu
  chrome.contextMenus.create({
    id: "translate",
    title: "Translate this word",
    type: "normal",
    documentUrlPatterns: ["file://*"],
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "explain",
    title: "explain this topic",
    type: "normal",
    documentUrlPatterns: ["file://*"],
    contexts: ["selection"],
  });
});

// chrome.contextMenus.onClicked.addListener(async (info, tab) => {});
