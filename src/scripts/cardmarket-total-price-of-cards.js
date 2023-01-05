// ==UserScript==
// @name         Cardmarket - Sum up card prices
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sum up all the prices of the cards.
// @author       You
// @match        https://www.cardmarket.com/*/*/MainPage/browseUserProducts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const DELETE_BUTTON_TOGGLE_SIZE = 31;
    const DELETE_BUTTON_TOGGLE_SPACING = 8;
    const OFFSET_BOTTOM = DELETE_BUTTON_TOGGLE_SIZE + DELETE_BUTTON_TOGGLE_SPACING + 8;

    const priceElement = document.createElement('span');
    const triggerButton = document.createElement('button');
        
    triggerButton.innerText = 'Sum prices';
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = `${OFFSET_BOTTOM}px`;
    triggerButton.style.left = '8px';
    triggerButton.style.backgroundColor = 'white';
    triggerButton.style.border = '1px solid #012169';
    triggerButton.style.borderRadius = '4px';
    triggerButton.style.padding = '8px';

    triggerButton.addEventListener('click', () => {
        priceElement.innerText = `€${getPriceOfPage()}`;
    });

    document.body.appendChild(triggerButton);

    priceElement.style.position = 'fixed';
    priceElement.style.bottom = `${OFFSET_BOTTOM}px`;
    priceElement.style.left = `${triggerButton.clientWidth + 8}px`;
    priceElement.style.padding = '8px';

    document.body.appendChild(priceElement);

    function getPriceOfPage() {
        const priceElementsOnPage = [...document.querySelectorAll('.st_price > * > *')];

        const priceOnPage = priceElementsOnPage.reduce((out, priceElement) => {
            const price = Number(priceElement.textContent.split(' ')[0].replace(',', '.'));
            const nextPrice = ((out * 100) + (price * 100)) / 100;

            return nextPrice;
        }, 0);

        return priceOnPage;
    }
})();