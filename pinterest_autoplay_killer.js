// ==UserScript==
// @name         Pinterest Autoplay Killer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stop those annoying Pinterest videos from autoplaying
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

waitForKeyElements('div[role="list"]', function(node) {
    stopVideos(node);
    var observer = new MutationObserver(stopVideos);
    observer.observe(document.querySelector('div[role="list"]'), {attributes: false, childList: true, characterData: false, subtree: false});
});




