(() => {
  const S = window.STORE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const byId = (id) => S.products.find((p) => p.id === id);
  const MAX_QTY = 10;
  const maxQty = (p) => (p.stock == null ? MAX_QTY : p.stock);

  const nb = (t) => t.replace(/-/g, '‑'); // no partir "T-shirt"
  const usd = (n) => '$' + n.toFixed(2);
  const bs = (n) => (n * S.tasaBs).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Bs';
  const color = (p) => (p.model.split('·')[1] || p.model).trim();
  const sizeRange = (p) => (p.sizes.length > 1 ? `${p.sizes[0]}–${p.sizes[p.sizes.length - 1]}` : p.sizes[0]);

  /* ---------- Persistencia (opcional: la página funciona sin ella) ---------- */
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } }
  };
  let cart = store.get('bw-cart', []).filter((l) => byId(l.id));
  let favs = store.get('bw-favs', []);
  const saveCart = () => { store.set('bw-cart', cart); renderBag(); };

  const totals = () => {
    const sub = cart.reduce((sum, l) => sum + byId(l.id).price * l.qty, 0);
    return { sub, del: S.delivery, total: sub + (S.delivery || 0) };
  };
  const count = () => cart.reduce((s, l) => s + l.qty, 0);

  /* ---------- Toast ---------- */
  const toast = $('[data-toast]');
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
  };
  const copy = async (text) => { try { await navigator.clipboard.writeText(text); return true; } catch { return false; } };

  /* ---------- Bolsa del header ---------- */
  const renderBag = () => {
    const n = count();
    $('[data-bag-count]').textContent = n;
    $('[data-bag]').setAttribute('aria-label', `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
    $('[data-bag]').classList.toggle('has-items', n > 0);
  };

  /* ---------- Home: chips, fila, destacado y catálogo ---------- */
  const card = (p, cls = 'card') => `
    <a class="${cls}" href="#producto-${p.id}">
      <span class="${cls}__img">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy">
        ${p.images[1] ? `<img class="${cls}__alt" src="${p.images[1]}" alt="" loading="lazy">` : ''}
      </span>
      <span class="${cls}__meta">
        <span class="${cls}__name">${nb(p.name)}</span>
        <span class="${cls}__sizes">${sizeRange(p)}</span>
        <span class="${cls}__price">${usd(p.price)}</span>
      </span>
    </a>`;

  let filter = { color: null, q: '' };
  const renderChips = () => {
    $('[data-chips]').innerHTML = [
      `<li><button type="button" class="chip" data-chip="" aria-pressed="${!filter.color}"><span class="chip__all">B</span>Todo</button></li>`,
      ...S.products.map((p) => `<li><button type="button" class="chip" data-chip="${p.id}" aria-pressed="${filter.color === p.id}"><img src="${p.images[0]}" alt="">${color(p)}</button></li>`)
    ].join('');
  };
  $('[data-chips]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-chip]'); if (!b) return;
    filter.color = b.dataset.chip || null;
    renderChips(); renderGrid();
    if (filter.color) $('#catalogo').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });

  $('[data-rail]').innerHTML = S.products.map((p) => `<li>${card(p, 'tile')}</li>`).join('');
  const featured = S.products.find((p) => p.id === 'forest-green-boxy') || S.products[0];
  const f = $('[data-feature]');
  f.href = `#producto-${featured.id}`;
  f.innerHTML = `
    <span class="feature__top">
      <span><small>Destacado</small><strong>${nb(featured.name)}</strong><em>${usd(featured.price)}</em></span>
      <span class="feature__sizes">${sizeRange(featured)}</span>
    </span>
    <span class="feature__img"><img src="${featured.images[0]}" alt="${featured.name}" loading="lazy"></span>`;

  const grid = $('[data-grid]');
  const renderGrid = () => {
    const term = filter.q.trim().toLowerCase();
    const list = S.products.filter((p) =>
      (!filter.color || p.id === filter.color) &&
      (!term || `${p.name} ${p.model} ${p.desc}`.toLowerCase().includes(term)));
    grid.innerHTML = list.map((p) => `<li>${card(p)}</li>`).join('');
    $('[data-empty]').hidden = list.length > 0;
  };
  $('#search').addEventListener('input', (e) => { filter.q = e.target.value; filter.color = null; renderChips(); renderGrid(); });
  $('[data-search-jump]').addEventListener('click', () => { setTimeout(() => $('#search').focus({ preventScroll: true }), 450); });

  /* ---------- Producto ---------- */
  const pv = $('[data-view="producto"]');
  let sel = { id: null, size: '', view: 0 };

  const renderProduct = (p) => {
    if (sel.id !== p.id) sel = { id: p.id, size: p.sizes.length === 1 ? p.sizes[0] : '', view: 0 };
    const n = p.images.length;
    $('[data-p-img]', pv).src = p.images[sel.view];
    $('[data-p-img]', pv).alt = `${p.name}, foto ${sel.view + 1} de ${n}`;
    const other = p.images[(sel.view + 1) % n];
    $('[data-ghost-l]', pv).src = other; $('[data-ghost-r]', pv).src = other;
    $$('.stage__ghost, .stage__nav', pv).forEach((el) => { el.hidden = n < 2; });
    $('[data-dots]', pv).innerHTML = n > 1 ? p.images.map((_, i) => `<button type="button" class="dot" aria-pressed="${i === sel.view}" data-dot="${i}" aria-label="Foto ${i + 1}"></button>`).join('') : '';
    $('[data-p-tag]', pv).textContent = p.model.split('·')[0].trim();
    $('[data-p-name]', pv).textContent = nb(p.name);
    $('[data-p-price]', pv).textContent = usd(p.price);
    $('[data-p-desc]', pv).textContent = p.desc;
    $('[data-p-error]', pv).hidden = true;
    $('[data-p-size]', pv).innerHTML = `<option value="">Elegir talla</option>` + p.sizes.map((s) => `<option value="${s}"${s === sel.size ? ' selected' : ''}>Talla ${s}</option>`).join('');
    const fav = favs.includes(p.id);
    $('[data-fav]', pv).setAttribute('aria-pressed', fav);
    const soldOut = p.stock != null && p.stock < 1;
    const add = $('[data-add]', pv);
    add.disabled = soldOut; add.textContent = soldOut ? 'Agotado' : 'Agregar al carrito';
  };

  const go = (p, d) => { sel.view = (sel.view + d + p.images.length) % p.images.length; renderProduct(p); };
  pv.addEventListener('click', async (e) => {
    const p = byId(sel.id); if (!p) return;
    const nav = e.target.closest('[data-nav]'); if (nav) { go(p, Number(nav.dataset.nav)); return; }
    const dot = e.target.closest('[data-dot]'); if (dot) { sel.view = Number(dot.dataset.dot); renderProduct(p); return; }
    if (e.target.closest('[data-share]')) {
      const url = location.href.split('#')[0] + '#producto-' + p.id;
      say((await copy(url)) ? 'Enlace copiado' : url); return;
    }
    if (e.target.closest('[data-fav]')) {
      favs = favs.includes(p.id) ? favs.filter((x) => x !== p.id) : [...favs, p.id];
      store.set('bw-favs', favs); renderProduct(p);
      say(favs.includes(p.id) ? 'Guardado en favoritos' : 'Quitado de favoritos'); return;
    }
    if (e.target.closest('[data-add]')) {
      if (!sel.size) { $('[data-p-error]', pv).hidden = false; $('[data-p-size]', pv).focus(); return; }
      const line = cart.find((l) => l.id === p.id && l.size === sel.size);
      if (line) line.qty = Math.min(maxQty(p), line.qty + 1); else cart.push({ id: p.id, size: sel.size, qty: 1 });
      saveCart();
      say(`${p.name} talla ${sel.size} agregado al carrito`);
      location.hash = 'carrito';
    }
  });
  $('[data-p-size]', pv).addEventListener('change', (e) => { sel.size = e.target.value; $('[data-p-error]', pv).hidden = true; });

  // Deslizar la foto en el móvil
  let touchX = null;
  const stage = $('[data-stage]', pv);
  stage.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (touchX == null) return;
    const dx = e.changedTouches[0].clientX - touchX; touchX = null;
    const p = byId(sel.id); if (p && Math.abs(dx) > 40 && p.images.length > 1) go(p, dx < 0 ? 1 : -1);
  });

  /* ---------- Carrito ---------- */
  const cv = $('[data-view="carrito"]');
  const address = $('#ubicacion');
  address.value = store.get('bw-address', '');
  address.addEventListener('input', () => { store.set('bw-address', address.value); $('[data-cart-error]', cv).hidden = true; });

  const renderTotals = () => {
    const t = totals();
    $$('[data-t-total]').forEach((el) => { el.textContent = usd(t.total); });
    $('[data-amt-bs]').textContent = bs(t.total);
    $('[data-amt-usdt]').textContent = `${t.total.toFixed(2)} USDT`;
    $('[data-amt-usd]').textContent = usd(t.total);
    $$('[data-mini]').forEach((el) => {
      el.innerHTML = cart.map((l) => { const p = byId(l.id); return `<li><span>${l.qty} × ${nb(p.name)} · ${l.size}</span><span>${usd(p.price * l.qty)}</span></li>`; }).join('');
    });
  };

  const renderCart = () => {
    $('[data-lines]', cv).innerHTML = cart.map((l, i) => {
      const p = byId(l.id);
      return `
        <li class="row">
          <a class="row__thumb" href="#producto-${p.id}"><img src="${p.images[0]}" alt=""></a>
          <div class="row__main">
            <small>Boxy T&#8209;shirt</small>
            <strong>${color(p)}</strong>
            <span class="row__price">${usd(p.price * l.qty)}</span>
          </div>
          <div class="row__side">
            <label class="mini-select">
              <span class="sr-only">Talla de ${p.name}</span>
              <select data-line="${i}" data-line-size>${p.sizes.map((s) => `<option${s === l.size ? ' selected' : ''}>${s}</option>`).join('')}</select>
            </label>
            <div class="stepper">
              <button type="button" data-line="${i}" data-line-step="-1" aria-label="${l.qty === 1 ? 'Quitar del carrito' : 'Quitar uno'}">−</button>
              <output>${l.qty}</output>
              <button type="button" data-line="${i}" data-line-step="1" aria-label="Agregar uno">+</button>
            </div>
          </div>
        </li>`;
    }).join('');
    const n = count();
    $('[data-cart-count]', cv).textContent = n ? `${n} ${n === 1 ? 'artículo' : 'artículos'}` : '';
    $('[data-cart-empty]', cv).hidden = cart.length > 0;
    $('[data-checkout]').disabled = cart.length === 0;
    $('[data-checkout]').textContent = 'Pagar';
    renderTotals();
  };

  const mergeLines = () => {
    cart = cart.reduce((acc, x) => {
      const same = acc.find((y) => y.id === x.id && y.size === x.size);
      if (same) same.qty = Math.min(maxQty(byId(x.id)), same.qty + x.qty); else acc.push(x);
      return acc;
    }, []);
  };
  cv.addEventListener('change', (e) => {
    const s = e.target.closest('[data-line-size]'); if (!s) return;
    cart[Number(s.dataset.line)].size = s.value; mergeLines(); saveCart(); renderCart();
  });
  cv.addEventListener('click', (e) => {
    const b = e.target.closest('[data-line-step]');
    if (b) {
      const i = Number(b.dataset.line); const l = cart[i];
      l.qty += Number(b.dataset.lineStep);
      if (l.qty < 1) cart.splice(i, 1); else l.qty = Math.min(maxQty(byId(l.id)), l.qty);
      saveCart(); renderCart(); return;
    }
    if (e.target.closest('[data-checkout]')) {
      const err = $('[data-cart-error]', cv);
      if (address.value.trim().length < 6) { err.textContent = 'Escribe tu ubicación para el delivery.'; err.hidden = false; address.focus(); return; }
      location.hash = 'pago';
    }
  });

  /* ---------- Datos del método ---------- */
  const mv = $('[data-view="metodo"]');
  let orderId = null;
  const METHODS = {
    'pago-movil': {
      label: 'Pago Móvil', chip: 'pay--movil',
      rows: () => [['Cédula', S.pagoMovil.cedula], ['Teléfono', S.pagoMovil.telefono], ['Banco', S.pagoMovil.banco], ['Monto', bs(totals().total)]],
      note: () => `Monto calculado a ${S.tasaBs.toLocaleString('es-VE')} Bs por dólar. Haz el pago y envíanos la captura.`
    },
    binance: {
      label: 'Binance', chip: 'pay--binance',
      rows: () => [['Pay ID', S.binance.payId], ['Monto', `${totals().total.toFixed(2)} USDT`]],
      note: () => 'Envía el monto exacto en USDT por Binance Pay y mándanos la captura.'
    },
    efectivo: {
      label: 'Efectivo', chip: 'pay--cash',
      rows: () => [['Monto', usd(totals().total)]],
      note: () => 'Envía la foto del billete (o billetes) con el que vas a pagar. Pagas al recibir.'
    }
  };

  const orderText = (m) => {
    const t = totals();
    const lines = cart.map((l) => { const p = byId(l.id); return `• ${l.qty} × ${p.name} (talla ${l.size}): ${usd(p.price * l.qty)}`; });
    return [
      `Hola BACKWARD, quiero hacer un pedido. Pedido ${orderId}`,
      ...lines,
      `Delivery: ${t.del == null ? 'por acordar' : t.del ? usd(t.del) : 'gratis'}`,
      `Total: ${usd(t.total)}${m === 'pago-movil' ? ` (${bs(t.total)})` : ''}`,
      `Pago: ${METHODS[m].label}`,
      `Ubicación: ${address.value.trim()}`,
      m === 'efectivo' ? 'Te envío la foto del billete.' : 'Te envío el comprobante.'
    ].join('\n');
  };
  const sendHref = (text) => (S.whatsapp ? `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}` : `https://ig.me/m/${S.instagram}`);

  const renderMethod = (m) => {
    const cfg = METHODS[m];
    if (!orderId) orderId = 'BW-' + Date.now().toString(36).slice(-5).toUpperCase();
    $('[data-m-title]', mv).textContent = cfg.label;
    $('[data-m-id]', mv).textContent = orderId;
    $('[data-m-head]', mv).innerHTML = `<span class="pay pay--lg ${cfg.chip}">${cfg.label}</span><span>Datos para pagar</span>`;
    $('[data-m-data]', mv).innerHTML = cfg.rows().map(([k, v]) => `
      <div><dt>${k}</dt><dd><span>${v}</span>${m === 'efectivo' ? '' : `<button type="button" class="copy" data-copy="${String(v).replace(/"/g, '&quot;')}" aria-label="Copiar ${k}">Copiar</button>`}</dd></div>`).join('');
    $('[data-m-note]', mv).textContent = cfg.note();
    $('[data-send]', mv).dataset.method = m;
    $('[data-send-hint]', mv).textContent = S.whatsapp
      ? 'Al tocar "Enviar comprobante" se abre WhatsApp con tu pedido escrito. Adjunta la captura y envíalo.'
      : 'Al tocar "Enviar comprobante" copiamos tu pedido y abrimos el chat de Instagram: pégalo, adjunta la captura y envíalo.';
  };

  mv.addEventListener('click', async (e) => {
    const c = e.target.closest('[data-copy]');
    if (c) { say((await copy(c.dataset.copy)) ? 'Copiado' : `Cópialo a mano: ${c.dataset.copy}`); return; }
    const send = e.target.closest('[data-send]');
    if (send) {
      const text = orderText(send.dataset.method);
      const link = document.createElement('a');
      link.href = sendHref(text); link.target = '_blank'; link.rel = 'noopener';
      const copied = await copy(text);
      link.click();
      if (!S.whatsapp) say(copied ? 'Pedido copiado. Pégalo en el chat y adjunta la captura.' : 'Abrimos el chat. Escríbenos tu pedido y adjunta la captura.');
      location.hash = 'pedido';
    }
  });

  /* ---------- Pedido ---------- */
  const ov = $('[data-view="pedido"]');
  $('[data-done]', ov).addEventListener('click', () => { cart = []; orderId = null; saveCart(); renderCart(); });

  /* ---------- Router por #hash ---------- */
  const views = $$('[data-view]');
  let lastFocus = null;
  const route = () => {
    const h = location.hash.slice(1);
    let view = null;
    if (h.startsWith('producto-') && byId(h.slice(9))) { view = 'producto'; renderProduct(byId(h.slice(9))); }
    else if (h === 'carrito') { view = 'carrito'; renderCart(); }
    else if (h === 'pago') { view = cart.length ? 'pago' : 'carrito'; renderCart(); }
    else if (METHODS[h]) { view = cart.length ? 'metodo' : 'carrito'; renderCart(); if (cart.length) renderMethod(h); }
    else if (h === 'pedido') { view = orderId ? 'pedido' : null; if (orderId) $('[data-o-id]', ov).textContent = orderId; }

    views.forEach((v) => { v.hidden = v.dataset.view !== view; });
    document.body.classList.toggle('is-locked', Boolean(view));
    if (view) {
      if (!lastFocus) lastFocus = document.activeElement;
      const open = $(`[data-view="${view}"]`);
      open.scrollTop = 0; $$('.sheet-body', open).forEach((el) => { el.scrollTop = 0; });
      (open.querySelector('.topbar a, .topbar button, h2') || open).focus?.({ preventScroll: true });
    } else if (lastFocus) { lastFocus.focus?.({ preventScroll: true }); lastFocus = null; }
  };
  addEventListener('hashchange', route);
  addEventListener('keydown', (e) => {
    if (!document.body.classList.contains('is-locked')) return;
    const h = location.hash.slice(1);
    if (e.key === 'Escape') location.hash = METHODS[h] ? 'pago' : h === 'pago' ? 'carrito' : 'tienda';
    if (h.startsWith('producto-') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.target.closest('select')) {
      const p = byId(sel.id); if (p && p.images.length > 1) go(p, e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  /* ---------- Header transparente sobre el banner ---------- */
  const bar = $('[data-bar]'), banner = $('.banner');
  const solid = () => bar.classList.toggle('is-solid', scrollY > banner.offsetHeight - bar.offsetHeight);
  addEventListener('scroll', solid, { passive: true }); addEventListener('resize', solid);

  renderChips(); renderGrid(); renderBag(); solid(); route();

  /* ---------- Cinta: avanza hacia atrás, en contra del scroll ---------- */
  const track = $('[data-backward]');
  if (track && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let drift = 0, last = performance.now();
    const frame = (now) => {
      drift += (now - last) * 0.03; last = now;
      const loop = track.scrollWidth / 3;
      track.style.transform = `translate3d(${((drift + scrollY * 0.5) % loop) - loop}px,0,0)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
})();
