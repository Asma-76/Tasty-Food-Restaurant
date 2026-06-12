document.addEventListener('DOMContentLoaded', () => {

  // ==================== 1. Basic Elements ====================
  const mainHeader = document.querySelector('.main-header');
  const backToTop = document.getElementById('backToTop');
  const heroImage = document.querySelector('.hero-image .main-burger-img');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const filterTabs = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');
  const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
  const wishlistIcons = document.querySelectorAll('.wishlist-icon');
  const subscribeForm = document.getElementById('subscribeForm');
  const subEmail = document.getElementById('subEmail');
  const toastEl = document.getElementById('toast');
  const cartIcon = document.querySelector('.cart-icon');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartClose = document.getElementById('cartClose');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmptyMsg = document.getElementById('cartEmpty');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalSpan = document.getElementById('cartTotal');

  // Add cart counter
  let cartCounter = document.querySelector('.cart-counter');
  if (!cartCounter && cartIcon) {
    cartCounter = document.createElement('span');
    cartCounter.className = 'cart-counter';
    cartCounter.style.cssText = `
      position: absolute; top: -8px; right: -12px; background: #ff0000;
      color: white; font-size: 11px; font-weight: bold; width: 18px;
      height: 18px; border-radius: 50%; display: flex; align-items: center;
      justify-content: center; font-family: monospace;
    `;
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(cartCounter);
  }
});