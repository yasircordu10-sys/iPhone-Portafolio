import { cart, removeFromCart, updateDeliveryOption, updateQuantity } from "../../data/cart.js";
import { products, getProduct} from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";


export function renderOrderSummary(){


  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {

    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId)



    const deliveryOptionId = cartItem.deliveryOptionId

    const deliveryOption = getDeliveryOption(deliveryOptionId)


    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');


    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label">${cartItem.quantity}</span>
            </span>
            <input class="quantity-input js-quantity-input" type="number" min="1" value="${cartItem.quantity}">
            <span class="save-quantity-link link-primary js-save-link">
              Save
            </span>
            <span class="update-quantity-link link-primary js-update-link">
              Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    
    `;
  });


  function deliveryOptionHTML(matchingProduct, cartItem) {
    let hmtl = '';

    
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
      const dateString = deliveryDate.format('dddd, MMMM D');
      const priceString = deliveryOption.priceCents === 0 ? 'FREE Shipping' : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      hmtl += `<div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
            <input type="radio"
              ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString}
              </div>
            </div>
          </div>
      `
    });

    return hmtl;
  }


  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();

      renderPaymentSummary();

    });
  });


  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();



      })
    });


  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const container = link.closest('.cart-item-container');
      container.classList.add('is-editing-quantity');

      const input = container.querySelector('.quantity-input');
      input.focus();
      input.select();
    });
  });


  function trySaveQuantity(container) {
    const productId = container.dataset.productId;
    const input = container.querySelector('.quantity-input');
    const newQuantity = Number(input.value);

    if (!Number.isInteger(newQuantity) || newQuantity <= 0) {
      input.classList.add('quantity-input-error');
      return;
    }

    updateQuantity(productId, newQuantity);
    renderOrderSummary();
    renderPaymentSummary();
  }

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      trySaveQuantity(link.closest('.cart-item-container'));
    });
  });

  document.querySelectorAll('.quantity-input').forEach((input) => {
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        trySaveQuantity(input.closest('.cart-item-container'));
      }
    });
  });

}
