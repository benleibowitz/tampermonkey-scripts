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

function stopVideos(ignored) {
    var videos = document.getElementsByTagName('video');
    for (var i = 0; i < videos.length; i++) {
        var video = videos[i];
        video.pause();
        video.setAttribute('autoplay', 'false');
        video.currentTime = 0;
        console.log('Video stopped!');
    }
};

function cleanDescription(node) {
    document.querySelector('div[data-test-id="maybe-clickthrough-link"]').remove();
    document.querySelector('div[data-test-id="creator-card-profile"]').parentElement.parentElement.parentElement.parentElement.parentElement.remove();
}

function cleanComments(node) {
    document.getElementById('canonical-card').remove();
}

function cleanFooter(node) {
    document.getElementsByClassName('footerButtons')[0].firstChild.remove();
}

function cleanActionItems(node) {
    document.querySelector('div[data-test-id="closeup-action-items"]').remove();
}

function cleanRelatedCarousel(node) {
    document.querySelector('div[data-test-id="related-domain-carousel"]').remove();
}

function cleanShopButtonsFromBoard(node) {
    var buttons = document.querySelector('div[data-test-id="board-header"]').nextElementSibling.firstChild.firstChild.children;
    if (buttons.length == 4) {
        buttons[0].remove();
        buttons[0].remove();
        buttons[1].remove();
    } else if (buttons.length == 2) {
        buttons[0].remove();
    }
}

function cleanPicture(node) {
    var photoContainer = document.querySelector('div[data-test-id="visual-content-container"]');
    var descriptionContainer = document.querySelector('div[data-test-id="description-content-container"]');
    var photoContainerParentElement = photoContainer.parentElement;
    var photoURL = document.querySelector('div[data-test-id="closeup-image"]').firstChild.firstChild.children[1].firstChild.firstChild.src;
    var photoIMG = document.createElement('img');
    photoIMG.setAttribute('src', photoURL);

    photoContainerParentElement.insertBefore(photoIMG, descriptionContainer);
    photoContainer.remove();
}

(function clean() {
    setInterval(function() {
        document.title = "Pinterest";
    }, 250);

    /*
    waitForKeyElements('title', function(node) {
        document.getElementsByTagName('title')[0].textContent = 'Pinterest';
        var observer = new MutationObserver(function() {
            document.getElementsByTagName('title')[0].textContent = 'Pinterest';
            observer.disconnect();
        });
        observer.observe(document.getElementsByTagName('title')[0], {attributes: false, childList: true, characterData: false, subtree: false});
    });
    */

    for (var i = 0; i < 3; i++) {
        document.querySelector('div[data-test-id="button-container"]').firstChild.remove();
    }

    // Oof
    var arr = document.querySelector('div[data-test-id="header-Header"]').firstChild.children[1].firstChild.firstChild.firstChild.children;
    for (i = 0; i < 3; i++) {
        arr[1].remove();
    }

    var currentURL = window.location.href;
    //if (new RegExp('.*pinterest.com(/?)$').test(currentURL) ||
    //    new RegExp('.*pinterest.com/(search|pin).*').test(currentURL)) {
        waitForKeyElements('div[role="list"]', function(node) {
            stopVideos(node);
            var observer = new MutationObserver(stopVideos);
            observer.observe(document.querySelector('div[role="list"]'), {attributes: false, childList: true, characterData: false, subtree: false});
        });
    //}

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

    waitForKeyElements('div[data-test-id="board-header"]', function(node) {
        cleanShopButtonsFromBoard(node);
    });

    waitForKeyElements('div[data-test-id="visual-content-container"]', function(node) {
        cleanPicture(node);
    });

    waitForKeyElements('div[data-test-id="closeup-action-items"]', function(node) {
        cleanActionItems(node);
    });

    waitForKeyElements('div[data-test-id="related-domain-carousel"]', function(node) {
        cleanRelatedCarousel(node);
    });
})();


