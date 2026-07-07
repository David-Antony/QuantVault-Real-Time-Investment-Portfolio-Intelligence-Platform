/**
 * QuantVault — Global Keyboard Shortcuts
 *
 * Shortcuts:
 *   G + P → Portfolio
 *   G + R → Reports
 *   G + T → Transactions
 *   G + A → Alerts
 *   G + W → Watchlist
 *   G + I → Profile (Identity)
 *   ? or Shift+/ → Show shortcuts modal
 *   Escape → Close modal / clear pending key
 */

(function () {
  let pendingKey = null;
  let pendingTimer = null;

  const GOTO_MAP = {
    p: '/portfolio.html',
    r: '/reports.html',
    t: '/transactions.html',
    a: '/alerts.html',
    w: '/watchlist.html',
    i: '/profile.html'
  };

  function clearPending() {
    pendingKey = null;
    if (pendingTimer) { clearTimeout(pendingTimer); pendingTimer = null; }
  }

  function navigate(path) {
    window.location.href = path;
  }

  function isInputFocused() {
    const tag = document.activeElement?.tagName?.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable;
  }

  document.addEventListener('keydown', (e) => {
    if (isInputFocused()) return;

    const key = e.key.toLowerCase();

    // ? → open shortcuts modal
    if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      openModal();
      clearPending();
      return;
    }

    // Escape → close modal / cancel pending
    if (e.key === 'Escape') {
      closeModal();
      clearPending();
      return;
    }

    // G sequence
    if (pendingKey === 'g') {
      const target = GOTO_MAP[key];
      if (target) {
        e.preventDefault();
        navigate(target);
      }
      clearPending();
      return;
    }

    if (key === 'g') {
      pendingKey = 'g';
      // Auto-clear if second key not pressed within 1.5s
      pendingTimer = setTimeout(clearPending, 1500);
    }
  });

  // ── Modal ──────────────────────────────────────────────────────────────────
  function openModal() {
    let modal = document.getElementById('qv-kb-modal');
    if (!modal) modal = createModal();
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('visible'), 10);
  }

  function closeModal() {
    const modal = document.getElementById('qv-kb-modal');
    if (!modal) return;
    modal.classList.remove('visible');
    setTimeout(() => { modal.style.display = 'none'; }, 250);
  }

  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'qv-kb-modal';
    overlay.style.cssText = `
      display: none; position: fixed; inset: 0; z-index: 9999;
      align-items: center; justify-content: center;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
      opacity: 0; transition: opacity 250ms ease;
    `;
    overlay.innerHTML = `
      <div style="
        background: hsl(222,42%,9%); border: 1px solid rgba(56,189,248,0.2);
        border-radius: 16px; padding: 32px 40px; max-width: 420px; width: 90%;
        box-shadow: 0 24px 64px rgba(0,0,0,0.7);
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px">
          <h2 style="font-family:'Space Grotesk',sans-serif;font-size:1.25rem;color:#F1F5F9;margin:0">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button id="qv-kb-close" style="
            background:none;border:none;color:#94A3B8;cursor:pointer;
            font-size:1.25rem;padding:4px;
          ">✕</button>
        </div>
        <div style="display:grid;gap:8px">
          ${[
            ['G then P', 'Go to Portfolio'],
            ['G then R', 'Go to Reports'],
            ['G then T', 'Go to Transactions'],
            ['G then A', 'Go to Alerts'],
            ['G then W', 'Go to Watchlist'],
            ['G then I', 'Go to Profile'],
            ['?', 'Show this shortcuts panel'],
            ['Esc', 'Close this panel']
          ].map(([kb, desc]) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
              <span style="color:#94A3B8;font-size:0.875rem;font-family:'Inter',sans-serif">${desc}</span>
              <span style="
                font-family:'JetBrains Mono',monospace;font-size:0.75rem;color:#38BDF8;
                background:rgba(56,189,248,0.1);border:1px solid rgba(56,189,248,0.2);
                padding:3px 8px;border-radius:6px;white-space:nowrap
              ">${kb}</span>
            </div>
          `).join('')}
        </div>
        <p style="margin-top:16px;color:#64748B;font-size:0.75rem;text-align:center">
          Press <strong style="color:#38BDF8">G</strong> then the letter to navigate instantly
        </p>
      </div>
    `;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    overlay.querySelector('#qv-kb-close').addEventListener('click', closeModal);
    document.body.appendChild(overlay);

    // Make visible class work
    const style = document.createElement('style');
    style.textContent = '#qv-kb-modal.visible { opacity: 1 !important; }';
    document.head.appendChild(style);

    return overlay;
  }

  window.KeyboardShortcuts = { open: openModal, close: closeModal };
})();
