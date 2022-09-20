// ==UserScript==
// @name         Grubhub Ad-Remover
// @namespace    http://tampermonkey.net/
// @version      0.2
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

'use strict';

function waitAndRemove(toWaitFor) {
    waitForKeyElements(toWaitFor, function(node) {
        node.remove();
    });
}

function removeSponsored(ignored) {
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

waitForKeyElements('#select-sort', function(node) {
    if (JSON.parse(document.getElementById('select-sort').value).sort_id === 'default') {
        var url = new URL(window.location.href);
        url.searchParams.set('sorts', 'delivery_estimate');
        console.log('Redirecting to include Delivery Estimate sort value');
        window.location.href = url.href;
    }
});

// Get rid of the Premium signup modal
waitForKeyElements('#chiri-modal', function(node) {
    node.getElementsByTagName('a')[2].click();
    console.log('Clicked "Dismiss" on the GrubHub+ Sign Up modal');
});

// That's a lot of upselling...
var toRemove = [
  'div[data-testid="homepage-upsell-mini-bar"]',
  'span[data-testid="mini-bar-upsell"]',
  'div[data-testid="subscription-container-rebrand"]',
  'div[data-testid="checkout-review-donation-section"]',
  'div[data-testid="subscription-upsell-banner"]'
];
for (var i = 0; i < toRemove.length; i++) {
    waitAndRemove(toRemove[i]);
}
