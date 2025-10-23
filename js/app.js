// app.js - lógica central. Filtra por categoría tomada del atributo data-category del <body>.
// Calcula cuotas 3/6 sin interés (ilustrativas), muestra envío gratis y controla carrito demo.

(() => {
  // Productos ejemplo (agrega categorías para filtrar)
  const products = [
    { id:1, title:'Smartphone Ultra 128GB', price:79999, image:'https://via.placeholder.com/420x300?text=Smartphone', shippingFree:true, eligible3:true, eligible6:true, category:'Celulares' },
    { id:2, title:'Auriculares Bluetooth ANC', price:12999, image:'https://via.placeholder.com/420x300?text=Auriculares', shippingFree:true, eligible3:true, eligible6:false, category:'Electrónica' },
    { id:3, title:'Smart TV 43" 4K', price:199999, image:'https://via.placeholder.com/420x300?text=Smart+TV', shippingFree:false, eligible3:true, eligible6:true, category:'Electrónica' },
    { id:4, title:'Notebook Pro 16GB', price:159999, image:'https://via.placeholder.com/420x300?text=Notebook', shippingFree:false, eligible3:true, eligible6:true, category:'Electrónica' },
    { id:5, title:'Licuadora Compacta 800W', price:12499, image:'https://via.placeholder.com/420x300?text=Licuadora', shippingFree:true, eligible3:true, eligible6:false, category:'Hogar' },
    { id:6, title:'Zapatillas Running', price:7899, image:'https://via.placeholder.com/420x300?text=Zapatillas', shippingFree:true, eligible3:false, eligible6:false, category:'Moda' },
    { id:7, title:'Pelota de fútbol oficial', price:4599, image:'https://via.placeholder.com/420x300?text=Pelota', shippingFree:true, eligible3:true, eligible6:false, category:'Deportes' },
    { id:8, title:'Cafetera Espresso Automática', price:24499, image:'https://via.placeholder.com/420x300?text=Cafetera', shippingFree:true, eligible3:true, eligible6:true, category:'Hogar' },
    { id:9, title:'Powerbank 20000mAh', price:5999, image:'https://via.placeholder.com/420x300?text=Powerbank', shippingFree:false, eligible3:true, eligible6:false, category:'Celulares' },
    { id:10, title:'Smartwatch Sport', price:17999, image:'https://via.placeholder.com/420x300?text=Smartwatch', shippingFree:false, eligible3:true, eligible6:true, category:'Deportes' }
  ];

  const nfCurrency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });

  // Estado
  let show3 = true;
  let show6 = true;
  let cartCount = 0;

  // Elementos globales
  const root = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const btnSearch = document.getElementById('btnSearch');
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsRoot = document.getElementById('settings');
  const opt3 = document.getElementById('opt3');
  const opt6 = document.getElementById('opt6');
  const btnCart = document.getElementById('btnCart');

  // Si no existe, evitar errores (las páginas tienen header copiado y puede no tener controles)
  function safe(el) { return el || { addEventListener(){}, value: '', checked:true, textContent:'' }; }

  // Leer categoría desde body
  const category = (document.body.getAttribute('data-category') || 'Todos').trim();

  // Filtrar por categoría
  function getList() {
    if (category === 'Todos' || category === '') return products;
    return products.filter(p => p.category === category);
  }

  // Render productos
  function renderProducts(list = getList()) {
    if (!root) return;
    root.innerHTML = '';
    if (!list.length) {
      root.innerHTML = `<div class="card"><div class="muted">No se encontraron productos en "${category}".</div></div>`;
      return;
    }

    list.forEach(p => {
      const price = nfCurrency.format(p.price);
      const per3 = nfCurrency.format(Math.round(p.price / 3));
      const per6 = nfCurrency.format(Math.round(p.price / 6));

      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="thumb"><img src="${p.image}" alt="${escapeHtml(p.title)}"></div>
        <div class="title">${escapeHtml(p.title)}</div>
        <div class="meta">
          <div>
            <div class="price">${price}</div>
            <div class="muted">Precio final · stock limitado</div>
          </div>
          <div class="badges">
            ${p.shippingFree ? `<span class="badge-ship">Envío gratis</span>` : ''}
            ${p.shippingFree ? `<span class="badge-free">GRATIS</span>` : ''}
          </div>
        </div>
        <div class="installments" id="inst-${p.id}"></div>
        <div class="row" style="margin-top:auto">
          <div class="muted">Pago seguro · 3/6 cuotas</div>
          <button class="buy btn small" data-id="${p.id}">Comprar</button>
        </div>
      `;
      root.appendChild(card);

      const instEl = document.getElementById(`inst-${p.id}`);
      const parts = [];
      if (show3 && p.eligible3) parts.push(`<div>3 cuotas sin interés de <strong style="color:var(--primary)">${per3}</strong></div>`);
      if (show6 && p.eligible6) parts.push(`<div>6 cuotas sin interés de <strong style="color:var(--primary)">${per6}</strong></div>`);
      instEl.innerHTML = parts.length ? parts.join('') : `<div class="muted">No disponible en cuotas sin interés</div>`;

      // evento comprar
      const buyBtn = card.querySelector('.buy');
      buyBtn.addEventListener('click', () => addToCart(p));
    });
  }

  // Añadir al carrito (demo)
  function addToCart(product) {
    cartCount += 1;
    if (btnCart) btnCart.textContent = `Carrito (${cartCount})`;
    alert(`Añadido al carrito:\n${product.title}\n${nfCurrency.format(product.price)}`);
  }

  // Búsqueda
  function doSearch() {
    const q = (searchInput && searchInput.value || '').trim().toLowerCase();
    if (!q) { renderProducts(); return; }
    const filtered = getList().filter(p => p.title.toLowerCase().includes(q));
    renderProducts(filtered);
  }

  // pequeños helpers
  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

  // Asignar eventos (si existen los controles)
  safe(btnSearch).addEventListener('click', doSearch);
  if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });

  // settings panel toggle (si existe)
  if (settingsToggle && settingsRoot) {
    settingsToggle.addEventListener('click', () => {
      const open = settingsRoot.classList.toggle('open');
      settingsToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => { if (!settingsRoot.contains(e.target)) { settingsRoot.classList.remove('open'); if (settingsToggle) settingsToggle.setAttribute('aria-expanded','false'); } });
  }

  if (opt3) opt3.addEventListener('change', (e) => { show3 = e.target.checked; renderProducts(); });
  if (opt6) opt6.addEventListener('change', (e) => { show6 = e.target.checked; renderProducts(); });

  // shortcut "/" focus search
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  // init
  renderProducts();

  // export para debugging
  window.TiendaDemo = { renderProducts, products, addToCart };
})();