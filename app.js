(() => {
  const S = window.STORE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const byId = (id) => S.products.find((p) => p.id === id);

  const usd = (n) => '$' + n.toFixed(2);
  const bs = (n) => (n * S.tasaBs).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Bs';

  /* ---------- Persistencia (opcional: la página funciona sin ella) ---------- */
  const store = {
    get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } }
  };
  let cart = store.get('bw-cart', []).filter((l) => byId(l.id));
  const saveCart = () => { store.set('bw-cart', cart); renderBag(); };

  const totals = () => {
    const sub = cart.reduce((sum, l) => sum + byId(l.id).price * l.qty, 0);
    return { sub, del: S.delivery, total: sub + (S.delivery || 0) };
  };

  /* ---------- Toast ---------- */
  const toast = $('[data-toast]');
  let toastTimer;
  const say = (msg) => {
    toast.textContent = msg; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  };

  /* ---------- Bolsa del header ---------- */
  const renderBag = () => {
    const n = cart.reduce((s, l) => s + l.qty, 0);
    $('[data-bag-count]').textContent = n;
    $('[data-bag]').setAttribute('aria-label', `Carrito, ${n} ${n === 1 ? 'producto' : 'productos'}`);
    $('[data-bag]').classList.toggle('has-items', n > 0);
  };

  /* ---------- Grilla de la tienda ---------- */
  const grid = $('[data-grid]');
  const renderGrid = (q = '') => {
    const term = q.trim().toLowerCase();
    const list = S.products.filter((p) => !term || `${p.name} ${p.model}`.toLowerCase().includes(term));
    grid.innerHTML = list.map((p) => `
      <li>
        <a class="card" href="#producto-${p.id}">
          <span class="card__img"><img src="${p.img}" alt="${p.name}, ${p.model}" loading="lazy"></span>
          <span class="card__name">${p.name}</span>
          <span class="card__model">${p.model}</span>
          <span class="card__price">${usd(p.price)}${p.demo ? '<em>Ejemplo</em>' : ''}</span>
        </a>
      </li>`).join('');
    $('[data-empty]').hidden = list.length > 0;
  };
  $('#search').addEventListener('input', (e) => renderGrid(e.target.value));

  /* ---------- Vista de producto ---------- */
  const pv = $('[data-view="producto"]');
  let sel = { id: null, size: null, qty: 1 };

  const renderProduct = (p) => {
    if (sel.id !== p.id) sel = { id: p.id, size: p.sizes.length === 1 ? p.sizes[0] : null, qty: 1 };
    $('[data-p-img]', pv).src = p.img;
    $('[data-p-img]', pv).alt = `${p.name}, ${p.model}`;
    $('[data-p-name]', pv).textContent = p.name;
    $('[data-p-model]', pv).textContent = p.model;
    $('[data-p-price]', pv).textContent = usd(p.price);
    $('[data-p-demo]', pv).hidden = !p.demo;
    $('[data-p-desc]', pv).textContent = p.desc;
    $('[data-p-stock]', pv).textContent = p.stock > 0 ? `${p.stock} uds` : 'Agotado';
    $('[data-p-stockbar]', pv).style.transform = `scaleX(${Math.min(1, p.stock / p.stockMax)})`;
    $('[data-p-stockbar]', pv).classList.toggle('is-low', p.stock / p.stockMax < 0.35);
    $('[data-p-qty]', pv).textContent = sel.qty;
    $('[data-p-error]', pv).hidden = true;
    $('[data-p-sizes]', pv).innerHTML = p.sizes.map((s) =>
      `<button type="button" class="size" aria-pressed="${s === sel.size}" data-size="${s}">${s}</button>`).join('');
    const add = $('[data-add]', pv);
    add.disabled = p.stock < 1;
    add.textContent = p.stock < 1 ? 'Agotado' : 'Agregar al carrito';
  };

  pv.addEventListener('click', (e) => {
    const p = byId(sel.id); if (!p) return;
    const size = e.target.closest('[data-size]');
    if (size) { sel.size = size.dataset.size; renderProduct(p); return; }
    const step = e.target.closest('[data-step]');
    if (step) { sel.qty = Math.max(1, Math.min(p.stock, sel.qty + Number(step.dataset.step))); $('[data-p-qty]', pv).textContent = sel.qty; return; }
    if (e.target.closest('[data-add]')) {
      if (!sel.size) { $('[data-p-error]', pv).hidden = false; return; }
      const line = cart.find((l) => l.id === p.id && l.size === sel.size);
      if (line) line.qty = Math.min(p.stock, line.qty + sel.qty); else cart.push({ id: p.id, size: sel.size, qty: sel.qty });
      saveCart();
      say(`${p.name} talla ${sel.size} agregado al carrito`);
      location.hash = 'carrito';
    }
  });

  /* ---------- Carrito ---------- */
  const cv = $('[data-view="carrito"]');
  const address = $('#ubicacion');
  address.value = store.get('bw-address', '');
  address.addEventListener('input', () => { store.set('bw-address', address.value); $('[data-cart-error]', cv).hidden = true; });

  const renderMini = () => {
    const html = cart.map((l) => {
      const p = byId(l.id);
      return `<li><img src="${p.img}" alt=""><span><strong>${l.qty} ${p.name}</strong>Talla ${l.size}</span><span>${usd(p.price * l.qty)}</span></li>`;
    }).join('');
    const t = totals();
    $$('[data-mini]').forEach((el) => { el.innerHTML = html; });
    $$('[data-t-sub]').forEach((el) => { el.textContent = usd(t.sub); });
    $$('[data-t-del]').forEach((el) => { el.textContent = t.del == null ? 'Por acordar' : t.del ? usd(t.del) : 'Gratis'; });
    $$('[data-t-total]').forEach((el) => { el.textContent = usd(t.total); });
    $('[data-checkout]').textContent = cart.length ? `Pagar ${usd(t.total)}` : 'Pagar';
    $('[data-amt-bs]').textContent = bs(t.total);
    $('[data-amt-usdt]').textContent = `${t.total.toFixed(2)} USDT`;
    $('[data-amt-usd]').textContent = usd(t.total);
  };

  const renderCart = () => {
    $('[data-lines]', cv).innerHTML = cart.map((l, i) => {
      const p = byId(l.id);
      return `
        <li class="line">
          <img src="${p.img}" alt="">
          <div class="line__body">
            <p class="line__name">${p.name} <span>${p.model}</span></p>
            <div class="line__sizes" role="group" aria-label="Talla de ${p.name}">
              ${p.sizes.map((s) => `<button type="button" class="size size--sm" aria-pressed="${s === l.size}" data-line="${i}" data-line-size="${s}">${s}</button>`).join('')}
            </div>
          </div>
          <div class="line__side">
            <div class="stepper stepper--sm">
              <button type="button" data-line="${i}" data-line-step="-1" aria-label="Quitar uno">−</button>
              <output>${l.qty}</output>
              <button type="button" data-line="${i}" data-line-step="1" aria-label="Agregar uno">+</button>
            </div>
            <button type="button" class="line__remove" data-line="${i}" data-line-remove>Quitar</button>
          </div>
        </li>`;
    }).join('');
    $('[data-cart-empty]', cv).hidden = cart.length > 0;
    $('[data-checkout]').disabled = cart.length === 0;
    renderMini();
  };

  cv.addEventListener('click', (e) => {
    const b = e.target.closest('[data-line]');
    if (b) {
      const l = cart[Number(b.dataset.line)]; const p = byId(l.id);
      if (b.dataset.lineSize) l.size = b.dataset.lineSize;
      if (b.dataset.lineStep) {
        l.qty += Number(b.dataset.lineStep);
        if (l.qty < 1) cart.splice(Number(b.dataset.line), 1); else l.qty = Math.min(p.stock, l.qty);
      }
      if (b.hasAttribute('data-line-remove')) cart.splice(Number(b.dataset.line), 1);
      // Unir líneas que quedaron con el mismo producto y talla
      cart = cart.reduce((acc, x) => {
        const same = acc.find((y) => y.id === x.id && y.size === x.size);
        if (same) same.qty = Math.min(byId(x.id).stock, same.qty + x.qty); else acc.push(x);
        return acc;
      }, []);
      saveCart(); renderCart(); return;
    }
    if (e.target.closest('[data-checkout]')) {
      const err = $('[data-cart-error]', cv);
      if (address.value.trim().length < 6) {
        err.textContent = 'Escribe tu ubicación para el delivery.'; err.hidden = false; address.focus(); return;
      }
      location.hash = 'pago';
    }
  });

  /* ---------- Método de pago ---------- */
  const mv = $('[data-view="metodo"]');
  let orderId = null;
  const METHODS = {
    'pago-movil': {
      label: 'Pago Móvil', chip: 'pay--movil',
      rows: () => [['Cédula', S.pagoMovil.cedula], ['Teléfono', S.pagoMovil.telefono], ['Banco', S.pagoMovil.banco], ['Monto', bs(totals().total)]],
      note: `Monto calculado a ${S.tasaBs.toLocaleString('es-VE')} Bs por dólar. Haz el pago y envíanos la captura.`
    },
    binance: {
      label: 'Binance', chip: 'pay--binance',
      rows: () => [['Pay ID', S.binance.payId], ['Monto', `${totals().total.toFixed(2)} USDT`]],
      note: 'Envía el monto exacto en USDT por Binance Pay y mándanos la captura.'
    },
    efectivo: {
      label: 'Efectivo', chip: 'pay--cash',
      rows: () => [['Monto', usd(totals().total)]],
      note: 'Envía la foto del billete (o billetes) con el que vas a pagar. Pagas al recibir.'
    }
  };

  const orderText = (m) => {
    const t = totals();
    const lines = cart.map((l) => { const p = byId(l.id); return `• ${l.qty} × ${p.name} ${p.model} (talla ${l.size}): ${usd(p.price * l.qty)}`; });
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

  const sendHref = (text) => S.whatsapp
    ? `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`
    : `https://ig.me/m/${S.instagram}`;

  const renderMethod = (m) => {
    const cfg = METHODS[m];
    if (!orderId) orderId = 'BW-' + Date.now().toString(36).slice(-5).toUpperCase();
    $('[data-m-head]', mv).innerHTML = `<span class="pay pay--lg ${cfg.chip}">${cfg.label}</span><span>${cfg.label}</span>`;
    $('[data-m-data]', mv).innerHTML = cfg.rows().map(([k, v]) => `
      <div><dt>${k}</dt><dd><span>${v}</span>${k === 'Monto' && m === 'efectivo' ? '' : `<button type="button" class="copy" data-copy="${String(v).replace(/"/g, '&quot;')}" aria-label="Copiar ${k}">Copiar</button>`}</dd></div>`).join('');
    $('[data-m-note]', mv).textContent = cfg.note;
    const send = $('[data-send]', mv);
    send.dataset.method = m;
    $('[data-send-hint]', mv).textContent = S.whatsapp
      ? 'Se abre WhatsApp con tu pedido escrito. Adjunta la captura y envíalo.'
      : 'Copiamos tu pedido y abrimos el chat de Instagram: pégalo, adjunta la captura y envíalo.';
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
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
  $('[data-done]', ov).addEventListener('click', () => {
    cart = []; orderId = null; saveCart(); renderCart(); renderGrid();
  });

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
      open.scrollTop = 0; $$('.panel, .screen__side', open).forEach((el) => { el.scrollTop = 0; });
      (open.querySelector('h2, .back') || open).focus?.({ preventScroll: true });
    } else if (lastFocus) { lastFocus.focus?.({ preventScroll: true }); lastFocus = null; }
  };
  addEventListener('hashchange', route);
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !document.body.classList.contains('is-locked')) return;
    const h = location.hash.slice(1);
    location.hash = METHODS[h] ? 'pago' : h === 'pago' ? 'carrito' : 'tienda';
  });
  $$('[data-view] h2').forEach((h) => h.setAttribute('tabindex', '-1'));

  $('[data-search-jump]').addEventListener('click', () => { setTimeout(() => $('#search').focus({ preventScroll: true }), 400); });
  const bar = $('[data-bar]'), banner = $('.banner');
  const solid = () => bar.classList.toggle('is-solid', scrollY > banner.offsetHeight - bar.offsetHeight);
  addEventListener('scroll', solid, { passive: true }); addEventListener('resize', solid); solid();

  renderGrid(); renderBag(); route();

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
