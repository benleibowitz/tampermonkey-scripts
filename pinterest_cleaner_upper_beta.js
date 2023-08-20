// ==UserScript==
// @name         Pinterest Cleaner Upper
// @namespace    http://tampermonkey.net/
// @version      1.0
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

'use strict';

function waitAndRemove(toRemove) {
    waitForKeyElements(toRemove, function(node) {
        node.remove();
    });
}

function stopVideos(ignored) {
    var videos = document.getElementsByTagName('video');
    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];

        var pic = document.createElement('img');
        pic.src = video.poster;
        video.parentElement.appendChild(pic);
        video.remove();
        console.log('Converted video to pic');
    }
};

function cleanDescription(node) {
    document.querySelector('div[data-test-id="maybe-clickthrough-link"]').remove();
    document.querySelector('div[data-test-id="creator-card-profile"]').parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

function cleanComments(node) {
    waitForKeyElements('div[data-test-id="description-content-container"]', function(node) {
        document.querySelector('div[data-test-id="description-content-container"]').children[1].remove();

    });
    waitForKeyElements('div[class="jzS ujU un8 C9i TB_"]', function(node) {
        node[0].remove()
    });
}

function cleanFooter(node) {
    document.getElementsByClassName('footerButtons')[0].firstChild.remove();
}

function cleanShopButtonsFromBoard(node) {
    var buttons = document.querySelector('div[data-test-id="board-tools"]').firstChild.children;

    var idx = 0;
    var buttonsLength = buttons.length;
    for (var i = 0; i < buttonsLength; i++) {
        if (buttons[idx].textContent.toLowerCase() != 'organize') {
            console.log('Removing button: ' + buttons[idx].textContent);
            buttons[idx].remove();
        } else {
            idx++;
        }
    }
}

function cleanPicture(node) {
    var photoContainer = document.querySelector('div[data-test-id="visual-content-container"]');
    if (photoContainer.querySelector('div[data-test-id="carousel-pin"]') != null) {
        return;
    }
    var descriptionContainer = document.querySelector('div[data-test-id="description-content-container"]');
    var photoContainerParentElement = photoContainer.parentElement;
    var photoURL = document.querySelector('div[data-test-id="closeup-image"]').firstChild.firstChild.children[1].firstChild.firstChild.src;
    var photoIMG = document.createElement('img');
    photoIMG.setAttribute('src', photoURL);

    photoContainerParentElement.insertBefore(photoIMG, photoContainerParentElement.childNodes[0]);
    photoContainer.remove();
}

function cleanWelcomeBackModal(node) {
    var docs = node;
    if (docs.length == 1) {
        docs[0].remove();
        console.log('Cleaned "welcome back" modal');
    }
}

function cleanProductInfo(node) {
     node[0].parentElement.parentElement.parentElement.remove();
}

(function clean() {
    console.log('Running');
    setInterval(function() {
        document.title = "Pinterest";
    }, 1000);

    for (var i = 0; i < 3; i++) {
        document.querySelector('div[data-test-id="button-container"]').firstChild.remove();
    }

    // Oof
    var arr = document.querySelector('div[data-test-id="header-Header"]').firstChild.children[1].firstChild.firstChild.firstChild.children;
    for (i = 0; i < 3; i++) {
        arr[1].remove();
    }

    var currentURL = window.location.href;
    waitForKeyElements('div[role="list"]', function(node) {
        stopVideos(node);
        var observer = new MutationObserver(stopVideos);
        observer.observe(document.querySelector('div[role="list"]'), {attributes: true, childList: true, characterData: false, subtree: false});
    });

    waitForKeyElements('div[data-test-id="creator-card-profile"]', function(node) {
        var observer = new MutationObserver(cleanDescription);
        observer.observe(document.querySelector('div[data-test-id="creator-card-profile"]'), {attributes: false, childList: true, characterData: false, subtree: false});
        cleanDescription(node);
    });

    waitForKeyElements('div[data-test-id="canonical-card"]', function(node) {
        var observer = new MutationObserver(cleanComments);
        observer.observe(document.querySelector('div[data-test-id="canonical-card"]'), {attributes: false, childList: true, characterData: false, subtree: false});
        cleanComments(node);
    });

    waitForKeyElements('div[class="footerButtons"]', function(node) {
        cleanFooter(node);
    });

    waitForKeyElements('div[data-test-id="board-tools"]', function(node) {
        cleanShopButtonsFromBoard(node);
    });

    waitForKeyElements('div[data-test-id="visual-content-container"]', function(node) {
        cleanPicture(node);
    });

    waitForKeyElements('div[class="ALa Jea LCN Lej Rym _he gjz mQ8 ojN p6V urM zI7 iyn Hsu"]', function(node) {
        cleanWelcomeBackModal(node);
    });
    waitForKeyElements('div[class="ALa Jea KS5 LCN Lej Rym _he mQ8 ojN p6V urM zI7 iyn Hsu"]', function(node) {
        cleanWelcomeBackModal(node);
    });

    waitForKeyElements('div[data-test-id="product-price"]', function(node) {
        cleanProductInfo(node);
    });

    waitAndRemove('div[class="MMr kKU zI7 iyn Hsu"]');
    waitAndRemove('div[data-test-id="related-domain-carousel"]');
    waitAndRemove('div[data-test-id="closeup-action-items"]');

    waitForKeyElements('div[class="hs0 ujU un8 C9i TB_"]', function(nodes) {
        var promotedRegex = new RegExp('([.][a-zA-Z0-9]{5}:before\s*.*[Promoted].*){7}');
        for (var i = 0; i < nodes.length; i++) {
             if (promotedRegex.test(nodes[i].textContent)) {
                 var parentListItem = nodes[i].closest('div[role="listitem"]');
                 var matrix = new WebKitCSSMatrix(window.getComputedStyle(parentListItem).transform);
                 var targetXCoord = matrix.e;
                 var current = nodes[i];
                 current = current.previousSibling;
                 while (current != null) {
                     var currentXCoord = new WebKitCSSMatrix(window.getComputedStyle(current).transform);
                     if (currentXCoord == targetXCoord) {
                         console.log('Removed promoted pin');
                         current.remove();
                         break;
                     }
                     current = current.previousSibling;
                 }
             }
        }
    });
})();

