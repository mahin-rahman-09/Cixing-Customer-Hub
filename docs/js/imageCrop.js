// ============================================================
// IMAGE CROP MODAL
// A small, dependency-free crop/zoom tool for profile photos.
// Opens with a selected file, lets the user drag to reposition
// and use a slider to zoom, then resolves a Promise with a
// cropped JPEG Blob (or null if cancelled).
//
// Why build this instead of using a library: the project
// deliberately avoids third-party dependencies where a plain
// Canvas + pointer-events implementation covers the need.
// ============================================================

const CROP_VIEWPORT_SIZE = 260; // on-screen circle size, in px
const CROP_OUTPUT_SIZE = 480;   // actual exported image size, in px (sharper than the preview)

function openImageCropModal(file){
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const root = document.getElementById('crop-modal-root') || (() => {
      const d = document.createElement('div');
      d.id = 'crop-modal-root';
      document.body.appendChild(d);
      return d;
    })();

    root.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-card crop-modal">
          <h3>Adjust your photo</h3>
          <p class="modal-sub">Drag to reposition, use the slider to zoom.</p>
          <div class="crop-viewport" id="crop-viewport">
            <img id="crop-image" src="${objectUrl}" draggable="false" alt="">
          </div>
          <input type="range" id="crop-zoom" min="1" max="3" step="0.01" value="1">
          <div class="modal-actions">
            <button class="btn-tertiary" id="crop-cancel-btn">Cancel</button>
            <button class="btn-primary" id="crop-confirm-btn" style="width:auto;padding:9px 18px;">Use this photo</button>
          </div>
        </div>
      </div>
    `;

    const img = document.getElementById('crop-image');
    const viewport = document.getElementById('crop-viewport');
    const zoomSlider = document.getElementById('crop-zoom');

    let baseScale = 1, scale = 1, offsetX = 0, offsetY = 0;
    let dragging = false, dragStartX = 0, dragStartY = 0, startOffsetX = 0, startOffsetY = 0;

    function applyTransform(){
      img.style.width = (img.naturalWidth * scale) + 'px';
      img.style.height = (img.naturalHeight * scale) + 'px';
      img.style.left = offsetX + 'px';
      img.style.top = offsetY + 'px';
    }

    img.onload = () => {
      // start "cover" (like CSS object-fit:cover) so the circle is always fully filled
      baseScale = Math.max(CROP_VIEWPORT_SIZE / img.naturalWidth, CROP_VIEWPORT_SIZE / img.naturalHeight);
      scale = baseScale;
      offsetX = (CROP_VIEWPORT_SIZE - img.naturalWidth * scale) / 2;
      offsetY = (CROP_VIEWPORT_SIZE - img.naturalHeight * scale) / 2;
      applyTransform();
    };

    function clampOffsets(){
      // never let the image be dragged so far that a gap shows inside the circle
      const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
      offsetX = Math.min(0, Math.max(offsetX, CROP_VIEWPORT_SIZE - w));
      offsetY = Math.min(0, Math.max(offsetY, CROP_VIEWPORT_SIZE - h));
    }

    function onPointerDown(e){
      dragging = true;
      dragStartX = e.clientX; dragStartY = e.clientY;
      startOffsetX = offsetX; startOffsetY = offsetY;
      viewport.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e){
      if(!dragging) return;
      offsetX = startOffsetX + (e.clientX - dragStartX);
      offsetY = startOffsetY + (e.clientY - dragStartY);
      clampOffsets();
      applyTransform();
    }
    function onPointerUp(){ dragging = false; }

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('pointerleave', onPointerUp);

    zoomSlider.addEventListener('input', () => {
      const oldScale = scale;
      scale = baseScale * Number(zoomSlider.value);
      // keep the viewport's center point fixed while zooming, rather than jumping
      const cx = CROP_VIEWPORT_SIZE / 2, cy = CROP_VIEWPORT_SIZE / 2;
      offsetX = cx - (cx - offsetX) * (scale / oldScale);
      offsetY = cy - (cy - offsetY) * (scale / oldScale);
      clampOffsets();
      applyTransform();
    });

    function cleanup(){
      document.removeEventListener('keydown', onKey);
      URL.revokeObjectURL(objectUrl);
      root.innerHTML = '';
    }
    function onKey(e){
      if(e.key === 'Escape'){ cleanup(); resolve(null); }
    }
    document.addEventListener('keydown', onKey);

    document.getElementById('crop-cancel-btn').addEventListener('click', () => { cleanup(); resolve(null); });

    document.getElementById('crop-confirm-btn').addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = CROP_OUTPUT_SIZE;
      canvas.height = CROP_OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      const mult = CROP_OUTPUT_SIZE / CROP_VIEWPORT_SIZE;
      // redraw the same on-screen crop at higher resolution, straight from the
      // original file — not from the small preview — so it stays sharp
      ctx.drawImage(img, offsetX * mult, offsetY * mult, img.naturalWidth * scale * mult, img.naturalHeight * scale * mult);
      canvas.toBlob((blob) => { cleanup(); resolve(blob); }, 'image/jpeg', 0.92);
    });

    root.querySelector('.modal-overlay').addEventListener('click', (e) => {
      if(e.target === e.currentTarget){ cleanup(); resolve(null); }
    });
  });
}
