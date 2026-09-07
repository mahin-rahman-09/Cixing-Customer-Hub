// ============================================================
// CUSTOM DIALOGS
// Promise-based replacements for the browser's native confirm()/alert().
// Same usage pattern (customConfirm returns true/false, customAlert just
// resolves when dismissed) but styled like the rest of the app instead
// of looking like a system popup.
// ============================================================

function getDialogRoot(){
  return document.getElementById('dialog-root') || (() => {
    const d = document.createElement('div');
    d.id = 'dialog-root';
    document.body.appendChild(d);
    return d;
  })();
}

function escapeHtml(str){
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function customConfirm(message, opts = {}){
  const title = opts.title || 'Are you sure?';
  const confirmLabel = opts.confirmLabel || 'Confirm';
  const cancelLabel = opts.cancelLabel || 'Cancel';
  const danger = opts.danger !== false; // most confirms guard a risky action, so default to the red style

  return new Promise((resolve) => {
    const root = getDialogRoot();
    root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card dialog-card">
          <h3>${escapeHtml(title)}</h3>
          <p class="modal-sub dialog-message">${escapeHtml(message)}</p>
          <div class="modal-actions">
            <button class="btn-tertiary" id="dialog-cancel-btn">${escapeHtml(cancelLabel)}</button>
            <button class="btn-primary ${danger ? 'btn-primary-danger' : ''}" id="dialog-confirm-btn" style="width:auto;padding:9px 18px;">${escapeHtml(confirmLabel)}</button>
          </div>
        </div>
      </div>
    `;
    const overlay = root.querySelector('.modal-overlay');
    const cancelBtn = document.getElementById('dialog-cancel-btn');
    const confirmBtn = document.getElementById('dialog-confirm-btn');

    function finish(result){
      document.removeEventListener('keydown', onKey);
      root.innerHTML = '';
      resolve(result);
    }
    function onKey(e){
      if(e.key === 'Escape') finish(false);
      if(e.key === 'Enter') finish(true);
    }

    cancelBtn.addEventListener('click', () => finish(false));
    confirmBtn.addEventListener('click', () => finish(true));
    overlay.addEventListener('click', (e) => { if(e.target === overlay) finish(false); });
    document.addEventListener('keydown', onKey);
    confirmBtn.focus();
  });
}

function customAlert(message, opts = {}){
  const title = opts.title || (opts.error ? 'Something went wrong' : 'Notice');

  return new Promise((resolve) => {
    const root = getDialogRoot();
    root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card dialog-card">
          <h3 ${opts.error ? 'style="color:var(--danger);"' : ''}>${escapeHtml(title)}</h3>
          <p class="modal-sub dialog-message">${escapeHtml(message)}</p>
          <div class="modal-actions" style="justify-content:flex-end;">
            <button class="btn-primary" id="dialog-ok-btn" style="width:auto;padding:9px 18px;">OK</button>
          </div>
        </div>
      </div>
    `;
    const overlay = root.querySelector('.modal-overlay');
    const okBtn = document.getElementById('dialog-ok-btn');

    function finish(){
      document.removeEventListener('keydown', onKey);
      root.innerHTML = '';
      resolve();
    }
    function onKey(e){
      if(e.key === 'Escape' || e.key === 'Enter') finish();
    }

    okBtn.addEventListener('click', finish);
    overlay.addEventListener('click', (e) => { if(e.target === overlay) finish(); });
    document.addEventListener('keydown', onKey);
    okBtn.focus();
  });
}
