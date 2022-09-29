// ==UserScript==
// @name         Modesens Cleaner-Upper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean up Modesens popups
// @author       You
// @match        https://modesens.com
// @match        https://modesens.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=modesens.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

(function() {
    'use strict';

    waitForKeyElements('#mdsignup___BV_modal_outer_', function(node) {
        node.remove();
        document.getElementsByTagName('body')[0].setAttribute('class', '');
        document.getElementsByTagName('body')[0].setAttribute('data-modal-open-count', '0');
        console.log('Removed popup');
    });

    var els = ['c9-popup', 'c9-blocker', 'c9-button', 'c9-styles', 'popLink'];
    for (var i = 0; i < els.length; i++) {
        waitForKeyElements('#' + els[i], function(node) {
            node.remove();
                        console.log('Removed popup');
        });
    }

})();
