export function renderCheckoutHeader() {
  const checkoutHeaderHTML = `
    <div class="header-content">
      <div class="checkout-header-left-section">
        <a href="amazon.html">
          <img class="amazon-logo" src="images/amazon-logo.png">
          <img class="amazon-mobile-logo" src="images/amazon-mobile-logo.png">
        </a>
      </div>

      <div class="checkout-header-middle-section">
        <a class="return-to-home-link" href="amazon.html">← Volver a la tienda</a>
      </div>
    </div>
  `;

  document.querySelector('.js-checkout-header').innerHTML = checkoutHeaderHTML;
}
