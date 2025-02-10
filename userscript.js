// ==UserScript==
// @name         Infinite Save My Exams
// @namespace    http://tampermonkey.net/
// @version      2025-02-10
// @description  Forcefully deletes cookies, session storage, and local storage on each page load and navigation.
// @author       You
// @match        https://www.savemyexams.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=savemyexams.com
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  function clearCookies() {
    document.cookie.split(";").forEach(cookie => {
      let name = cookie.split("=")[0].trim();
      document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.savemyexams.com`;
      document.cookie = name + `=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    });
  }

  function clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  function clearAll() {
    console.log("Clearing Cookies and Storage...");
    clearCookies();
    clearStorage();
    console.log("Cleared!");
  }

  // Run on initial page load
  clearAll();

  // Run on SPA route changes (history navigation)
  window.addEventListener("popstate", clearAll);
  window.addEventListener("pushstate", clearAll);  // Some SPAs use pushState()
  window.addEventListener("replaceState", clearAll);  // Handle replaceState()

  // Detect navigation changes in SPAs
  const originalPushState = history.pushState;
  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    clearAll();
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    clearAll();
  };

  // Run when a new page is fully loaded
  window.addEventListener("load", clearAll);
})();
