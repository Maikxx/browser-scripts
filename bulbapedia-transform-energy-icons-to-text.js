// ==UserScript==
// @name         Bulbapedia Bulbagarden - Transform energy icons in table to text
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transform energy icons in table to text
// @author       You
// @include      https://bulbapedia.bulbagarden.net/wiki/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bulbagarden.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let cardListHeader = document.querySelector('#Card_list');

    if (!cardListHeader) {
        cardListHeader = document.querySelector('#Set_list');
    }

    if (!cardListHeader) {
        cardListHeader = document.querySelector('#Set_lists');
    }

    if (!cardListHeader) {
        return;
    }

    const wrapper = cardListHeader.parentElement;

    if (!wrapper) {
        return;
    }

    const table = wrapper.nextElementSibling;

    if (!table) {
        return;
    }

    const wrapperTableRow = table.querySelector('tr:nth-of-type(2)');

    if (!wrapperTableRow) {
        return;
    }

    const tableRows = wrapperTableRow.querySelectorAll('tbody > tr');

    tableRows.forEach((tableRow, index) => {
        if (index === 0) {
            return;
        }

        const typeTableData = tableRow.querySelector('th:nth-child(4)');

        if (!typeTableData) {
            return;
        }

        const typeTableAnchor = typeTableData.querySelector('a');

        if (!typeTableAnchor) {
            const typeTableImage = typeTableData.querySelector('img');

            if (!typeTableImage) {
                const typeTableAbbreviation = typeTableData.textContent;

                if (!typeTableAbbreviation) {
                    return;
                }

                const typeMap = {
                    'I': 'Item',
                    'Su': 'Supporter',
                    'St': 'Stadium',
                    'T': 'Trainer'
                };

                const fullType = typeMap[typeTableAbbreviation.trim()];

                if (!fullType) {
                    return;
                }

                typeTableData.innerHTML = fullType;
                return;
            }

            const type = typeTableImage.getAttribute('title');

            if (!type) {
                return;
            }

            typeTableData.innerHTML = type;
            return;
        }

        const type = typeTableAnchor.getAttribute('title');

        if (!type) {
            return;
        }

        typeTableData.innerHTML = type;
    });
})();