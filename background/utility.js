/**
 * Retrieves the active tab based on the provided query information.
 *
 * @param {Object} queryInfo - The query information to find the active tab.
 * @returns {Promise<Object>} A promise that resolves to the active tab object.
 */

function getActiveTab(queryInfo) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(queryInfo, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(tabs[0]);
      }
    });
  });
}

/**
 * Displays an error notification with the provided options.
 *
 * @param {Object} options - The options for the error notification.
 * @param {string} options.title - The title of the error notification.
 * @param {string} options.msg - The message of the error notification.
 */
function errorHandler(options) {
  chrome.notifications.create("Error", {
    type: "basic",
    iconUrl: "./icons/error.png",
    title: options.title,
    message: options.msg,
  });
}

export { getActiveTab, errorHandler };
