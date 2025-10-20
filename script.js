// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.menu-lateral [data-filter]');
  const cards = document.querySelectorAll('.produtos .card');

  function setActiveFilter(activeEl) {
    filters.forEach(f => f.classList.remove('destaque'));
    activeEl.classList.add('destaque');
  }

  function filterCards(filter) {
    if (filter === 'all') {
      cards.forEach(c => c.style.display = '');
      return;
    }
    cards.forEach(card => {
      const cat = (card.dataset.category || '').toLowerCase();
      card.style.display = (cat === filter) ? '' : 'none';
    });
  }

  filters.forEach(item => {
    const filter = (item.dataset.filter || '').toLowerCase();
    item.addEventListener('click', () => {
      setActiveFilter(item);
      filterCards(filter);
    });
    item.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        item.click();
      }
    });
  });
});
// ...existing code...
// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
  const filters = document.querySelectorAll('.menu-lateral [data-filter]');
  const cards = document.querySelectorAll('.produtos .card');

  function setActiveFilter(activeEl) {
    filters.forEach(f => f.classList.remove('destaque'));
    activeEl.classList.add('destaque');
  }

  function filterCards(filter) {
    if (filter === 'all') {
      cards.forEach(c => c.style.display = '');
      return;
    }
    cards.forEach(card => {
      const cat = (card.dataset.category || '').toLowerCase();
      card.style.display = (cat === filter) ? '' : 'none';
    });
  }

  filters.forEach(item => {
    const filter = (item.dataset.filter || '').toLowerCase();
    item.addEventListener('click', () => {
      setActiveFilter(item);
      filterCards(filter);
    });
    item.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        item.click();
      }
    });
  });

  // --- carrinho / comprar ---
  const CART_KEY = 'bt_cart_items';
  const cartBadge = document.querySelector('.cart-badge');
  const buyButtons = document.querySelectorAll('.btn-comprar');

  function getCart(){
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch(e) { return []; }
  }
  function setCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBadge();
  }
  function getCartCount(){
    const cart = getCart();
    return cart.reduce((s,i) => s + (i.qty || 0), 0);
  }
  function updateBadge(){
    if(!cartBadge) return;
    cartBadge.textContent = String(getCartCount());
  }

  function addToCart(name){
    const cart = getCart();
    const idx = cart.findIndex(i => i.name === name);
    if(idx >= 0) cart[idx].qty += 1;
    else cart.push({ name, qty: 1 });
    setCart(cart);
  }

  // inicializa badge
  updateBadge();

  buyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name || 'item';
      addToCart(name);
      // feedback simples
      const oldText = btn.textContent;
      btn.textContent = 'Adicionado';
      setTimeout(() => btn.textContent = oldText, 900);
      console.log(`Adicionado ao carrinho: ${name}`);
    });
  });

  // --- modal do carrinho ---
  const cartBtn = document.querySelector('.cart-btn');
  const modal = document.querySelector('.cart-modal');
  const cartItemsList = document.querySelector('.cart-items');
  const cartEmptyMsg = document.querySelector('.cart-empty');
  const cartTotalEl = document.querySelector('.cart-total');
  const btnClear = document.querySelector('.btn-clear');
  const btnCheckout = document.querySelector('.btn-checkout');
  const cartClose = document.querySelector('.cart-close');
  const cartOverlay = document.querySelector('.cart-overlay');

  function openModal(){
    if(!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    renderCart();
  }
  function closeModal(){
    if(!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
  }

  function renderCart(){
    const cart = getCart();
    cartItemsList.innerHTML = '';
    if(cart.length === 0){
      cartEmptyMsg.style.display = 'block';
      cartTotalEl.textContent = '0';
      return;
    }
    cartEmptyMsg.style.display = 'none';
    cart.forEach(item => {
      const li = document.createElement('li');
      li.setAttribute('data-name', item.name);
      li.innerHTML = `
        <span class="cart-item-name">${escapeHtml(item.name)}</span>
        <span>
          <span class="qty">x${item.qty}</span>
          <button class="btn-remove" type="button" title="Remover">✕</button>
        </span>
      `;
      const removeBtn = li.querySelector('.btn-remove');
      removeBtn.addEventListener('click', () => {
        removeFromCart(item.name);
      });
      cartItemsList.appendChild(li);
    });
    cartTotalEl.textContent = String(getCartCount());
  }

  function removeFromCart(name){
    let cart = getCart();
    cart = cart.filter(i => i.name !== name);
    setCart(cart);
    renderCart();
  }

  function clearCart(){
    setCart([]);
    renderCart();
  }

  function checkout(){
    const total = getCartCount();
    if(total === 0){
      alert('Seu carrinho está vazio.');
      return;
    }
    // rotina simples de finalização
    alert(`Finalizando compra de ${total} item(ns). Obrigado!`);
    clearCart();
    closeModal();
  }

  if(cartBtn) cartBtn.addEventListener('click', openModal);
  if(cartClose) cartClose.addEventListener('click', closeModal);
  if(cartOverlay) cartOverlay.addEventListener('click', closeModal);
  if(btnClear) btnClear.addEventListener('click', () => {
    if(confirm('Deseja limpar o carrinho?')) clearCart();
  });
  if(btnCheckout) btnCheckout.addEventListener('click', checkout);

  document.addEventListener('keydown', (ev) => {
    if(ev.key === 'Escape') closeModal();
  });

  // pequena proteção para saídas no console
  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[s]);
  }
});
// ...existing code...