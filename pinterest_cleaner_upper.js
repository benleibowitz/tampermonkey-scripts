// ==UserScript==
// @name         Pinterest Cleaner Upper
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Clean up Pinterest
// @author       BL
// @match        https://www.pinterest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinterest.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @sandbox      Javascript
// ==/UserScript==
/* global $, waitForKeyElements */

"use strict";

function waitAndRemove(toRemove) {
  waitForKeyElements(toRemove, function (node) {
    node.remove();
  });
}

function stopVideos(ignored) {
  var videos = document.getElementsByTagName("video");
  for (var i = 0; i < videos.length; i++) {
    var video = videos[i];

    var pic = document.createElement("img");
    pic.src = video.poster;
    video.parentElement.appendChild(pic);
    video.remove();
    console.debug("Converted video to pic");
  }
}

function cleanDescription(node) {
  document
    .querySelector('div[data-test-id="maybe-clickthrough-link"]')
    ?.remove();
  document
    .querySelector('div[data-test-id="creator-card-profile"]')
    ?.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

function cleanComments(node) {
  waitForKeyElements(
    'div[data-test-id="description-content-container"]',
    function (node) {
      document
        .querySelector('div[data-test-id="description-content-container"]')
        ?.children[1]?.remove();
    },
  );
  waitForKeyElements('div[class="jzS ujU un8 C9i TB_"]', function (node) {
    node[0].remove();
  });
}

function cleanFooter(node) {
  document.getElementsByClassName("footerButtons")[0].firstChild.remove();
}

function cleanShopButtonsFromBoard(node) {
  var buttons = document.querySelector('div[data-test-id="board-tools"]')
    .firstChild.children;

  var idx = 0;
  var buttonsLength = buttons.length;
  for (var i = 0; i < buttonsLength; i++) {
    if (buttons[idx].textContent.toLowerCase() != "organize") {
      console.debug("Removing button: " + buttons[idx].textContent);
      buttons[idx].remove();
    } else {
      idx++;
    }
  }
}

function cleanPicture(node) {
  var photoContainer = document.querySelector(
    'div[data-test-id="visual-content-container"]',
  );
  if (
    photoContainer.querySelector('div[data-test-id="carousel-pin"]') != null
  ) {
    return;
  }
  var descriptionContainer = document.querySelector(
    'div[data-test-id="description-content-container"]',
  );
  var photoContainerParentElement = photoContainer.parentElement;
  var photoURL = document.querySelector('div[data-test-id="closeup-image"]')
    .firstChild.firstChild.children[1].firstChild.firstChild.src;
  var photoIMG = document.createElement("img");
  photoIMG.setAttribute("src", photoURL);

  photoContainerParentElement.insertBefore(
    photoIMG,
    photoContainerParentElement.childNodes[0],
  );
  photoContainer.remove();
}

function cleanWelcomeBackModal(node) {
  var docs = node;
  if (docs.length == 1) {
    docs[0].remove();
    console.debug('Cleaned "welcome back" modal');
  }
}

function cleanProductInfo(node) {
  node[0].parentElement.parentElement.parentElement.remove();
}

function cleanShopByBannerAtTopOfBoard() {
  waitForKeyElements('div[data-test-id="sf-header-heading"]', function (node) {
    node[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
  });
}

function cleanShoppingAds() {
  const shoppingAdDivs = document.querySelectorAll(
    "div.Ch2.zDA.IZT.CKL.tBJ.dyH.iFc.GTB.H2s",
  );

  shoppingAdDivs.forEach((adDiv) => {
    let parent = adDiv.closest('div[role="listitem"]');
    if (parent) {
      parent.remove();
      console.debug("Removed shopping container");
    }
  });
}

function cleanIdeasYouMightLove() {
  const listItems = document.querySelectorAll('div[role="listitem"]');

  listItems.forEach((item) => {
    if (
      item.textContent.includes("Ideas you might love") ||
      item.textContent.includes("Shop similar")
    ) {
      item.remove();
      console.debug('Removed "Ideas you might love" item:', item);
    }
  });
}

function cleanPinFooters() {
  // Select all divs with the data-test-id="pinrep-footer"
  const pinFooters = document.querySelectorAll(
    'div[data-test-id="pinrep-footer"]',
  );

  pinFooters.forEach((footer) => {
    const shoppableIndicator = footer.querySelector(
      '[aria-label="Shoppable Pin indicator"]',
    );

    if (shoppableIndicator) {
      const parentPinDiv = footer.closest('div[data-test-id="pin"]');

      if (parentPinDiv) {
        parentPinDiv.remove();
        console.debug("Removed shoppable pin:", parentPinDiv);
      }
    } else {
      footer.remove();
      console.debug("Removed pin footer:", footer);
    }
  });
}

function cleanRelatedPins() {
  setTimeout(() => {
    cleanIdeasYouMightLove();
    cleanShoppingAds();
    cleanPinFooters();
  }, 1050);
}

function removeBellIcon() {
  const bellIconDiv = document.querySelector('div[data-test-id="bell-icon"]');
  if (bellIconDiv) {
    bellIconDiv.remove();
    console.debug("Removed bell icon from navbar.");
  }
}

function removeMessagesIcon() {
  const messagesIconDiv = document.querySelector('div[aria-label="Messages"]');
  if (messagesIconDiv) {
    var messagesParent = messagesIconDiv.closest(
      'div[class="XiG zI7 iyn Hsu"]',
    );
    messagesParent?.remove();
    console.debug("Removed messages button");
  }
}

function cleanNavBar() {
  removeBellIcon();
  removeMessagesIcon();
}

function observeNavBar() {
  const observer = new MutationObserver(() => {
    cleanNavBar();
  });

  observer.observe(document.getElementById("HeaderContent"), {
    childList: true,
    subtree: true,
  });

  cleanNavBar();
}

function clean() {
  console.log("Cleaning up Pinterest");

  observeNavBar();

  var currentURL = window.location.href;
  waitForKeyElements('div[role="list"]', function (node) {
    stopVideos(node);
    var observer = new MutationObserver(stopVideos);
    observer.observe(document.querySelector('div[role="list"]'), {
      attributes: true,
      childList: true,
      characterData: false,
      subtree: false,
    });
  });

  waitForKeyElements(
    'div[data-test-id="creator-card-profile"]',
    function (node) {
      var observer = new MutationObserver(cleanDescription);
      observer.observe(
        document.querySelector('div[data-test-id="creator-card-profile"]'),
        {
          attributes: false,
          childList: true,
          characterData: false,
          subtree: false,
        },
      );
      cleanDescription(node);
    },
  );

  waitForKeyElements('div[data-test-id="canonical-card"]', function (node) {
    var observer = new MutationObserver(cleanComments);
    observer.observe(
      document.querySelector('div[data-test-id="canonical-card"]'),
      {
        attributes: false,
        childList: true,
        characterData: false,
        subtree: false,
      },
    );
    cleanComments(node);
  });

  waitForKeyElements('div[class="footerButtons"]', function (node) {
    cleanFooter(node);
  });

  waitForKeyElements('div[data-test-id="board-tools"]', function (node) {
    cleanShopButtonsFromBoard(node);
  });

  waitForKeyElements('div[data-test-id="user-rep-avatar"]', function (node) {
    node[0].remove();
  });

  waitForKeyElements(
    'div[data-test-id="visual-content-container"]',
    function (node) {
      cleanPicture(node);
    },
  );

  waitForKeyElements(
    'div[class="ALa Jea LCN Lej Rym _he gjz mQ8 ojN p6V urM zI7 iyn Hsu"]',
    function (node) {
      cleanWelcomeBackModal(node);
    },
  );
  waitForKeyElements(
    'div[class="ALa Jea KS5 LCN Lej Rym _he mQ8 ojN p6V urM zI7 iyn Hsu"]',
    function (node) {
      cleanWelcomeBackModal(node);
    },
  );

  waitForKeyElements('div[data-test-id="product-price"]', function (node) {
    cleanProductInfo(node);
  });

  waitForKeyElements('div[class="Module"]', function (node) {
    node[0].remove();
  });

  waitAndRemove('div[class="MMr kKU zI7 iyn Hsu"]');
  waitAndRemove('div[data-test-id="related-domain-carousel"]');
  waitAndRemove('div[data-test-id="closeup-action-items"]');
  cleanShopByBannerAtTopOfBoard();

  waitForKeyElements('div[class="hs0 ujU un8 C9i TB_"]', function (nodes) {
    var promotedRegex = new RegExp(
      "([.][a-zA-Z0-9]{5}:befores*.*[Promoted].*){7}",
    );
    for (var i = 0; i < nodes.length; i++) {
      if (promotedRegex.test(nodes[i].textContent)) {
        var parentListItem = nodes[i].closest('div[role="listitem"]');
        parentListItem.remove();
        /*
                 var matrix = new WebKitCSSMatrix(window.getComputedStyle(parentListItem).transform);
                 var targetXCoord = matrix.e;
                 var current = nodes[i];
                 current = current.previousSibling;
                 while (current != null) {
                     var currentXCoord = new WebKitCSSMatrix(window.getComputedStyle(current).transform).matrix.e;
                     if (currentXCoord == targetXCoord) {
                         console.log('Removed promoted pin');
                         current.remove();
                         break;
                     }
                     current = current.previousSibling;
                 }
                 */
      }
    }
  });

  waitForKeyElements('div[data-test-id="pinrep-footer"]', function (nodes) {
    cleanPinFooters();
  });

  cleanRelatedPins();

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (
            node.matches("div.Ch2.zDA.IZT.CKL.tBJ.dyH.iFc.GTB.H2s") ||
            node.querySelector("div.Ch2.zDA.IZT.CKL.tBJ.dyH.iFc.GTB.H2s") ||
            node.textContent.includes("Ideas you might love") ||
            node.textContent.includes("Shop similar")
          ) {
            cleanRelatedPins();
          }
        }
      });
    });
  });

  observer.observe(document.querySelector('div[data-test-id="relatedPins"]'), {
    childList: true,
    subtree: true,
  });
}

let lastUrl = window.location.href;
setInterval(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    clean();
  }
}, 1000);

clean();
