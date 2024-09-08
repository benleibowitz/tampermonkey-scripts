// ==UserScript==
// @name         Startpage Cleaner Upper
// @namespace    https://www.benleibowitz.rocks
// @version      1.0
// @description  Clean up unnecessary clutter on startpage.com
// @author       You
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @sandbox      Javascript
// @license     MIT
// ==/UserScript==
/* global $, waitForKeyElements */

const MERCHANT_QUERY_PARAM = 'srsltid';

function removeFirstOrIgnore(arr) {
    if (arr && arr.length > 0) {
        arr[0].remove();
        return true;
    }
    return false;
}

/**
 * Remove the Google Merchant / Shopping query param from any links we click
 */
function removeSrsltidParam(url) {
    let urlObj = new URL(url);
    urlObj.searchParams.delete('srsltid');
    return urlObj.toString();
}

function onStartpageLinkClick(event) {
    let target = event.target;

    if (target.tagName !== 'A') {
        target = target.closest('a');
    }

    if (target && target.tagName === 'A') {
        event.preventDefault();

        let newHref = removeSrsltidParam(target.href);

        target.href = newHref;
        window.location.href = newHref;
    }
}

function cleanSrsltids() {
    var links = document.getElementById('main').querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (!a.href) {
            continue;
        }

        var url = new URL(a.href);
        if (url.searchParams.has(MERCHANT_QUERY_PARAM)) {
            url.searchParams.delete(MERCHANT_QUERY_PARAM);
            a.href = url.toString();
            a.linkText = url.toString();
            a.ariaLabel = url.toString();
            var linkText = a.querySelector('span[class="link-text"]');
            if (linkText) {
                linkText.innerText = url.toString();
            }
        }
    }
}

(function() {
    'use strict';
    document.addEventListener('click', onStartpageLinkClick, true);
    cleanSrsltids();

    removeFirstOrIgnore(document.getElementsByClassName('w-gl-attribution'));
    removeFirstOrIgnore(document.getElementsByClassName('serp-sidebar-app-promo-widget'));
    removeFirstOrIgnore(document.getElementsByClassName('block-display'));
    removeFirstOrIgnore(document.getElementsByClassName('ay-eo-tpcl ay-eo-tpcl--'));
    removeFirstOrIgnore(document.getElementsByClassName('w-gl__label'));
    removeFirstOrIgnore(document.getElementsByClassName('layout-web__footer'));
    removeFirstOrIgnore(document.getElementsByClassName('css-1pducxn'));
    removeFirstOrIgnore(document.getElementsByClassName('css-1o12sfa'));
    removeFirstOrIgnore(document.getElementsByClassName('css-1mkwc5o'));
    document.getElementById('feedback-button-container')?.remove();
    document.querySelector('div[role="contentinfo"]')?.remove();
    document.getElementsByTagName('footer')[0].remove();
    var feedbackWidgets = document.getElementsByClassName('feedback-widget');
    for (const feedbackWidget of feedbackWidgets) {
        feedbackWidget.remove();
    }

    var mainContainer = document.getElementById('main');

    const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
            var ad = document.querySelector('div[class^="css-1mkwc5o"]');
            if (ad != null) {
                ad.remove();
                console.debug('Removed that pesky StartPage ad');
            }
        }
    };

    const observer = new MutationObserver(callback);
    observer.observe(mainContainer, {attributes: false, childList: true, subtree: true});

})();
