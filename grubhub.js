// ==UserScript==
// @name         Grubhub Ad-Remover
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove sponsored results and ads on Grubhub
// @author       BL
// @match        https://www.grubhub.com/*
// @match        https://grubhub.com/*
// @icon         https://static.wixstatic.com/media/6ff25e_7a99b9ba661e4a7ba1f4de639ce5689e~mv2.jpg/v1/fill/w_52,h_52,al_c,q_80,usm_0.66_1.00_0.01/grubhub-logo.jpg
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

function removeSponsored(ignored) {
    'use strict';

    var spans = document.querySelectorAll('[data-testid="sponsored-result"]');
    for (var i = 0; i < spans.length; i++) {
        var span = spans[i];
        console.log('Removing sponsored result: ' + span.querySelector('.restaurant-name').title);
        span.remove();
    }
};

waitForKeyElements('.searchResults-wrapper', function(node) {
    removeSponsored(node);
    var observer = new MutationObserver(removeSponsored);
    observer.observe(document.getElementsByClassName('searchResults-wrapper')[0], {attributes: true, childList: true, characterData: false, subtree:true});
});

