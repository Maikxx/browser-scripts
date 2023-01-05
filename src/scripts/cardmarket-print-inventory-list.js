// ==UserScript==
// @name         Cardmarket - Export inventory of current page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Exports the inventory of the current page of sales on CardMarket.
// @author       You
// @match        https://www.cardmarket.com/*/*/MainPage/browseUserProducts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const DELETE_BUTTON_TOGGLE_SIZE = 31;
    const DELETE_BUTTON_TOGGLE_SPACING = 8;
    const OFFSET_BOTTOM = (DELETE_BUTTON_TOGGLE_SIZE + DELETE_BUTTON_TOGGLE_SPACING) * 2 + 8;

    const DATA_TYPE_INDEX_MAP = {
        NAME: 0,
        EXPANSION: 1,
        RARITY: 2,
        LANGUAGE: 3,
        CONDITION: 4,
        EXTRA: 5,
        COMMENTS: 6,
        PRICE: 7,
        COUNT: 8
    };

    const triggerButton = document.createElement('button');
        
    triggerButton.innerText = 'Get inventory';
    triggerButton.style.position = 'fixed';
    triggerButton.style.bottom = `${OFFSET_BOTTOM}px`;
    triggerButton.style.left = '8px';
    triggerButton.style.backgroundColor = 'white';
    triggerButton.style.border = '1px solid #012169';
    triggerButton.style.borderRadius = '4px';
    triggerButton.style.padding = '8px';

    triggerButton.addEventListener('click', () => {
        exportInventoryOnPage();
    });

    document.body.appendChild(triggerButton);

    function exportInventoryOnPage() {
        const tableRows = getTableRows();
        const tableRowsData = tableRows.map(getTableData);
        
        const totalOutput = tableRowsData.reduce((totalOutput, tableRowColumns) => {
            const outputRowText = tableRowColumns.reduce((rowOutput, tableRowColumn, i) => {
                const data = getTableDataContent(tableRowColumn, i);

                if (!data) {
                    return rowOutput;
                }

                return rowOutput.length > 0 ? `${rowOutput} - ${data}` : data;
            }, '');

            return totalOutput.length > 0 ? `${totalOutput}\n${outputRowText}` : outputRowText;
        }, '');

        console.log(totalOutput);
        navigator.clipboard.writeText(totalOutput);
    }

    /**
     * @returns {Element[]}
     */
    function getTableRows() {
        return [...document.querySelectorAll('tbody > tr')];
    }

    /**
     * @param {Element} tableRowElement 
     * @returns {Element[]}
     */
    function getTableData(tableRowElement) {
        return [...tableRowElement.querySelectorAll('td')].slice(1, -1);
    }

    /**
     * @param {Element} tableDataElement
     * @param {number} index
     * @returns {*}
     */
    function getTableDataContent(tableDataElement, index) {
        if (index === DATA_TYPE_INDEX_MAP.NAME) {
            const cardNameElement = tableDataElement.querySelector('a');

            if (!cardNameElement) {
                throw new Error('One or more cards could not have their name found.');
            }

            return cardNameElement.textContent;
        }

        if (index === DATA_TYPE_INDEX_MAP.EXPANSION) {
            const expansionElement = tableDataElement.querySelector('[title]');

            if (!expansionElement) {
                throw new Error('One or more cards could not have their expansion found.');
            }

            return expansionElement.getAttribute('title');
        }

        if (index === DATA_TYPE_INDEX_MAP.RARITY) {
            const rarityTypeElement = tableDataElement.querySelector('[title]');

            if (!rarityTypeElement) {
                throw new Error('One or more cards could not have their rarity found.');
            }

            return rarityTypeElement.getAttribute('title');
        }

        if (index === DATA_TYPE_INDEX_MAP.LANGUAGE) {
            const languageElement = tableDataElement.querySelector('[data-original-title]');

            if (!languageElement) {
                throw new Error('One or more cards could not have their language found.');
            }

            return languageElement.getAttribute('data-original-title');
        }

        if (index === DATA_TYPE_INDEX_MAP.CONDITION) {
            const conditionElement = tableDataElement.querySelector('[title]');

            if (!conditionElement) {
                throw new Error('One or more cards could not have their condition found.');
            }

            return conditionElement.getAttribute('title');
        }

        if (index === DATA_TYPE_INDEX_MAP.EXTRA) {
            const extraElement = tableDataElement.querySelector('[data-original-title]');

            if (!extraElement) return null;

            return extraElement.getAttribute('data-original-title');
        }

        if (index === DATA_TYPE_INDEX_MAP.COUNT) {
            return `${Number(tableDataElement.textContent)}x`;
        }

        return null;
    }
})();