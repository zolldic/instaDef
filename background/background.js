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
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "explain",
    title: "explain this topic",
    type: "normal",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // send to content script

  const action = "translate";

  await chrome.tabs.query(
    { active: true, currentWindow: true },
    async (tabs) => {
      await chrome.tabs.sendMessage(tabs[0].id, { action });
    }
  );
});
