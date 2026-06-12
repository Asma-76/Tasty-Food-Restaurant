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

  
  // ==================== 2. Cart System ====================
  let cart = JSON.parse(localStorage.getItem('tastyCart') || '[]');

  function saveCart() { localStorage.setItem('tastyCart', JSON.stringify(cart)); }

  function showToast(message, isError = false) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.borderLeftColor = isError ? '#ff4444' : '#ff0000';
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3000);
  }

  function updateCartUI() {
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item:not(#cartEmpty)');
    existingItems.forEach(el => el.remove());

    if (cart.length === 0) {
      if (cartEmptyMsg) cartEmptyMsg.style.display = 'flex';
      if (cartFooter) cartFooter.style.display = 'none';
      if (cartCounter) cartCounter.textContent = '0';
      return;
    }

    if (cartEmptyMsg) cartEmptyMsg.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    let total = 0;
    let itemCount = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      itemCount += item.quantity;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.dataset.id = item.id;
      div.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-img" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 60 60%22%3E%3Crect width=%2260%22 height=%2260%22 fill=%22%23333%22/%3E%3Ctext x=%2230%22 y=%2235%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2220%22%3E🍔%3C/text%3E%3C/svg%3E'">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span>$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn dec-qty">−</button>
          <span class="qty-num">${item.quantity}</span>
          <button class="qty-btn inc-qty">+</button>
        </div>
        <button class="cart-item-remove"><i class="fas fa-trash-alt"></i></button>
      `;
      cartItemsContainer.appendChild(div);

      div.querySelector('.dec-qty').addEventListener('click', () => {
        if (item.quantity > 1) item.quantity--;
        else cart = cart.filter(c => c.id !== item.id);
        saveCart(); updateCartUI();
        showToast(`${item.name} quantity updated`);
      });
      div.querySelector('.inc-qty').addEventListener('click', () => {
        item.quantity++;
        saveCart(); updateCartUI();
        showToast(`${item.name} quantity updated`);
      });
      div.querySelector('.cart-item-remove').addEventListener('click', () => {
        cart = cart.filter(c => c.id !== item.id);
        saveCart(); updateCartUI();
        showToast(`${item.name} removed from cart`);
      });
    });

    if (cartTotalSpan) cartTotalSpan.textContent = `$${total.toFixed(2)}`;
    if (cartCounter) cartCounter.textContent = itemCount;
  }

  function addToCart(id, name, price, imgSrc) {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({ id, name, price, imgSrc, quantity: 1 });
    saveCart();
    updateCartUI();
    showToast(`🛒 ${name} added to cart!`);
    openCartSidebar();
  }

  function openCartSidebar() {
    if (cartSidebar) cartSidebar.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeCartSidebar() {
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (cartIcon) cartIcon.addEventListener('click', openCartSidebar);
  if (cartClose) cartClose.addEventListener('click', closeCartSidebar);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartSidebar?.classList.contains('open')) closeCartSidebar();
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) { showToast('Your cart is empty', true); return; }
      showToast('✅ Order placed! Thank you!');
      cart = [];
      saveCart();
      updateCartUI();
      closeCartSidebar();
    });
  }

  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = btn.closest('.product-card');
      if (!card) return;
      const name = card.querySelector('h3')?.innerText.trim() || 'Item';
      const priceText = card.querySelector('.price')?.innerText.replace('$', '') || '0';
      const price = parseFloat(priceText);
      const img = card.querySelector('.product-img-box img')?.getAttribute('src') || '';
      const id = name.replace(/\s/g, '-').toLowerCase();
      addToCart(id, name, price, img);
    });
  });


});