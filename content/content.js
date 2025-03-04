/**
 * Modal Service for creating, managing, and injecting a modal element.
 */
class ModalService {
  /**
   * Constructs a new ModalService instance.
   */
  constructor() {
    this.modal = null;
    this.modalBody = null;
    this.closeButton = null;
    this.init();
  }

  /**
   * Initializes the modal service by creating and injecting the modal.
   * @private
   */
  init() {
    this.createModal();
    this.injectModal();
    this.setupEventListeners();
  }

  /**
   * Creates the modal element as a DocumentFragment.
   * @private
   */
  createModal() {
    const template = document.createElement("template");
    template.innerHTML = `
        <div id="customModal" class="modal" style="display: none;">
          <div class="modal__content">
            <div class="modal__body" id="modalBody"></div>
            <div class="modal__footer">
              <span id="close" class="modal__close">&times;</span>
            </div>
          </div>
        </div>
      `;

    const fragment = template.content.cloneNode(true);
    this.modal = fragment.querySelector("#customModal");
    this.modalBody = fragment.querySelector("#modalBody");
    this.closeButton = fragment.querySelector("#close");
  }

  /**
   * Injects the modal element into the document body.
   * @private
   */
  injectModal() {
    document.body.appendChild(this.modal);
  }

  /**
   * Sets up event listeners for the modal.
   * @private
   */
  setupEventListeners() {
    if (this.closeButton) {
      this.closeButton.addEventListener("click", () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener("click", (event) =>
        this.handleOutsideClick(event)
      );
    }
  }

  /**
   * Handles clicks outside the modal content to close the modal.
   * @private
   * @param {MouseEvent} event - The click event.
   */
  handleOutsideClick(event) {
    if (event.target === this.modal) {
      this.close();
    }
  }

  /**
   * Opens the modal.
   */
  open() {
    if (this.modal) {
      this.modal.style.display = "flex";
    }
  }

  /**
   * Closes the modal.
   */
  close() {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  }

  /**
   * Updates the modal content with the provided data.
   *
   * @param {Array<object>} data - The data to display in the modal.
   */
  updateContent(data) {
    if (!this.modalBody || !Array.isArray(data) || data.length === 0) {
      return;
    }

    const modalContent = `
        <h2>${data[0].word}</h2>
        <p>${data[0].definitions[0]}</p>
      `;

    this.modalBody.innerHTML = modalContent;
  }
}

// Instantiate the ModalService
const modalService = new ModalService();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
  if (Array.isArray(request.data)) {
    modalService.updateContent(request.data);
    modalService.open();
  }
});
