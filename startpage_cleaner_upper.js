// ==UserScript==
// @name         Startpage Cleaner Upper
// @namespace    https://www.benleibowitz.rocks
// @version      1.1.0
// @description  Clean up unnecessary clutter on startpage.com
// @author       Ben Leibowitz
// @match        https://www.startpage.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=startpage.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant        GM_addStyle
// @grant        GM.getValue
// @sandbox      Javascript
// @license      MIT
// ==/UserScript==
/* global $, waitForKeyElements */

/**
 * Query param that google adds to track user impressions
 * @see {@link https://support.google.com/merchants/answer/11127659}
 */
const GOOGLE_CONVERSION_TRACKING_QUERY_PARAM = "srsltid";

function removeFirstOrIgnore(arr) {
  if (arr && arr.length > 0) {
    arr[0].remove();
    return true;
  }
  return false;
}

/**
 * Remove the Google Merchant Tracking conversion query param from any links we click
 * @see {@link https://support.google.com/merchants/answer/11127659}
 */
function removeGoogleConversionTrackingQueryParam(url) {
  let urlObj = new URL(url);
  if (urlObj.searchParams.has(GOOGLE_CONVERSION_TRACKING_QUERY_PARAM)) {
    urlObj.searchParams.delete(GOOGLE_CONVERSION_TRACKING_QUERY_PARAM);
    console.debug(
      `Removed ${GOOGLE_CONVERSION_TRACKING_QUERY_PARAM} query param from url: ${url}`,
    );
    return urlObj.toString();
  }
  return url;
}

function onStartpageLinkClick(event) {
  let target = event.target;

  if (target.tagName !== "A") {
    target = target.closest("a");
  }

  if (target && target.tagName === "A") {
    event.preventDefault();

    let newHref = removeGoogleConversionTrackingQueryParam(target.href);
    target.href = newHref;
    window.location.href = newHref;
  }
}

/**
 * Remove the srsltid query param from any link on the page
 * @see {@link https://support.google.com/merchants/answer/11127659}
 */
function cleanSrsltids() {
  var links = document.getElementById("main").querySelectorAll("a");
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (!a.href) {
      continue;
    }

    var url = new URL(a.href);
    if (url.searchParams.has(GOOGLE_CONVERSION_TRACKING_QUERY_PARAM)) {
      var prevUrl = a.href; // For logging purposes

      url.searchParams.delete(GOOGLE_CONVERSION_TRACKING_QUERY_PARAM);
      a.href = url.toString();
      a.linkText = url.toString();
      a.ariaLabel = url.toString();
      var linkText = a.querySelector('span[class="link-text"]');
      if (linkText) {
        linkText.innerText = url.toString();
      }
      console.debug(
        `Removed ${GOOGLE_CONVERSION_TRACKING_QUERY_PARAM} query parameter from url: ${prevUrl}`,
      );
    }
  }
}

function centerSearchForm() {
  window.addEventListener("load", function () {
    const searchFormContainer = document.querySelector(
      ".search-form-relative-container",
    );

    if (searchFormContainer) {
      const parentContainer = searchFormContainer.parentElement;

      if (parentContainer) {
        parentContainer.style.position = "relative";
      }

      searchFormContainer.style.position = "absolute";
      searchFormContainer.style.top = "50%";
      searchFormContainer.style.left = "50%";
      searchFormContainer.style.transform = "translate(-50%, -50%)";
    } else {
      console.log(
        'Element with class "search-form-relative-container" not found.',
      );
    }
  });
}

function centerSearchResults() {
  window.addEventListener("load", function () {
    const searchResultsContainer = document.querySelector("#main");

    if (searchResultsContainer) {
      const parentContainer = searchResultsContainer.parentElement;

      if (parentContainer) {
        parentContainer.style.position = "relative";
      }

      searchResultsContainer.style.position = "absolute";
      searchResultsContainer.style.top = "55%";
      searchResultsContainer.style.left = "50%";
      searchResultsContainer.style.transform = "translate(-50%, -50%)";
      searchResultsContainer.style.width = "80%";
    } else {
      console.log('Element with ID "main" not found.');
    }
  });
}

function addFavicons() {
  const resultLinks = document.querySelectorAll(".result > .upper > a");

  resultLinks.forEach((link) => {
    if (!link.querySelector(".favicon")) {
      const url = new URL(link.href);
      // const faviconUrl = `${url.origin}/favicon.ico`;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.origin}&sz=32`;

      const favicon = document.createElement("img");
      favicon.src = faviconUrl;
      favicon.className = "favicon";
      favicon.style.width = "16px";
      favicon.style.height = "16px";
      favicon.style.marginRight = "8px";
      favicon.style.verticalAlign = "middle";

      link.insertBefore(favicon, link.firstChild);
    }
  });
}

function removeSponsoredByCard() {
  waitForKeyElements('span[class="sponsored-by"]', function (nodes) {
    nodes[0]?.closest('div[class^="pl-qi"]')?.remove();
  });
}

(function () {
  "use strict";

  // centerSearchForm();
  // centerSearchResults();

  removeSponsoredByCard();
  document.addEventListener("load", addFavicons, true);
  document.addEventListener("click", onStartpageLinkClick, true);
  cleanSrsltids();

  removeFirstOrIgnore(document.getElementsByClassName("w-gl-attribution"));
  removeFirstOrIgnore(document.getElementsByClassName("block-display"));
  removeFirstOrIgnore(
    document.getElementsByClassName("ay-eo-tpcl ay-eo-tpcl--"),
  );
  removeFirstOrIgnore(
    document.getElementsByClassName("feedback-serp-container"),
  );
  removeFirstOrIgnore(document.getElementsByClassName("w-gl__label"));
  removeFirstOrIgnore(document.getElementsByClassName("layout-web__footer"));
  removeFirstOrIgnore(document.getElementsByClassName("css-1pducxn"));
  removeFirstOrIgnore(document.getElementsByClassName("css-1o12sfa"));
  removeFirstOrIgnore(document.getElementsByClassName("css-1mkwc5o"));
  document.getElementById("feedback-button-container")?.remove();
  document.querySelector('div[role="contentinfo"]')?.remove();
  document.getElementsByTagName("footer")[0].remove();
  waitForKeyElements(
    'div[class^="serp-sidebar-app-promo-widget"]',
    function (nodes) {
      nodes[0]?.remove();
    },
  );
  var feedbackWidgets = document.getElementsByClassName("feedback-widget");
  for (const feedbackWidget of feedbackWidgets) {
    feedbackWidget.remove();
  }

  var mainContainer = document.getElementById("main");

  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      document.querySelector('div[class^="css-1mkwc5o"]')?.remove();
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(mainContainer, {
    attributes: false,
    childList: true,
    subtree: true,
  });
})();
