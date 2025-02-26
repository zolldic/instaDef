// modal
const createModal = () => {
  // explain modal

  /**
   * this function should inject templates into the dom
   * based on the actions (translate, explain)
   * inside model__content--body, the response from the AI
   */
  const explainTemplate = `
    <div id="customModal" class="modal">
      <div class="modal__content">
        <div class="modal__content--body" id="modalBody">
        </div>
        <div class="modal__content--footer">
          <span id="close">&times;</span>
        </div>
      </div>
    </div>
`;

  return document.createRange().createContextualFragment(explainTemplate);
};

// when the webpage dom load
// add the modal to the page
document.body.onload = () => {
  const modal = createModal();
  document.body.append(modal);
};

// listen for message from background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // add the data to the modal
  document.getElementById("modalBody").append(request.data);

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
});

function open() {
  document.getElementById("customModal").style.display = "flex"; // Show modal
}

function close() {
  document.getElementById("customModal").style.display = "none"; // Hide modal
}
