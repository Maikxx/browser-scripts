// ==UserScript==
// @name         Plein (and later others) - Show price per unit of product
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show all prices per unit (ml, l, etc.) of products
// @author       You
// @include      https://www.plein.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bulbagarden.net
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const productCards = document.querySelectorAll('.product-view-info');

    if (!productCards || !productCards.length) return;

    productCards.forEach(productCard => {
        const productSizeElement = productCard.querySelector('.volume');
        const productTitleElement = productCard.querySelector('.product-title');
        const productPriceElement = productCard.querySelector('.product-view-price strong');

        if (!productSizeElement || !productPriceElement || !productTitleElement) return;

        const productTitle = productTitleElement.textContent;
        const productCountText = productTitle.match(/[0-9]+x/gm);
        const productSizeProperty = productSizeElement.textContent.split(' ').filter(Boolean);
        const price = parseFloat(productPriceElement.textContent.replace(',', '.'));
        
        if (!productSizeProperty || !productSizeProperty.length || !price) return;

        const size = Number(productSizeProperty[0]);
        const unit = productSizeProperty[1];

        if (!size || !unit) return;

        let pricePerUnit;

        if (productCountText !== null) {
            const productCount = Number(productCountText[0].replace('x', ''));
            pricePerUnit = (price / (size * productCount)).toFixed(5);
        } else {
            pricePerUnit = (price / size).toFixed(5);
        }

        let outputText;

        if (unit === 'ml') {
            const pricePerLiter = pricePerUnit * 1000;

            outputText = `${pricePerUnit} per ${unit}, ${pricePerLiter.toFixed(2)} per l`;
        } else {
            outputText = `${pricePerUnit} per ${unit}`;
        }

        const outputElement = document.createElement('span');
        outputElement.style.fontSize = '0.7rem';
        outputElement.textContent = outputText;
        
        productPriceElement.parentElement?.appendChild(outputElement);
    }, []);
})();