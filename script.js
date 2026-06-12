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

  
  // ==================== 3. Wishlist ====================
  wishlistIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const i = icon.querySelector('i');
      const isActive = i.classList.contains('fas');
      if (isActive) {
        i.classList.remove('fas');
        i.classList.add('far');
        showToast('Removed from wishlist 💔');
      } else {
        i.classList.remove('far');
        i.classList.add('fas');
        i.style.color = '#ff0000';
        showToast('Added to wishlist ❤️');
      }
    });
  });

  // ==================== 4. Product Filtering & "No Products" Message ====================
  function assignCategories() {
    productCards.forEach(card => {
      const title = card.querySelector('h3')?.innerText.toLowerCase() || '';
      let cat = 'other';
      if (title.includes('burger')) cat = 'burger';
      else if (title.includes('french fry')) cat = 'french fry';
      else if (title.includes('pasta')) cat = 'pasta';
      else if (title.includes('sandwich')) cat = 'sandwich';
      else if (title.includes('cold drinks')) cat = 'cold drinks';
      else if (title.includes('combo')) cat = 'combo';
      card.dataset.category = cat;
    });
  }
  assignCategories();

  const productsGrid = document.querySelector('.products-grid');
  let noProductsMsg = null;

  function showNoProductsMessage(show, categoryName = '') {
    if (show) {
      if (!noProductsMsg) {
        noProductsMsg = document.createElement('div');
        noProductsMsg.className = 'no-products-msg';
        productsGrid.parentElement.style.position = 'relative';
      }
      noProductsMsg.innerHTML = `🍕 No products available in "${categoryName}" category at the moment. Coming very soon!`;
      if (!noProductsMsg.parentNode) productsGrid.insertAdjacentElement('afterend', noProductsMsg);
      productsGrid.style.display = 'none';
    } else {
      if (noProductsMsg && noProductsMsg.parentNode) noProductsMsg.remove();
      productsGrid.style.display = 'grid';
    }
  }

  function filterProducts(category, displayName = '') {
    let anyVisible = false;
    productCards.forEach(card => {
      const match = (category === 'all' || card.dataset.category === category);
      card.style.display = match ? 'flex' : 'none';
      if (match) anyVisible = true;
    });
    if (!anyVisible && category !== 'all') {
      showNoProductsMessage(true, displayName || category);
    } else {
      showNoProductsMessage(false);
    }
  }

  filterTabs.forEach(tab => {
    const handler = () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      let filterText = tab.innerText.trim().toLowerCase();
      let cat = 'all';
      let displayCat = tab.innerText.trim();
      if (filterText === 'burger') cat = 'burger';
      else if (filterText === 'sandwich') cat = 'sandwich';
      else if (filterText === 'cold drinks') cat = 'cold drinks';
      else if (filterText === 'pasta') cat = 'pasta';
      else if (filterText === 'combo') cat = 'combo';
      else if (filterText === 'french fry') cat = 'french fry';
      else if (filterText === 'pizza') cat = 'pizza';
      else cat = 'all';
      filterProducts(cat, displayCat);
      if (cat !== 'all') showToast(`🔄 Showing ${displayCat}`);
    };
    tab.addEventListener('click', handler);
  });
  filterProducts('all');

  // ==================== 5. Hide Header on Scroll Down ====================
  let lastScrollTop = 0;
  const scrollThreshold = 80;
  if (mainHeader) {
    window.addEventListener('scroll', () => {
      let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
        mainHeader.style.transform = 'translateY(-100%)';
      } else if (currentScroll < lastScrollTop || currentScroll <= 10) {
        mainHeader.style.transform = 'translateY(0)';
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
  }


  // ==================== 6. Back to Top Button ====================
  window.addEventListener('scroll', () => {
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 300);
  });
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ==================== 7. Smooth Anchor Links ====================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==================== 8. Newsletter ====================
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = subEmail.value.trim();
      if (!email || !email.includes('@')) {
        showToast('Please enter a valid email address.', true);
        return;
      }
      showToast(`📧 Thanks! ${email} has been subscribed!`);
      subEmail.value = '';
    });
  }

  // ==================== 9. Image Gallery (Lightbox) ====================
  galleryItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999;
        display: flex; align-items: center; justify-content: center; cursor: zoom-out;
        animation: fadeInUp 0.3s ease;
      `;
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.alt = img.alt;
      bigImg.style.cssText = 'max-width: 90vw; max-height: 90vh; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.8);';
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '&times;';
      closeBtn.style.cssText = `
        position: absolute; top: 20px; right: 30px; background: none; color: #fff;
        font-size: 2.5rem; border: none; cursor: pointer; font-family: sans-serif;
        transition: color 0.2s;
      `;
      closeBtn.addEventListener('mouseover', () => closeBtn.style.color = '#ff0000');
      closeBtn.addEventListener('mouseout', () => closeBtn.style.color = '#fff');
      overlay.appendChild(bigImg);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';
      const remove = () => {
        document.body.removeChild(overlay);
        document.body.style.overflow = '';
      };
      overlay.addEventListener('click', remove);
      closeBtn.addEventListener('click', (e) => { e.stopPropagation(); remove(); });
    });
  });

  // ==================== 10. Scroll Reveal Effect ====================
  const revealElements = document.querySelectorAll(
    '.product-card, .category-item, .promo-card, .about-content, .gallery-item, .feedback-card, .news-card'
  );
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // ==================== 11. Hero Image Parallax ====================
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const offset = window.scrollY * 0.15;
      heroImage.style.transform = `translateY(${offset}px)`;
    });
  }

  // ==================== 12. "View All" Button for Products ====================
  const viewAllBtn = document.querySelector('.view-all-products-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const allTab = Array.from(filterTabs).find(tab => tab.innerText.trim().toLowerCase() === 'all foods');
      if (allTab) allTab.click();
      showToast('🍽️ Showing all products');
    });
  }

  // ==================== 13. Mobile Menu (Hamburger) ====================
  const navLinksUl = document.querySelector('.nav-links');
  const navbarDiv = document.querySelector('.navbar');
  let hamburger = document.getElementById('hamburger');
  if (navLinksUl && navbarDiv && !hamburger && window.innerWidth <= 992) {
    hamburger = document.createElement('div');
    hamburger.id = 'hamburger';
    hamburger.className = 'hamburger';
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    hamburger.style.cssText = `
      display: flex; flex-direction: column; justify-content: space-between;
      width: 28px; height: 20px; cursor: pointer; z-index: 1001;
    `;
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => {
      span.style.cssText = `
        width: 100%; height: 3px; background-color: white; border-radius: 3px;
        transition: all 0.3s ease;
      `;
    });
    const navRight = document.querySelector('.nav-right');
    if (navRight) navbarDiv.insertBefore(hamburger, navRight);
    else navbarDiv.appendChild(hamburger);

    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 992px) {
        .nav-links { position: fixed; top: 0; right: -280px; width: 260px; height: 100vh;
          background: #111; flex-direction: column; padding: 80px 30px; gap: 25px;
          transition: right 0.3s ease; z-index: 1000; box-shadow: -5px 0 20px rgba(0,0,0,0.5); }
        .nav-links.open { right: 0; }
        .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(6px, 6px); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(6px, -6px); }
      }
    `;
    document.head.appendChild(style);

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinksUl.classList.toggle('open');
    });
    navLinksUl.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinksUl.classList.remove('open');
      });
    });
    document.addEventListener('click', (e) => {
      if (!navbarDiv.contains(e.target) && navLinksUl.classList.contains('open')) {
        hamburger.classList.remove('open');
        navLinksUl.classList.remove('open');
      }
    });
  }

  // Initialize cart and final logs
  updateCartUI();
  console.log('✅ Tasty Foods fully loaded');

});


