// ==UserScript==
// @name         Instagram Cleaner-Upper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

'use strict';

function ignoreNotifications(node) {
    waitForKeyElements('button[class="_a9-- _a9_1"]', function(node) {
        var popups = document.getElementsByClassName('_a9-v');
        if (popups.length == 1) {
            var popupsChildren = popups[0].children;
            if (popupsChildren.length == 3) {
                if (popupsChildren[1].firstChild.textContent === 'Turn on Notifications') {
                    node.click();
                    console.log('Clicked "Not now" on notification popup');
                }
            }
        }
    });
}

(function() {
    ignoreNotifications();
})();
