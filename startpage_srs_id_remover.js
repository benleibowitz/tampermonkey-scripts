// ==UserScript==
// @name         Startpage - Remove Google Merchant Center Tracking Parameters
// @version      1.0.0
// @description  Remove Google Merchant Center query parameters from links and their corresponding text on Startpage.com results
// @namespace    August4067
// @author       August4067
// @match        https://www.startpage.com/*
// @license      MIT
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
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

/**
 * @see {@link https://support.google.com/merchants/answer/14166401?hl=en}
 */
function removeSrsltidParam(url) {
  let urlObj = new URL(url);

  if (urlObj.searchParams.has("srsltid")) {
    urlObj.searchParams.delete("srsltid");
    return urlObj.toString();
  }

  return url;
}

function cleanUpLinks() {
  console.debug("Cleaning up links");
  const wgl = document.querySelector("div[class='w-gl']");
  const links = wgl.querySelectorAll("a");

  links.forEach((link) => {
    const originalHref = link.href;
    const newHref = removeSrsltidParam(originalHref);

    if (newHref !== originalHref) {
      console.debug(`Removing srsltid: ${originalHref}`);
      link.href = newHref;
      var linkText = link.querySelector('span[class="link-text"]');
      if (linkText) {
        linkText.innerText = newHref;
      }
      link.ariaLabel = newHref;
      console.debug(`Result: ${newHref}`);
    }
  });
  console.debug("Cleaned up links");
}

(function () {
  "use strict";
  waitForKeyElements("section[id='main']", function (nodes) {
    cleanUpLinks();
  });
})();
