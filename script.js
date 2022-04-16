let eventValue = true;
let successValue = true;

function postMessageEvent() {
  window.parent.postMessage({ key: "isBellaWorking", value: eventValue }, "*");

  eventValue = !eventValue;
}

function postMessageSuccess() {
  window.parent.postMessage(
    { key: "isBellaSuccedded", value: successValue },
    "*"
  );

  successValue = !successValue;
}

const eventText = document.getElementById("event");
const successText = document.getElementById("success");
eventText.addEventListener("click", () => postMessageEvent());
successText.addEventListener("click", () => postMessageSuccess());
