// setup container elements

document.addEventListener("DOMContentLoaded", async (e) => {
  setUpcontainer();
  const message = await fetchContent();
  updateText(message);
});

async function fetchContent() {
  await chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    const data = request.data;
    return data;
  });
}

function setUpcontainer() {
  const body = document.body;
  const container = document.createElement("div");
  const box = document.createElement("div");

  container.classList.add("container");
  box.classList.add("container__box");

  container.append(box);
  body.append(container);
}

function updateText(content) {}
