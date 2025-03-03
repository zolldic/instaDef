/**
 * Creates a modal element and returns it as a DocumentFragment.
 *
 * @function createModal
 * @returns {DocumentFragment} The modal element as a DocumentFragment.
 */

function createModal() {
  const TEMPLATES = {
    explain: `
      <div id="customModal" class="modal">
          <div class="modal__content">
              <div class="modal__body" id="modalBody"></div>
              <div class="modal__footer">
                  <span id="close" class="modal__close">&times;</span>
              </div>
          </div>
      </div>`,
  };

  return document.createRange().createContextualFragment(TEMPLATES.explain);
}

/**
 * Opens the modal by setting its display style to "flex".
 *
 * @function open
 */

function open() {
  document.getElementById("customModal").style.display = "flex"; // Show modal
}

/**
 * Closes the modal by setting its display style to "none".
 *
 * @function close
 */

function close() {
  document.getElementById("customModal").style.display = "none"; // Hide modal
}

/**
 * Adds the modal to the page.
 *
 * @function injectModel
 */

function injectModel() {
  const modal = createModal();
  document.body.append(modal);
}

// inject the modal on DOM load
document.body.onload = injectModel();

// listen for message from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // add the data to the modal

  if (request.data) {
    document.getElementById("modalBody").innerHTML = request.data;

    // open the modal
    open();

    // close the modal from the X button
    document.getElementById("close").addEventListener("click", () => {
      close();
    });

    // close the modal when click outside
    document.getElementById("customModal").addEventListener("click", () => {
      close();
    });
  }
});
