import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { cart } from '../data/cart.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

function updateCartQuantity() {
  let totalQuantity = 0;

  cart.forEach((cartItem) => {
    totalQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;
}

updateCartQuantity();

function productsHTML(order) {
  let html = '';

  order.items.forEach((orderItem) => {
    const product = getProduct(orderItem.productId);

    html += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>

      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${orderItem.estimatedDeliveryTime}
        </div>
        <div class="product-quantity">
          Quantity: ${orderItem.quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });

  return html;
}

let ordersHTML = '';

if (orders.length === 0) {
  ordersHTML = `
    <div class="no-orders-message">
      No has hecho ningún pedido todavía.
    </div>
  `;
} else {
  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTimeMs).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML(order)}
        </div>
      </div>
    `;
  });
}

document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

document.querySelectorAll('.js-buy-again').forEach((button) => {
  button.addEventListener('click', () => {
    // El botón "Buy it again" queda listo para conectarse a
    // addToCart() cuando quieras esa función; por ahora solo
    // marca la intención en consola para no dejarlo sin reacción.
    console.log('Buy again:', button.dataset.productId);
  });
});
