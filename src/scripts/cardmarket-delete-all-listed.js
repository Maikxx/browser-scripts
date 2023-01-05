// ==UserScript==
// @name         Cardmarket - Delete all listed cards
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Delete all listed cards for the current page you're on.
// @author       You
// @include      https://www.cardmarket.com/*/*/MainPage/browseUserProducts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const triggerButton = document.createElement('button');
    let isToggledState = false;
    let timeouts;
    
    triggerButton.innerText = 'Toggle auto-delete on';
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = '8px';
    triggerButton.style.left = '8px';
    triggerButton.style.backgroundColor = 'white';
    triggerButton.style.border = '1px solid #012169';
    triggerButton.style.borderRadius = '4px';
    triggerButton.style.padding = '8px';
    
    triggerButton.addEventListener('click', () => {
        isToggledState = !isToggledState;

        const deleteButtons = [...document.querySelectorAll('[data-original-title="Delete"]')];

        timeouts = deleteButtons.map((deleteButton, index) => {
            return setTimeout(() => {
                deleteButton.click();
            }, (index + 1) * 2000);
        });

        if (!isToggledState) {
            timeouts.forEach(timeout => {
                clearTimeout(timeout);
            })
        }

        triggerButton.innerText = `Toggle auto-delete ${isToggledState ? 'off' : 'on'}`;
    });

    document.body.appendChild(triggerButton);
})();