const products = [
      { id: 'electrical-01', name: 'Air Circuit Breakers', category: 'Electrical Products', description: 'High-performance air circuit breakers for industrial and commercial power systems.' },
      { id: 'electrical-02', name: 'Molded Case Circuit Breakers', category: 'Electrical Products', description: 'Reliable molded case breakers for equipment protection.' },
      { id: 'electrical-03', name: 'Miniature Circuit Breakers', category: 'Electrical Products', description: 'Compact miniature breakers for residential and light-commercial panels.' },
      { id: 'electrical-04', name: 'Vacuum Circuit Breakers', category: 'Electrical Products', description: 'Durable vacuum breakers for medium-voltage switching.' },
      { id: 'electrical-05', name: 'Dry Type Transformers', category: 'Electrical Products', description: 'Safe dry-type transformers for indoor distribution applications.' },
      { id: 'electrical-06', name: 'Busduct / Components', category: 'Electrical Products', description: 'Busduct systems and components for efficient power distribution.' },
      { id: 'electrical-07', name: 'Generator Sets', category: 'Electrical Products', description: 'Reliable generator sets for backup power and remote installations.' },
      { id: 'electrical-08', name: 'Variable Frequency Drive (VFD)', category: 'Electrical Products', description: 'VFD solutions for motor control and energy savings.' },
      { id: 'electrical-09', name: 'Battery / UPS', category: 'Electrical Products', description: 'Battery and UPS systems for power continuity and protection.' },
      { id: 'electrical-10', name: 'Contactors, Timers and Relays', category: 'Electrical Products', description: 'Control devices for automation and safety circuits.' },
      { id: 'assemble-01', name: 'Capacitor Bank', category: 'Assemble Products', description: 'Capacitor bank systems for power factor correction.' },
      { id: 'assemble-02', name: 'High / Medium Voltage Switchgears', category: 'Assemble Products', description: 'High/medium voltage switchgear assemblies for distribution networks.' },
      { id: 'assemble-03', name: 'Low Voltage Switchgears', category: 'Assemble Products', description: 'Low voltage switchgear for building and industrial systems.' },
      { id: 'assemble-04', name: 'Meter Center', category: 'Assemble Products', description: 'Meter centers for residential and commercial metering solutions.' },
      { id: 'assemble-05', name: 'Motor Control Center', category: 'Assemble Products', description: 'Motor control centers for factory and plant automation.' },
      { id: 'assemble-06', name: 'Loose Controllers', category: 'Assemble Products', description: 'Loose controllers and modular control devices.' },
      { id: 'assemble-07', name: 'Panel Boards', category: 'Assemble Products', description: 'Panel boards for distribution and branch circuit protection.' },
      { id: 'assemble-08', name: 'Solar Energy System', category: 'Assemble Products', description: 'Solar energy systems for sustainable power generation.' },
      { id: 'assemble-09', name: 'Synchronizing Panel', category: 'Assemble Products', description: 'Panels to synchronize multiple generators and power sources.' }
    ];

    const selected = new Map();
    const productGrid = document.getElementById('productGrid');
    const selectedProductsEl = document.getElementById('selectedProducts');
    const selectedCountEl = document.getElementById('selectedCount');
    const viewAllButton = document.getElementById('viewAllButton');
    const popup = document.getElementById('selectedPopup');
    const popupSelectedCount = document.getElementById('popupSelectedCount');
    const popupSelectedList = document.getElementById('popupSelectedList');
    const closePopup = document.getElementById('closePopup');
    const searchInput = document.getElementById('productSearch');
    const filterSelect = document.getElementById('categoryFilter');
    const orderForm = document.getElementById('orderForm');

    function renderProducts() {
      const query = searchInput.value.trim().toLowerCase();
      const category = filterSelect.value;
      productGrid.innerHTML = '';

      const filtered = products.filter(product => {
        const matchesSearch = [product.name, product.description, product.category]
          .some(text => text.toLowerCase().includes(query));
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
      });

      if (filtered.length === 0) {
        productGrid.innerHTML = '<div class="empty-state">No products match your search or filter.</div>';
        return;
      }

      filtered.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card panel';

        const isChecked = selected.has(product.id);
        const currentQty = selected.get(product.id) || 1;

        card.innerHTML = `
          <div class="product-card-head">
            <label class="checkbox-label">
              <input type="checkbox" data-id="${product.id}" ${isChecked ? 'checked' : ''}>
              <span>${product.name}</span>
            </label>
            <label class="qty-label">
              <span>Qty</span>
              <input
                type="number"
                class="qty-input"
                data-id="${product.id}"
                min="1"
                step="1"
                value="${currentQty}"
                ${isChecked ? '' : 'disabled'}
                aria-label="Quantity for ${product.name}"
              >
            </label>
          </div>
          <p>${product.description}</p>
        `;

        const checkbox = card.querySelector('input[type="checkbox"]');
        const qtyInput = card.querySelector('.qty-input');

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
            qtyInput.value = qty;
            qtyInput.disabled = false;
            selected.set(product.id, qty);
          } else {
            selected.delete(product.id);
            qtyInput.disabled = true;
          }
          updateSelection();
        });

        qtyInput.addEventListener('input', () => {

  const raw = qtyInput.value;
  if (raw === '') return;
  let qty = parseInt(raw, 10);
  if (isNaN(qty) || qty < 1) return;
  if (selected.has(product.id)) {
    selected.set(product.id, qty);
    updateSelection();
  }
});

qtyInput.addEventListener('blur', () => {
  let qty = parseInt(qtyInput.value, 10);
  if (!qty || qty < 1) qty = 1;
  qtyInput.value = qty;
  if (selected.has(product.id)) {
    selected.set(product.id, qty);
    updateSelection();
  }
});

        productGrid.appendChild(card);
      });
    }

    function updateSelection() {
      selectedProductsEl.innerHTML = '';
      if (selected.size === 0) {
        selectedCountEl.textContent = 'No products selected yet.';
        viewAllButton.classList.add('hidden');
        return;
      }

      const selectedItems = products.filter(product => selected.has(product.id));
      const totalQty = selectedItems.reduce((sum, p) => sum + selected.get(p.id), 0);
      selectedCountEl.textContent = `${selectedItems.length} product${selectedItems.length === 1 ? '' : 's'} selected (${totalQty} total unit${totalQty === 1 ? '' : 's'}).`;

      selectedItems.slice(0, 4).forEach(product => {
        const item = document.createElement('li');
        item.textContent = `${product.name} — Qty: ${selected.get(product.id)}`;
        selectedProductsEl.appendChild(item);
      });

      if (selectedItems.length > 4) {
        const overflowNotice = document.createElement('li');
        overflowNotice.textContent = `And ${selectedItems.length - 4} more selected items.`;
        overflowNotice.style.fontStyle = 'italic';
        overflowNotice.style.color = '#dbffde';
        selectedProductsEl.appendChild(overflowNotice);
        viewAllButton.classList.remove('hidden');
      } else {
        viewAllButton.classList.add('hidden');
      }
    }

    viewAllButton.addEventListener('click', () => {
      const selectedItems = products.filter(product => selected.has(product.id));
      const totalQty = selectedItems.reduce((sum, p) => sum + selected.get(p.id), 0);
      popupSelectedCount.textContent = `${selectedItems.length} selected product${selectedItems.length === 1 ? '' : 's'} (${totalQty} total unit${totalQty === 1 ? '' : 's'})`;
      popupSelectedList.innerHTML = '';
      selectedItems.forEach(product => {
        const item = document.createElement('li');
        item.textContent = `${product.name} — Qty: ${selected.get(product.id)}`;
        popupSelectedList.appendChild(item);
      });
      popup.classList.remove('hidden');
      popup.setAttribute('aria-hidden', 'false');
    });

    closePopup.addEventListener('click', () => {
      popup.classList.add('hidden');
      popup.setAttribute('aria-hidden', 'true');
    });

    popup.addEventListener('click', event => {
      if (event.target === popup) {
        popup.classList.add('hidden');
        popup.setAttribute('aria-hidden', 'true');
      }
    });

    orderForm.addEventListener('submit', event => {
      event.preventDefault();
      if (selected.size === 0) {
        alert('Please select at least one product before sending your order.');
        return;
      }

      const formData = new FormData(orderForm);
      const name = formData.get('name').trim();
      const email = formData.get('email').trim();
      const subject = formData.get('subject').trim();
      const message = formData.get('message').trim();
      const selectedItems = products.filter(product => selected.has(product.id));
      const productsList = selectedItems
        .map(product => `- ${product.name} (Qty: ${selected.get(product.id)})`)
        .join('\r\n');

      const body = `Dear Kema Energy Solutions team,\r\n\r\nI would like to order the following products:\r\n${productsList}\r\n\r\nContact details:\r\nName: ${name}\r\nEmail: ${email}\r\n\r\nAdditional notes:\r\n${message}`;
      window.location.href = `mailto:info@kemaenergy.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    searchInput.addEventListener('input', renderProducts);
    filterSelect.addEventListener('change', renderProducts);

    renderProducts();
    updateSelection();