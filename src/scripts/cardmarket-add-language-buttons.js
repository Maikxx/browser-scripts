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

    const AVAILABLE_LANGUAGES_INPUT_ELEMENTS_SELECTOR = '#articleFilterProductLanguage input';
    const LANUAGE_URL_PARAM_KEY = 'language';

    const availableLanguagesInputElements = document.querySelectorAll(AVAILABLE_LANGUAGES_INPUT_ELEMENTS_SELECTOR);
    
    const searchParams = new URLSearchParams(window.location.search);
    const languageSearchParam = searchParams.get(LANUAGE_URL_PARAM_KEY);
    const selectedLanguages = getSelectedLanguageIds(languageSearchParam);

    renderLanguageButtons();

    function renderLanguageButtons() {
        [...availableLanguagesInputElements].reverse().forEach((inputElement, index) => {
            const languageValue = inputElement.getAttribute('value');

            if (!languageValue) {
                console.error(`Failed to get language id for input element with index: ${index}`);
                return;
            }

            const labelElement = inputElement.nextElementSibling;

            if (!labelElement) {
                console.error(`Failed to find a label for input element with index: ${index}`);
                return;
            }

            const iconElement = labelElement.querySelector('.icon');
            const textElement = labelElement.querySelector('span:nth-child(2)');
            

            if (!iconElement) {
                console.error(`Failed to find an icon for input element with index: ${index}`);
                return;
            }

            if (!textElement) {
                console.error(`Failed to find a text element for input element with index: ${index}`);
                return;
            }

            const text = textElement.innerText;

            if (!text) {
                console.error(`Failed to find a language text for input element with index: ${index}`);
                return;
            }

            renderButton(
                iconElement.cloneNode(true),
                languageId => navigateTo(languageId),
                `Show ${text} cards`,
                index,
                Number(languageValue)
            )
        });
    }

    /**
     * @param {HTMLElement} iconElement 
     * @param {Function} callback 
     * @param {string} title 
     * @param {number} index 
     * @param {number} languageId 
     */
    function renderButton(iconElement, callback, title, index, languageId) {
        const buttonElement = document.createElement('button');

        setButtonStyling(buttonElement, index, languageId)

        // Remove unnecessary attributes from iconElement
        removeAttributesFromIconElement(iconElement);

        buttonElement.appendChild(iconElement);
        buttonElement.addEventListener('click', () => callback(languageId));
        buttonElement.setAttribute('title', title);

        document.body.appendChild(buttonElement);
    }

    /**
     * @param {HTMLElement} iconElement 
     */
    function removeAttributesFromIconElement(iconElement) {
        const attributesToRemove = [
            'class',
            'data-toggle',
            'data-html',
            'data-placement',
            'onmouseover',
            'onmouseout',
            'data-original-title',
            'title'
        ];

        attributesToRemove.forEach(attributeName => {
            iconElement.removeAttribute(attributeName);
        });
    }

    /**
     * @param {HTMLElement} element
     * @param {number} index
     * @param {number} languageId
     */
    function setButtonStyling(element, index, languageId) {
        const SPACING = 16;
        const isSelected = selectedLanguages.includes(languageId);
        
        element.style.display = 'flex';
        element.style.alignItems = 'center';
        element.style.position = 'fixed';
        element.style.left = '8px';
        element.style.border = isSelected ? '2px solid rgb(40,167,69)' : '0';
        element.style.backgroundColor = '#ffffff';
        element.style.borderRadius = '8px';
        element.style.padding = '16px';
        element.style.cursor = 'pointer';
        element.style.boxShadow = '5px 5px 5px 0px rgba(0,0,0,0.25)';
        
        setTimeout(() => {
            element.style.bottom = `${(index + 1) * SPACING + index * element.offsetHeight}px`;
        }, 0)
    }

    /**
     * @param {string | null} languageSearchParam
     * @returns {number[]}
     */
    function getSelectedLanguageIds(languageSearchParam) {
        if (!languageSearchParam) return [];

        const selectedLanguages = languageSearchParam.split(',');

        return selectedLanguages.map(Number);
    }

    /**
     * @param {number} languageId
     */
    function navigateTo(languageId) {
        // Set the first language to the url
        if (!selectedLanguages || !selectedLanguages.length) {
            searchParams.set(
                LANUAGE_URL_PARAM_KEY, 
                String(languageId)
            );
        } else {
            const languageAlreadyChosen = selectedLanguages.includes(languageId);

            // Remove the language from the list of languages
            if (languageAlreadyChosen) {
                searchParams.set(
                    LANUAGE_URL_PARAM_KEY, 
                    selectedLanguages.reduce((out, selectedLanguage) => 
                        selectedLanguage !== languageId ? `${out},${selectedLanguage}` : out
                    , '')
                );
            } else {
                // Add the language to the list of languages
                searchParams.set(
                    LANUAGE_URL_PARAM_KEY, 
                    selectedLanguages.concat([languageId]).join(',')
                );
            }
        }

        window.location.search = searchParams.toString();
    }
})();