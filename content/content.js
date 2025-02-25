// modal
const createModal = (content) => {
  // explain modal
  const explainTemplate = `
    <div id="customModal" class="modal">
      <div class="modal__content">
        <div class="modal__content--body">
          <p id="modalBody">${content}</p>
        </div>
        <div class="modal__content--footer">
          <span id="close">&times;</span>
        </div>
      </div>
    </div>
`;

  return document.createRange().createContextualFragment(explainTemplate);
};

// listen for message from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // create the modal
  const modal = createModal(request.data);
  // add the modal to the DOM
  document.body.append(modal);
  // open the modal
  document.getElementById("customModal").style.display = "flex"; // Show modal

  // close the modal
  document.getElementById("close").addEventListener("click", () => {
    document.getElementById("customModal").style.display = "none"; // Hide modal
  });
});
