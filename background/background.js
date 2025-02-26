import getTranslation from "./translation.js";
import getExplaination from "./explain.js";
import { getActiveTab, errorHandler } from "./utility.js";

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
    title: "Translate (%s)",
    type: "normal",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });

  chrome.contextMenus.create({
    id: "explain",
    title: "Explain (%s)",
    type: "normal",
    documentUrlPatterns: ["<all_urls>"],
    contexts: ["selection"],
  });
});

// listen for menu clicks
chrome.contextMenus.onClicked.addListener(async (info) => {
  // get active tab
  const activeTab = await getActiveTab({ active: true, currentWindow: true });

  // inject the content script
  if (activeTab.url.includes("chrom://")) {
    return;
  } else {
    await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      files: ["content.js"],
    });
    console.log("injecting content script");
  }

  if (info.menuItemId === "translate") {
    try {
      await getTranslation(info.selectionText);
    } catch (error) {
      console.error(error);
      errorHandler({
        title: "Extension Error",
        msg: "Failed to send data. Please try again or refresh the page.",
      });
    }
  }

  if (info.menuItemId === "explain") {
    try {
      const data = await getExplaination(info.selectionText);

      // send data to content script
      await chrome.tabs.sendMessage(activeTab.id, { data });
    } catch (error) {
      console.error(error);
      errorHandler({
        title: "Extension Error",
        msg: "Failed to send data. Please try again or refresh the page.",
      });
    }
  }
});
