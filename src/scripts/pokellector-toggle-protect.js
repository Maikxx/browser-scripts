// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.pokellector.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokellector.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const toggleAllButtonElement = document.querySelector('.checkall');
    const toggleNoneButtonElement = document.querySelector('.checknone');

    if (!toggleAllButtonElement || !toggleNoneButtonElement) return;

    const toggleAllAction = toggleAllButtonElement.getAttribute('onclick');
    const toggleNoneAction = toggleNoneButtonElement.getAttribute('onclick');

    toggleAllButtonElement.setAttribute('onclick', null);
    toggleNoneButtonElement.setAttribute('onclick', null);
    
    toggleAllButtonElement.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();

        if (window.confirm('Are you sure you want to check all cards in this set?')) {
            toggleAllButtonElement.setAttribute('onclick', toggleAllAction);
            toggleAllButtonElement.click();
        }
    });

    toggleNoneButtonElement.addEventListener('click', event => {
        event.stopPropagation();
        event.preventDefault();

        if (window.confirm('Are you sure you want to uncheck all cards in this set?')) {
            toggleNoneButtonElement.setAttribute('onclick', toggleNoneAction);
            toggleNoneButtonElement.click();
        }
    });
})();