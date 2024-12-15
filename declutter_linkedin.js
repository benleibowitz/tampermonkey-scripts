// ==UserScript==
// @name         Declutter LinkedIn
// @namespace    August4067
// @version      0.0.1-dev
// @description  Clean up clutter on LinkedIn
// @license      MIT
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/

// Pulled from: https://gist.github.com/raw/2625891/waitForKeyElements.js
function waitForKeyElements(
  selectorTxt /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */,
  actionFunction /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */,
  bWaitOnce /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */,
  iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */,
) {
  var targetNodes, btargetsFound;

  if (typeof iframeSelector == "undefined") targetNodes = $(selectorTxt);
  else targetNodes = $(iframeSelector).contents().find(selectorTxt);

  if (targetNodes && targetNodes.length > 0) {
    btargetsFound = true;
    /*--- Found target node(s).  Go through each and act if they
            are new.
        */
    targetNodes.each(function () {
      var jThis = $(this);
      var alreadyFound = jThis.data("alreadyFound") || false;

      if (!alreadyFound) {
        //--- Call the payload function.
        var cancelFound = actionFunction(jThis);
        if (cancelFound) btargetsFound = false;
        else jThis.data("alreadyFound", true);
      }
    });
  } else {
    btargetsFound = false;
  }

  //--- Get the timer-control variable for this selector.
  var controlObj = waitForKeyElements.controlObj || {};
  var controlKey = selectorTxt.replace(/[^\w]/g, "_");
  var timeControl = controlObj[controlKey];

  //--- Now set or clear the timer as appropriate.
  if (btargetsFound && bWaitOnce && timeControl) {
    //--- The only condition where we need to clear the timer.
    clearInterval(timeControl);
    delete controlObj[controlKey];
  } else {
    //--- Set a timer, if needed.
    if (!timeControl) {
      timeControl = setInterval(function () {
        waitForKeyElements(
          selectorTxt,
          actionFunction,
          bWaitOnce,
          iframeSelector,
        );
      }, 300);
      controlObj[controlKey] = timeControl;
    }
  }
  waitForKeyElements.controlObj = controlObj;
}

function removeNotificationBadge() {
  waitForKeyElements("#ember16", function (node) {
    var notifications = document
      .getElementById("ember16")
      .getElementsByClassName("notification-badge");
    if (notifications.length == 1) {
      notifications[0].remove();
    }
  });

  waitForKeyElements(".notification-badge", function (node) {
    node.remove();
  });
}

function removeProfilePrompts() {
  waitForKeyElements("#promo", function (node) {
    node[0].parentElement.remove();
  });
  waitForKeyElements("#guidance", function (node) {
    node[0].parentElement.remove();
  });
  waitForKeyElements("#resources", function (node) {
    node[0].parentElement.remove();
  });
}

function removeRightSidebar() {
  waitForKeyElements('aside[aria-label="LinkedIn News"]', function (node) {
    node.remove();
  });
}

function removeUpsellLinks() {
  waitForKeyElements(".premium-upsell-link--extra-long", function (nodes) {
    nodes.remove();
  });
  waitForKeyElements(".premium-upsell-link", function (nodes) {
    nodes[0].remove();
  });
  waitForKeyElements(
    'span[class="global-nav__secondary-premium-cta-text"]',
    function (nodes) {
      nodes[0].parentElement.parentElement.parentElement.remove();
    },
  );
  waitForKeyElements(
    'span[class="feed-identity-module__premium-cta-text"]',
    function (nodes) {
      nodes[0]?.closest('div[class^="artdeco-card"]')?.remove();
    },
  );
}

function removeRightSidebarOnProfile() {
  waitForKeyElements(".scaffold-layout__aside", function (node) {
    node[0].remove();
  });
}

function removeForBusinessDropDown() {
  document.querySelector('span[title="For Business"]')?.closest("li")?.remove();
}

(function () {
  "use strict";

  removeNotificationBadge();
  removeRightSidebar();
  removeUpsellLinks();
  removeRightSidebarOnProfile();
  removeProfilePrompts();
  removeForBusinessDropDown();
})();
