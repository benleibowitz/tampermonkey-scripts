// ==UserScript==
// @name         Autotrader Cleaner-Upper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Clean up Autotrader
// @author       BL
// @match        https://www.autotrader.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotrader.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// ==/UserScript==
/* global $, waitForKeyElements */

'use strict';

function cleanPaymentsPopover() {
    waitForKeyElements('#payments-popover-menu', function(node) {
        node.remove();
        document.getElementById('btn-compare').nextElementSibling.firstChild.remove();
    });
}

function removeViews() {
    waitForKeyElements('div[data-cmp="vdp-view-count"]', function(node) {
        node.remove();
    });
}

function fixDefaultSearch() {
    waitForKeyElements('div[data-cmp="marketExtensionCheckbox"]', function(node) {
        node.remove();
    });
    var url = new URL(window.location.href);
    if (new RegExp('/cars-for-sale.*').test(url.pathname)) {
        if (url.searchParams.get('marketExtension') != 'off') {
            url.searchParams.set('marketExtension', 'off');
            window.location.href = url.href;
        }
    }
}

function cleanWalletBanner() {
    waitForKeyElements('div[data-cmp="myWalletGridContainer"]', function(node) {
        node.remove();
    });
    waitForKeyElements('div[data-cmp="MyWalletFilter"]', function(node) {
        node.remove();
    });
}

function cleanDeliveryCars() {
   waitForKeyElements('div[data-cmp="supplementalListing"]', function(node) {
       var supplementalListings = document.querySelectorAll('div[data-cmp="supplementalListing"]');
       for (var i = 0; i < supplementalListings.length; i++) {
           var supplementalListing = supplementalListings[i];
           supplementalListing.parentElement.remove();
       }
   });
   waitForKeyElements('div[data-cmp="lowInventoryMessage"]', function(node) {
       var lowInventoryMessages = document.querySelectorAll('div[data-cmp="lowInventoryMessage"]');
       for (var i = 0; i < lowInventoryMessages.length; i++) {
           lowInventoryMessages[0].remove();
       }
   });
   waitForKeyElements('div[data-qaid="cntnr-listings"]', function(node) {
       let observer = new MutationObserver((mutations, observer) => {
           var listings = document.querySelector('div[data-qaid="cntnr-listings"]');
           while (listings.nextElementSibling != null) {
               listings.nextElementSibling.remove();
           }

           var listingsChildren = listings.children;
           var idx = 0;
           for (var i = 0; i < listingsChildren.length; i++) {
               if (listingsChildren[idx].getAttribute('data-qaid') != 'cntnr-listings-tier-listings') {
                   listingsChildren[idx].remove();
               } else {
                   idx++;
               }
           }
       });
       observer.observe(document, {childList: true, attributes: true, characterData:true, subtree: true});
   });
}

function cleanMyWallet() {
    waitForKeyElements('#calculatePayment', function(node) {
        node.remove();
    });
}

function cleanDealerInfo() {
    waitForKeyElements('div[data-cmp="emailOwner"]', function(node) {
        node.closest('.autoaffix').remove();
        document.getElementsByClassName('westlake-prequalification-button')[0].remove();
    });
}

(function() {
    var url = new URL(window.location.href);
    const searchPageURL = new RegExp('/cars-for-sale.*')
    const detailPageURL = new RegExp('/cars-for-sale/vehicledetails.*')
    if (detailPageURL.test(url.pathname)) {
        cleanMyWallet();
        cleanDealerInfo();
        removeViews();
    } else if (searchPageURL.test(url.pathname)) {
        fixDefaultSearch();
        cleanPaymentsPopover();
        cleanWalletBanner();
        //cleanDeliveryCars();
    }
})();
