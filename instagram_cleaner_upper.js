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

function ignoreNotifications() {
    waitForKeyElements('button[class="_a9-- _a9_1"]', function(node) {
        var popups = document.getElementsByClassName('_a9-v');
        if (popups.length == 1) {
            var popupsChildren = popups[0].children;
            if (popupsChildren.length == 3) {
                if (popupsChildren[1].firstChild.textContent === 'Turn on Notifications') {
                    node.click();
                    console.debug('Clicked "Not now" on notification popup');
                }
            }
        }
    });
}

function stopAutoplay() {
    waitForKeyElements('div[class="_ab8w  _ab94 _ab99 _ab9f _ab9m _ab9p  _abc0 _abcm"]', function(node) {
        var observer = new MutationObserver(function() {
            console.debug('Looking for videos to stop');
            var videos = document.getElementsByTagName('video');
            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                if (!video.paused) {
                    video.autoplay = false;
                    video.pause();
                    video.currentTime = 0;
                    console.debug('Stopped video');
                }
            }
        });
        observer.observe(document.getElementsByClassName('_ab8w  _ab94 _ab99 _ab9f _ab9m _ab9p  _abc0 _abcm')[0].firstChild.firstChild, {attributes: true, childList: true, characterData: false, subtree: true});
    });
}

function cleanAcres() {
    waitForKeyElements('div[class="_acre"]', function(node) {
        node.remove();
    });
}

(function() {
    var oneTapRegex = new RegExp('https://.*instagram.com/accounts/onetap/*');
    if (oneTapRegex.test(window.location.href)) {
        waitForKeyElements('button[class="_acan _acao _acas"]', function(node) {
            document.getElementsByClassName('_acan _acao _acas')[0].click();
        });
    } else {
        ignoreNotifications();
        stopAutoplay();
        cleanAcres();
    }
})();
