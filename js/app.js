document.addEventListener('DOMContentLoaded', function () {
  // Evitar cualquier preventDefault global: no añadimos listeners que bloqueen <a> por defecto.

  // Toggle panel de settings (accesible)
  const settingsToggle = document.getElementById('settingsToggle');
  const settingsPanel = document.getElementById('settingsPanel');

  if (settingsToggle && settingsPanel) {
    settingsToggle.addEventListener('click', () => {
      const isOpen = settingsPanel.hasAttribute('hidden') === false;
      if (isOpen) {
        settingsPanel.setAttribute('hidden', '');
        settingsToggle.setAttribute('aria-expanded', 'false');
      } else {
        settingsPanel.removeAttribute('hidden');
        settingsToggle.setAttribute('aria-expanded', 'true');
      }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!settingsPanel.contains(e.target) && e.target !== settingsToggle) {
        settingsPanel.setAttribute('hidden', '');
        settingsToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Botón de búsqueda: si se quiere, navega a una página de búsqueda o filtra productos
  const btnSearch = document.getElementById('btnSearch');
  const searchInput = document.getElementById('searchInput');
  if (btnSearch && searchInput) {
    btnSearch.addEventListener('click', () => {
      const q = searchInput.value && searchInput.value.trim();
      if (!q) {
        // Si no hay query, puedes mostrar un mensaje o simplemente retornar
        searchInput.focus();
        return;
      }
      // Ejemplo: navegar a una página de búsqueda (asegúrate de que exista search.html)
      // Si prefieres que sea una SPA, reemplaza por la lógica de filtrado.
      const url = `search.html?q=${encodeURIComponent(q)}`;
      window.location.href = url;
    });
    // permitir Enter en el input
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btnSearch.click();
    });
  }

  // Ejemplo seguro para el carrito (actualiza contador)
  const btnCart = document.getElementById('btnCart');
  if (btnCart) {
    // si guardas el carrito en localStorage, mostrar cantidad
    const cart = JSON.parse(localStorage.getItem('tp_cart') || '[]');
    btnCart.textContent = `Carrito (${cart.length})`;
    btnCart.addEventListener('click', () => {
      // ir a carrito si existe carrito.html
      window.location.href = 'cart.html';
    });
  }

  // Ejemplo: cargar productos de ejemplo en el grid si está vacío
  const productsGrid = document.getElementById('productsGrid');
  if (productsGrid && productsGrid.children.length === 0) {
    // muestra placeholders para comprobar el diseño y colores
    const sample = Array.from({length:6}).map((_,i) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <div style="background:#fff;padding:1rem;border-radius:8px;box-shadow:0 6px 18px rgba(15,23,42,0.06);">
          <img src="https://via.placeholder.com/300x180?text=Producto+${i+1}" alt="Producto ${i+1}" style="width:100%;border-radius:6px;margin-bottom:.5rem" />
          <h3 style="margin:.25rem 0">Producto ${i+1}</h3>
          <p style="color:var(--muted);margin-bottom:.5rem">Descripción breve</p>
          <a href="producto.html?id=${i+1}" style="display:inline-block;padding:.45rem .6rem;background:var(--primary);color:#fff;border-radius:6px;text-decoration:none;">Ver</a>
        </div>
      `;
      return card;
    });
    sample.forEach(s => productsGrid.appendChild(s));
  }
});


document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("mainNav").classList.toggle("active");
});
