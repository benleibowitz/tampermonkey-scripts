// ==UserScript==
// @name         Startpage Cleaner Upper
// @namespace    https://www.benleibowitz.rocks
// @version      1.0
// @description  Clean up unnecessary clutter on startpage.com
// @author       You
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName('block-display')[0].remove();
    document.getElementsByClassName('ay-eo-tpcl ay-eo-tpcl--')[0].remove();
    document.getElementsByClassName('w-gl__label')[0].remove();
    document.getElementById('feedback-button-container').remove();
})();
