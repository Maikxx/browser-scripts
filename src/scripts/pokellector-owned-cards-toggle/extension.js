// ==UserScript==
// @name         Pokellector - Toggle for showing only owned cards.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to toggle between showing only cards that you own and showing all the cards in a set.
// @author       M.B. van Veen
// @include      https://www.pokellector.com/sets/*
// @include      https://jp.pokellector.com/sets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokellector.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const TEXT = {
        display: {
            brightenImages: 'Brighten up images',
            dimImages: 'Dim images'
        }
    };

    const STATE = {
        brightened: false,
        initialFadedOpacity: '1'
    };

    const SELECTORS = {
        card: '.card:not(img)',
        imageCard: 'img.card',
        toggleBrightnessButton: '#toggleBrightnessButton'
    };

    const IMAGES = {
        moon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABagAAAWoBe63YNgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHqSURBVFiFxde/axRBFMDxzzs1UUhhIKa4QEREEVP5C9PY2ViIWPkPWNiIWAQtFcQgNrY2go2doJW9gmJloTGx0EKihKCiEEQlMhb3g/O8vd1LduODBwf7dr7fmxlm30gpKZKYxn08x3jR93LHzYEGTuIxUkfur1wA+zDXBU54UBY8UwAHsdwD/gt7KhXAMXzrAU+4VSb8HwGcwPcMeEK9bIFogkXEKN5hu97xOaU0lvFszVHr+H25Dxxelw1vC0TEBM7n1M5VJoAr2JZT+7UKAahjVfbGa+WjsjdgSkkNB7CpgOihKv59DVMFa3dExOT/FKCCWRhUYCYiavllg8WK/A3YmTOlHsX4NKDADyV+jmtYGnDGhnE3IvLOjUKxFgE4jBcRMb0WaETsjojbETELswZbgs5cxQ0MF1zvEVzXWMaEj3BkHQKtXMA1nMZkF3RUo8e4iA9d791sFb0vQaIzl/EEi31qfmNXS+BSyQJF8mG7I9L4EnZPT9V5/K+WDGc3EP4sqye8twHwNxjLEtiqcfOpCr6InZldcVNiHE8rgH/BVN+2vENiCHdKhC/gaE9Wzsl1Bm/XAV7COWzOZBQ4PodwAfMDgFdwFSN547cvJkUiIvbilMbdsY4JbNFo2V/hZTPnU0o/i4z5B240zULpPOYVAAAAAElFTkSuQmCC',
        sun: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAnPAAAJzwHc8A8YAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAFpQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsR9YqAAAAB10Uk5TAAEEBQkcIyZfaXB6fn+AgZCbnaOvs7W3yebs9vrJhHE1AAAA1ElEQVQ4y6WT2XKDMAxFLxjCWmICJBA4//+bfWBK8LgTdblPsnVGtjYpUD7Pud6phfYt4MH/BbgMjdutEsrdcs1wOYABxnS/rqodTUcYDqAB+jBoDzTHyY2wZWd/tsHoXue0326Sim5alqkrJN22Pg1CZlJSrwCw1omURakkdw7dk29yrTmpjv3FegbWIgI6An28+td6XzppCoFJcqX3ba4ZoJKWEFikCmC2AfMJ85M/TtMslFVqo1lf7b4+ns/HNW63OTDmyJlDa479/zfrF8sbr/8nVZojj3O/X0gAAAAASUVORK5CYII=',
        ownedCards: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAOvSURBVFiFxZddbBRlFIafMzuz2y7dtkCvaDQGLWkLGhOlQowGLoxSSMSoF1qIGmJEIiHGmK6NJptQoMW/EKOBkCjSKDEEMJHYCyMXcqMNBk2MxSrRiG0hu/2h7W7b3Z05XvSHTt3dmaUpvnf7nfc777tn5ptzPvALVWEoVulFq7wYq0QRv2kNv8TAwL5tZtbst+Ktx4OJ/bXz4xU90ZXl3dFDTmjin/Jfm5v85vXntC8WtqxAtyK3T684wNeIHloSTw6psgd4BjCnk/YGtaQ2vjo25pXa9KNvBgMtqrPiMFW5LahsUf0vX6F6Uiabgbe8cntXYKD1NtPhEhDOFQ7H8/7JCUOoG65r++umDISu7b0za0iDwE7g4Xy8AgYQ+E6Fw5K1u67f/fZlTwNmojWK8hDQAFQVcu7HwDwkgC4RPX+9rr1tZtF9CpQXgEa/4kWiCmhUlefnLs4/hr2LIOyCilvDZUDQRTcgWsCA6i2ogEqhCizcwFKjlFcj6wjk+ciKoXkMxNsjKsZzCxEvxaRj2VaikQfZWXZfTo4qLy693FzhNqBHLFMyJ0Fz7/KBAAYfLmtkbXAFF9P9fJL8KSdP4J7sBGf4fXdoyoCqWPH4UZRHCwnUG8sLGthbsYHNJTX8mR2mafAMKc3k5YrIxvJM2TE0ZgTMV6x3EV4ulLyl5AE+X7KZP5xhfrETrpiVSvNaZD27yxq4ZifZOvAFV51kQbPTWBNK2FUG5GonbvzmDOGgHAs/RlPQ3YmfCtfzemQ9Y5rm2cHTXLFH/IgDIOKMB5yD574JJM/fgXBvPmK3PUCPM8QT1l08btXMVmJHcA3vhzZgo2wf/JIL6T7f4sCJkbrSXVO9QI9Y5kD8K6/34OngKo6HNyEIByZ+oDm0lmxqgl1DnZwe7/atrMK5UTPZSM0HkzeaUV8sbJrmtwjrCm1+MriKjvAmrOkD9EZ/Jx+NXfAtDvwYNJyNidqDozD3O7AilhI44bX7VLqH7alOMjgcTv9crDiofjojDvMmIhWq/eQ4le6h1x6ly75KSXHyqIhLw2VAoNrzSEzje7u/SOkbGnN/u5sR/iqwEKhqfgPcAgNS6BEgfFzsSFYEZkcyt2Qe/C9DaU7c5FguMC5CvddY7n01W/7mFYT3PHnzoPCOl7g/A0A2nT0g6N9zlhzgLKKPiHA/0AFkZ4ICvaWZbLuf3L5vsYHEvm2ielTgpIixP13VcmluvKInulJt9qDsQHlpZHXbZ35z+8MiXc//BYHWZLzJ4GevAAAAAElFTkSuQmCC',
        neededCards: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA+QAAAPkBHYYEgQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAATBSURBVFiFtZfNbxNHGMafeWfWieOES5AaonyhpiUR4lYpiX1hkSKhBFG4gARK/4eUlqQq4oCQSNxDRXvkjFS4EC4uxEDEAX+ot1ZKDnCgakk4xD1kk6w/5qMH2xuv7U2sKDyn9cz4fX47M+87s8wYg1b0bmqqrV3gnNH0NQijMDgB4ESlewMMG9BYY6Sf5iVeDScShVbisoMA/j5//gRZ/LYBu86ArlaCGsBhMA91Sd0ZfPZs41AA7227nUcit8AwC6CjFeMm2oXBz2pn5+7Qykq+ZYD309M9nLMlGIwd0rjOBdntfHFmdHn57YEA/05PnzHEEgD6jsS8oqKUOWgz8/nz578HAryfnu7hxP44avOqHNctMEZnR5PJTLWNPHPbbuecLX0qcwBos6w2pdXLVdvubADgkcitI1vzAIWEADHWwS3+tNrGjDGVVBPv0GS3i54eHLtyFXJ9Hc7SExgp9zVhQqDr0mWI3l5sPX4E+fGjr78oJXbyeViCTYwmVzICAMjit5uZA8CxK1cRmZwsv8HICHIL9wIhmBDonv8B4bG9ifzvl/u+MZzKk85ADwCcoXdTU20G7HrQG8n1de85PDaG7rl5MCGam8/N+8xr/1sVVQBKSp9ete1Oahc4t1+Fc5aewM1m9yDGx9F9c84HwYRA9805hMfHvTY3m4Wz9KQRFOVZMMYwERI3+OwXp74Dw1dBANAabioFa2gIVl85Qaz+flgDA9hNpwAiHL85h3A0umeeySC3uBC4VFIpKK3BQJ/x2ZEvvwcwGAhQhUinYA0Owurv9yBCAwPoiMUQjsb2zNNp5OKL+25WpTWkUiAGQZVT7UAZKZGLL8JNpby2cLTOPJU60BwAqsVPAxECWgOoQmzGF+Gm3jT0uak32GzBHAB0BcBobdEBYz+JtNbeMwHY97yuFROisuFiDX3haAzH67KjmYwxUBUAxpgksNYAvFSr3e2pN77lCEejDSlar5JS3jMR7RI01loyn5tHeGKixjyFzXgcm/G4f2NOTAQWK6Bcir24YB/4tyPDCvtUQq+81haZdBq5n+KAUoAxcDNpf4r29cE6ebIMVrPeSmu4hb2roiXoV8pLvDKAEwTQdemyr7y6mUxDqnkpmvGOeYTHxtB16bIvVq05AwwXofs0nEgUGMzDIADR27sXIJsNrHBGSuQWF3xlu/a/RSl96y84Xx1OJLYEAOiSukOW+AZNTsStx48AoKXj2EiJ3MI933EMlKd+t+C/pRPYNaDmSvbPhQt3wfBjYPRDyhiDLdf15X5IWK9HksmzZZCK1M7OXTBkG0McXkrrBnNB5AjHuVj97QEMrazkt/PFmaKUuaMwL0oJp86cMaaIeGw4k9lqAACA0eXlt9BmxnHdQrGFmt5MSmtsuy528nnU3rgZY6qdiysjyeRfteObfpisTU6OK61eEmMdbZYFTgQiAgswNcagpFR5pzcBF0QOEY/VmwcCAMCqbXdyiz8tlOS5ahsn8mCMMdDGQGvt1fZmCgnrtXCci7XT3hJAVWuT9jgDPSgpfdoYEzQJ/qCAEZyvEti1Uy9e/Lnv2FY/z1dtu1OExA2lzFVjdI8GIkZrC6icakS7DOwDEX7jInR/OJFo+sb1+h9ZRUoxCF3PpgAAAABJRU5ErkJggg==',
        allCards: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAD9AAAA/QHie4OTAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAFFQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALIimcAAAABp0Uk5TAAIHFhgmKEJISVdke4COkJy4wcPM4evu/f6WfARCAAAA0ElEQVQ4jb2TyxKEIAwExweIsqD4Nv//oRsJnrOHLefUhV1lEgimi3LmCt0heHSoZsFrQvlOZBAfjDAPXiD6OOc8kcVIK6NbaYQl8owfIhYccB/cQmJEEsEyuj8J3lrbi7Aw2kWEntFnoeQWSrJQgtIwbTWGU/AcUG/leEZlbE7Nv2wFW8Za0FRQ08UxZwCaIBgaYBCMHcr86WwRnsIC2lIOHdzFmlJapIudMe3SxcK4vjVqVVCKVNtUB6VGvSz1utUH88OTe2HUyuqpy6ut/xcfOzjF6uWXoAAAAABJRU5ErkJggg=='
    }

    // TOGGLES //
    renderShowOwnedCardsButton();
    renderShowNeededCardsButton();
    renderShowAllCardsButton();
    renderBrightenImagesButton();

    // DISPLAY //
    setInitialFadedOpacity();
    toggleBrightness();

    // TOGGLES //
    function renderBrightenImagesButton() {
        renderButton(
            IMAGES.sun,
            toggleBrightness,
            TEXT.display.brightenImages,
            3,
            'toggleBrightnessButton'
        );
    }

    function renderShowOwnedCardsButton() {
        renderButton(
            IMAGES.ownedCards,
            showOwnedCards,
            'Show only owned cards in the set',
            2
        );
    }

    function renderShowNeededCardsButton() {
        renderButton(
            IMAGES.neededCards,
            showNeededCards,
            'Show only needed cards in the set',
            1
        );
    }

    function renderShowAllCardsButton() {
        renderButton(
            IMAGES.allCards,
            showAllCards,
            'Show all cards in the set',
            0
        );
    }

    function renderButton(base64Image, callback, title, index, id) {
        const buttonElement = document.createElement('button');
        const image = new Image();
        image.src = base64Image;

        setButtonStyling(buttonElement, index)
        buttonElement.appendChild(image);
        buttonElement.addEventListener('click', callback);
        buttonElement.setAttribute('title', title);

        if (id) {
            buttonElement.id = id;
        }

        document.body.appendChild(buttonElement);
    }

    function setButtonStyling(element, index) {
        element.style.position = 'fixed';
        element.style.bottom = `${(index + 1) * 16 + index * 48}px`;
        element.style.left = '16px';
        element.style.backgroundColor = '#ffffff';
        element.style.border = '0';
        element.style.borderRadius = '8px';
        element.style.padding = '8px';
        element.style.cursor = 'pointer';
        element.style.boxShadow = '5px 5px 5px 0px rgba(0,0,0,0.25)';
        element.style.transition = '300ms ease all';

        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-4px)';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    }

    function hideAllCards() {
        document.querySelectorAll(`${SELECTORS.card}:not([hidden])`).forEach(card => {
            card.setAttribute('hidden', '');
        });
    }

    function showAllCards() {
        document.querySelectorAll(`${SELECTORS.card}[hidden]`).forEach(card => {
            card.removeAttribute('hidden');
        });
    }

    function showNeededCards() {
        hideAllCards();

        document.querySelectorAll(`${SELECTORS.card}:not(.checked)`).forEach(card => {
            card.removeAttribute('hidden');
        });
    }

    function showOwnedCards() {
        hideAllCards();

        document.querySelectorAll(`${SELECTORS.card}.checked`).forEach(card => {
            card.removeAttribute('hidden');
        });
    }

    // DISPLAY //
    function setInitialFadedOpacity() {
        const imageCard = document.querySelector(SELECTORS.imageCard);

        STATE.initialFadedOpacity = imageCard.style.opacity;
    }

    function toggleBrightness() {
        const imageCards = document.querySelectorAll(SELECTORS.imageCard);
        
        STATE.brightened = !STATE.brightened;

        imageCards.forEach(imageCard => {
            imageCard.style.opacity = STATE.brightened ? '1' : STATE.initialFadedOpacity;
        });

        const toggleBrightnessButton = document.querySelector(SELECTORS.toggleBrightnessButton);

        toggleBrightnessButton.title = TEXT.display.dimImages;
        
        const toggleBrightnessButtonImage = toggleBrightnessButton.querySelector('img');
        toggleBrightnessButtonImage.src = STATE.brightened ? IMAGES.moon : IMAGES.sun;
    }
})();