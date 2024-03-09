// ==UserScript==
// @name       	Amazon Dark Pattern Blocker
// @namespace  	https://www.benleibowitz.rocks
// @version    	1.0
// @description Blocks dark patterns on Amazon.com
// @match       https://www.amazon.com/*
// @copyright   2023
// @icon        https://www.amazon.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @sandbox      Javascript
// @license     MIT
// ==/UserScript==
/* global $, waitForKeyElements */

function removeNode(query) {
    waitForKeyElements(query, function(node) {
        node[0].remove();
    });
}

function blockPrimeSignupInCheckout() {
    // They sure are pushy...
    removeNode('.prime-ad-banner-content');
    removeNode('.prime-ship-speed');
    removeNode('.primeAdLauncher');
    removeNode('#osu-prime-recommendations');
    waitForKeyElements('.prime-no-button', function(node) {
        node[0].querySelector('button').click();
        blockPrimeSignupInCheckout();
    });
}

function removeUpsellBannerInCart() {
    removeNode('#sc-new-upsell');
    removeNode('ms3-selection[data-slot="PrimeUpsell"]');
}

function removePrimeUpsellBannerFromProductDetailPage() {
    removeNode('#primeDPUpsellContainer');
    removeNode('#primeExclusivePricingMessage');
    removeNode('#primeSavingsUpsellAccordionRow');
    removeNode('#snsAccordionRowMiddle');
    document.getElementById('newAccordionRow_1')?.querySelector('i')?.click();
    removeNode('.a-section .price-block-text');
    removeNode('#buyItOnAB_feature_div');
    removeNode('#b2bUpsell_feature_div');
    removeNode('#mbb_feature_div');
    removeNode('#simpleBundleV2_feature_div');
    removeNode('.maple-banner');
    removeNode('#valuePick_container');

    waitForKeyElements('#attach-warranty-pane', function(node) {
        console.trace('Clicking \'No thanks\' on warrantee upsell');
        node[0]?.querySelector('input[aria-labelledby="attachSiNoCoverage-announce"]')?.click();
    });
}

function clickThroughPrimeUpsellInterstitial() {
    document.getElementById('a-page').style = 'visibility: hidden';
    /*
    document.getElementById('loading-spinner-blocker-doc').style = 'visibility: block';
    document.getElementById('spinner-anchor').style = 'visibility: block';
    document.getElementsByClass('loading-spinner-spp')[0].style = 'visibility: block';
    document.getElementsByClass('loading-spinner')[0].style = 'visibility: block';
    */
    waitForKeyElements('#prime-interstitial-nothanks-button', function(node) {
        node[0].click();
    });
}

function removeUpsellBannerInSmartCart() {
    removeNode('#sw-maple');
}

function removeUpsellBannersOnThankYouPage() {
    removeNode('ms3-selection[data-slot="CheckoutThankYou_ThankYouBox"]');
    removeNode('#marketing');
    removeNode('div[cel_widget_id="typ-mapleSlot"]');
}

function blockSubscribeAndSaveInCheckout() {
    removeNode('#sns-item-0');
}

(function() {
    const cartView = new RegExp('https://www[.]amazon[.]com/gp/cart/view[.]html');
    const cartViewNonGP = new RegExp('https://www[.]amazon[.]com/cart');
    const primeUpsellInterstitial = new RegExp('https://www[.]amazon[.]com/gp/buy/primeinterstitial/.*');
    const checkoutPage = new RegExp('https://www[.]amazon[.]com/gp/buy/spc/handlers/display[.]html.*');
    const smartCartPage = new RegExp('https://www[.]amazon[.]com/cart/smart-wagon.*');
    const thankYouPage = new RegExp('https://www[.]amazon[.]com/gp/buy/thankyou/.*');
    const currentURL = window.location.href;

    if (cartView.test(currentURL) || cartViewNonGP.test(currentURL)) {
        removeUpsellBannerInCart();
    } else if (primeUpsellInterstitial.test(currentURL)) {
        clickThroughPrimeUpsellInterstitial();
    } else if (checkoutPage.test(currentURL)) {
        blockPrimeSignupInCheckout();
        blockSubscribeAndSaveInCheckout();
    } else if (smartCartPage.test(currentURL)) {
        removeUpsellBannerInSmartCart();
    } else if (thankYouPage.test(currentURL)) {
        removeUpsellBannersOnThankYouPage();
    } else {
        removePrimeUpsellBannerFromProductDetailPage();
    }
})();

