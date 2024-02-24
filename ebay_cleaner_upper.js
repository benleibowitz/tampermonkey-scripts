// ==UserScript==
// @name       	eBay Cleaner Upper
// @namespace  	https://www.benleibowitz.rocks
// @version    	1.0
// @description Blocks dark patterns and noise on eBay
// @match       https://www.ebay.com/*
// @copyright   2023
// @icon        https://www.ebay.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @sandbox      Javascript
// @license     MIT
// ==/UserScript==
/* global $, waitForKeyElements */

function removeElementWithClassName(className) {
    var els = document.getElementsByClassName(className);
    if (els.length > 0) {
        els[0]?.remove();
    }
}

function cleanHomePage() {
    removeElementWithClassName('vl-banner-carousel');
    removeElementWithClassName('vl-feedback');
    removeElementWithClassName('vl-loyalty');
    removeElementWithClassName('vl-ad-row');
    removeElementWithClassName('vl-banner');
    removeElementWithClassName('vl-banner');
    removeElementWithClassName('vl-ad-row');
    removeElementWithClassName('vl-popular-destinations--evo-v1');
}

function cleanProductDetailPage() {
    console.trace('Cleaning product detail page');
    removeElementWithClassName('x-photos-urgency-signal');
    removeElementWithClassName('vas-addons-container-d-v3');
    removeElementWithClassName('d-payments-minview');
    removeElementWithClassName('d-sell-now');
}

(function() {
    'use strict';
    const homePage = new RegExp('https://www[.]ebay[.]com[/]?$');
    const productDetailPage = new RegExp('https://www[.]ebay[.]com/itm/.*');
    const currentURL = window.location.href;

    if (homePage.test(currentURL)) {
        cleanHomePage();
    } else if (productDetailPage.test(currentURL)) {
        cleanProductDetailPage();
    }
})();
