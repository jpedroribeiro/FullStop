// chrome.action.onClicked.addListener((tab) => {
//   chrome.action.setTitle({
//     title: `JavaScript Stopped - Refresh the page to resume JavaScript support`
//   });
//   chrome.action.setBadgeText({text: '❌'});
//   chrome.action.setBadgeBackgroundColor({color: '#444444'});
// });

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    // Set or reset the extension title after the page refresh
    chrome.action.setTitle({
      tabId: tabId,
      title: 'Click to stop all JavaScript running on the page',
    });
    chrome.action.setBadgeText({
      tabId: tab.id, text: ''
    });
  }
});

chrome.action.onClicked.addListener(async function () {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab) {
    return;
  }

  const curBadgeText = await chrome.action.getBadgeText({ tabId: tab.id });

  if(curBadgeText!=='') {
    // Has already stopped JS
    chrome.tabs.reload(tab.id);
    return;
  }

  // Has not stopped JS yet, so stop it

  chrome.action.setTitle({
    tabId: tab.id,
    title: `JavaScript Stopped - Refresh the page to resume JavaScript support`
  });
  chrome.action.setBadgeText({
    tabId: tab.id, text: '❌'
  });
  chrome.action.setBadgeBackgroundColor({
    tabId: tab.id, color: '#444444'
  });


  chrome.scripting.executeScript({
    target: {tabId: tab.id, allFrames: true},
    func: exit,
  });
});


function exit() {
  "use strict";
  window.addEventListener(
    "error",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );

  let handlers = [
    "copy",
    "cut",
    "paste",
    "beforeunload",
    "blur",
    "change",
    "click",
    "contextmenu",
    "dblclick",
    "focus",
    "keydown",
    "keypress",
    "keyup",
    "mousedown",
    "mousemove",
    "mouseout",
    "mouseover",
    "mouseup",
    "resize",
    "scroll",
    "selectstart",
    "DOMNodeInserted",
    "DOMNodeRemoved",
    "DOMNodeRemovedFromDocument",
    "DOMNodeInsertedIntoDocument",
    "DOMAttrModified",
    "DOMCharacterDataModified",
    "DOMElementNameChanged",
    "DOMAttributeNameChanged",
    "DOMActivate",
    "DOMFocusIn",
    "DOMFocusOut",
    "online",
    "offline",
    "input",
    "abort",
    "close",
    "drop",
    "dragstart",
    "drag",
    "load",
    "paint",
    "reset",
    "select",
    "submit",
    "unload",
  ];

  function eventHandler(e) {
    e.stopPropagation();
    // e.preventDefault(); // Stop for the form controls, etc., too?
  }

  for (let i = 0; i < handlers.length; i++) {
    window.addEventListener(handlers[i], eventHandler, true);
  }

  if (window.stop) {
    window.stop();
  }


  throw "";
}