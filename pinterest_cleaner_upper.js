// ==UserScript==
// @name         Pinterest Cleaner Upper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean up Pinterest
// @author       BL
// @match        https://www.pinterest.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pinterest.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

'use strict';

function cleanDescription(node) {
    nullSafeRemove(document.querySelector('div[data-test-id="maybe-clickthrough-link"]'));
    nullSafeRemove(document.querySelector('div[data-test-id="closeup-action-items"]'));
    nullSafeRemove(document.getElementById('canonical-card'));
    nullSafeRemove(document.querySelector('div[data-test-id="creator-card-profile"]').parentElement.parentElement.parentElement.parentElement.parentElement);
    /*var organizeButtonShelf = document.getElementsByClassName('hs0 un8 C9i TB_');
    if (organizeButtonShelf) {
        organizeButtonShelf = organizeButtonShelf[13];
        organizeButtonShelf.children[0].remove();
        organizeButtonShelf.children[0].remove();
        organizeButtonShelf.children[1].remove();
    }*/
};

function nullSafeRemove(n) {
    if (n) {
        n.remove();
    }
}

function clean() {
    /*
    new MutationObserver(function(mutations) {
        document.title = 'Pinterest!';
    }).observe(document.querySelector('title').text, {attributes: true, subtree: false, characterData: true, childList: true});
    */

    waitForKeyElements('div[aria-label="Notifications"]', function() {
        for (var i = 0; i < 3; i++) {
            nullSafeRemove(document.querySelector('div[data-test-id="button-container"]').firstChild);
        }
    });

    // Oof
    waitForKeyElements('div[data-test-id="addPinButton"]', function() {
        var arr = document.querySelector('div[data-test-id="header-Header"]');
        arr = arr.firstChild.children[1].firstChild.firstChild.firstChild.children;
        for (var i = 0; i < 3; i++) {
            nullSafeRemove(arr[1]);
        }
    });

    waitForKeyElements('div[data-test-id="canonical-card"]', function() {
        cleanDescription();
        var observer = new MutationObserver(cleanDescription);
        observer.observe(document.querySelector('div[data-test-id="canonical-card"]'), {attributes: false, childList: true, characterData: false, subtree: false});
    });
};

clean();
