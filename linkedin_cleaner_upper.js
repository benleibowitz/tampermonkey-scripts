// ==UserScript==
// @name         LinkedIn Cleaner-Upper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean up LinkedIn
// @author       BL
// @match        https://www.linkedin.com/*
// @match        https://www.linkedin.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

'use strict';

function removeNotificationBadge() {
    waitForKeyElements('#ember16', function(node) {
        var notifications = document.getElementById('ember16').getElementsByClassName('notification-badge');
        if (notifications.length == 1) {
            notifications[0].remove();
        }
    });

    waitForKeyElements('.notification-badge', function(node) {
        node.remove();
    });
}

function removeProfilePrompts() {
    waitForKeyElements('#promo', function(node) {
        node[0].parentElement.remove();
    });
    waitForKeyElements('#guidance', function(node) {
        node[0].parentElement.remove();
    });
    waitForKeyElements('#resources', function(node) {
        node[0].parentElement.remove();
    });
}

function removeRightSidebar() {
    waitForKeyElements('aside[aria-label="LinkedIn News"]', function(node) {
        node.remove();
    });
}

function removeUpsellLinks() {
    waitForKeyElements('.premium-upsell-link--extra-long', function(node) {
        node.remove();
    });
    waitForKeyElements('.premium-upsell-link', function(node) {
        node[0].remove();
    });
    waitForKeyElements('span[class="global-nav__secondary-premium-cta-text"]', function(node) {
       node[0].parentElement.parentElement.parentElement.remove();
    });
}

function removeRightSidebarOnProfile() {
    waitForKeyElements('.scaffold-layout__aside', function(node) {
       node[0].remove();
    });
}

(function() {
    removeNotificationBadge();
    removeRightSidebar();
    removeUpsellLinks();
    removeRightSidebarOnProfile();
    removeProfilePrompts();
})();