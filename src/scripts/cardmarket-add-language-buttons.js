// ==UserScript==
// @name         Cardmarket - Buttons for showing only cards of a certain language.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds buttons for showing only cards of a certain language.
// @author       M.B. van Veen
// @include      https://www.cardmarket.com/*/*/Products/Singles/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cardmarket.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    renderButton(
        '🇬🇧',
        () => navigateTo(1),
        'Show English cards only',
        6
    );

    renderButton(
        '🇫🇷',
        () => navigateTo(2),
        'Show French cards only',
        5
    );

    renderButton(
        '🇩🇪',
        () => navigateTo(3),
        'Show German cards only',
        4
    );

    renderButton(
        '🇪🇸',
        () => navigateTo(4),
        'Show Spanish cards only',
        3
    );

        renderButton(
        '🇮🇹',
        () => navigateTo(5),
        'Show Italian cards only',
        2
    );

    renderButton(
        '🇵🇹',
        () => navigateTo(8),
        'Show Portuguese cards only',
        1
    );

    renderButton(
        '🇳🇱',
        () => navigateTo(12),
        'Show Dutch cards only',
        0
    );

    function renderButton(languageFlag, callback, title, index) {
        const buttonElement = document.createElement('button');

        setButtonStyling(buttonElement, index)
        buttonElement.innerText = languageFlag;
        buttonElement.addEventListener('click', callback);
        buttonElement.setAttribute('title', title);

        document.body.appendChild(buttonElement);
    }

    function setButtonStyling(element, index) {
        element.style.position = 'fixed';
        element.style.bottom = `${(index + 1) * 16 + index * 36}px`;
        element.style.left = '16px';
        element.style.backgroundColor = '#ffffff';
        element.style.border = '0';
        element.style.borderRadius = '8px';
        element.style.padding = '0 8px';
        element.style.cursor = 'pointer';
        element.style.boxShadow = '5px 5px 5px 0px rgba(0,0,0,0.25)';
        element.style.transition = '300ms ease all';
        element.style.fontSize = '26px';

        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-4px)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    }

    /**
     * @param {number} languageNumber
     */
    function navigateTo(languageNumber) {
        const searchParams = new URLSearchParams(window.location.search);
        const languageSearchParam = searchParams.get('language');

        searchParams.set(
            'language', 
            languageSearchParam
                ? `${languageSearchParam}${languageSearchParam.includes(languageNumber) ? '' : `,${languageNumber}`}`
                : languageNumber
        );

        window.location.search = searchParams.toString();
    }
})();