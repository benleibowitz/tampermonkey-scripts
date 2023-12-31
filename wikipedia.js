// ==UserScript==
// @name         Wikipedia - I Gave At The Office
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Remove Wikipedia donation banners
// @author       You
// @match        https://en.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var pageContainer = document.getElementsByClassName('mw-page-container')[0]
    var observer = new MutationObserver((mutations, observer) => {
        for (let mutation of mutations) {
            if (mutation.target.className == 'cn-fundraising') {
                console.debug('Removing fundraising banner mutation');
                mutation.target.remove();
                console.debug('Disconnecting observer');
                observer.disconnect();
            }
        }
    });
    observer.observe(pageContainer, {childList: true, subtree: true});
})();
