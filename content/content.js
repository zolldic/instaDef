


// modal template
const createModal = (content) => {
  const template = `
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

  return document.createRange().createContextualFragment(template);
};


// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {})



