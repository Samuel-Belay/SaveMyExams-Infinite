// ==UserScript==
// @name         Infinite Save My Exams (optimized, periodic)
// @namespace    http://tampermonkey.net/
// @version      2025.10.29
// @description  Forcefully deletes cookies, sessionStorage and localStorage on each page load and SPA navigation, with periodic clearing.
// @author       You
// @match        https://www.savemyexams.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=savemyexams.com
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // CONFIG
  const ENABLE_PERIODIC_CLEAR = true; // enabled per your request
  const PERIODIC_MS = 3000;           // recommended: 2000-5000 ms (lower = more aggressive)

  function getPathCandidates() {
    const path = location.pathname || '/';
    const parts = path.split('/').filter(Boolean);
    const paths = [];
    for (let i = parts.length; i >= 0; i--) {
      const p = '/' + parts.slice(0, i).join('/');
      paths.push(p === '' ? '/' : p);
    }
    if (!paths.includes('/')) paths.push('/');
    return [...new Set(paths)];
  }

  function getDomainCandidates() {
    const host = location.hostname;
    const parts = host.split('.');
    const domains = new Set();
    for (let i = 0; i <= parts.length - 2; i++) {
      const d = parts.slice(i).join('.');
      domains.add(d);
      domains.add('.' + d);
    }
    domains.add(host);
    return Array.from(domains);
  }

  function clearCookies() {
    try {
      console.log('Clearing cookies...'); // visible indicator
      const raw = document.cookie || '';
      if (!raw) return;
      const cookies = raw.split(';').map(c => c.trim()).filter(Boolean);
      if (!cookies.length) return;

      const paths = getPathCandidates();
      const domains = getDomainCandidates();
      const expires = 'Thu, 01 Jan 1970 00:00:00 GMT';

      for (const pair of cookies) {
        const idx = pair.indexOf('=');
        const name = idx >= 0 ? pair.slice(0, idx) : pair;
        if (!name) continue;

        for (const path of paths) {
          // host-only
          document.cookie = `${name}=;expires=${expires};path=${path};SameSite=None;Secure`;
          for (const domain of domains) {
            try {
              document.cookie = `${name}=;expires=${expires};path=${path};domain=${domain};SameSite=None;Secure`;
            } catch (e) { /* ignore invalid domain formats */ }
            document.cookie = `${name}=;expires=${expires};path=${path};domain=${domain}`;
          }
        }
      }
    } catch (e) {
      console.log('clearCookies error', e);
    }
  }

  function clearStorage() {
    try {
      if (window.localStorage) {
        try { localStorage.clear(); } catch (e) { /* ignore */ }
      }
      if (window.sessionStorage) {
        try { sessionStorage.clear(); } catch (e) { /* ignore */ }
      }
    } catch (e) {
      console.log('clearStorage error', e);
    }
  }

  function clearAll(reason) {
    try {
      console.log('Clearing cookies and storage', reason || '');
      clearCookies();
      clearStorage();
    } catch (e) {
      console.log('clearAll error', e);
    }
  }

  // SPA navigation handling
  (function hijackHistoryEvents() {
    const push = history.pushState;
    const replace = history.replaceState;

    history.pushState = function (...args) {
      const result = push.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    history.replaceState = function (...args) {
      const result = replace.apply(this, args);
      window.dispatchEvent(new Event('locationchange'));
      return result;
    };

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    window.addEventListener('hashchange', () => window.dispatchEvent(new Event('locationchange')));
  })();

  window.addEventListener('locationchange', () => clearAll('locationchange'));

  // Run at startup and on load events
  clearAll('initial');
  window.addEventListener('DOMContentLoaded', () => clearAll('DOMContentLoaded'));
  window.addEventListener('load', () => clearAll('load'));

  // Optional periodic clearing
  if (ENABLE_PERIODIC_CLEAR) {
    setInterval(() => clearAll('periodic'), Math.max(500, PERIODIC_MS));
  }

})();
