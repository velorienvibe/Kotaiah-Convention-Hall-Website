// Kotaiah Convention Hall — navigation, image fallback, gallery and WhatsApp enquiry.
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Keep every image region visually complete if a third-party photo host blocks the request.
  document.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => {
      const fallback = img.dataset.fallback;
      if (fallback && img.src !== new URL(fallback, document.baseURI).href) {
        img.src = fallback;
        img.removeAttribute('srcset');
        const tile = img.closest('.gallery-tile');
        if (tile) tile.dataset.full = fallback;
      }
    }, { once: true });
  });

  // Mobile navigation.
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    }));
    document.addEventListener('click', (event) => {
      if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Gallery lightbox; each tile can open a source image or a local illustration.
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImage = lightbox.querySelector('img');
    const close = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.gallery-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const tileImg = tile.querySelector('img');
        lightboxImage.src = tile.dataset.full || (tileImg ? tileImg.currentSrc || tileImg.src : '');
        lightboxImage.alt = tile.dataset.alt || (tileImg ? tileImg.alt : 'Venue photograph');
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeButton = lightbox.querySelector('.lightbox-close');
    if (closeButton) closeButton.addEventListener('click', close);
    lightbox.addEventListener('click', (event) => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('open')) close(); });
  }

  // WhatsApp enquiry form — no data is stored on a server.
  const form = document.getElementById('enquiry-form');
  if (form) {
    const dateField = form.querySelector('[name="date"]');
    if (dateField) dateField.min = new Date().toISOString().slice(0, 10);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const values = new FormData(form);
      const get = (key) => String(values.get(key) || '').trim();
      const message = [
        'Hello Kotaiah Convention Hall, I would like to enquire about an event.', '',
        `Name: ${get('name')}`,
        `Phone: ${get('phone')}`,
        `Occasion: ${get('event')}`,
        `Preferred date: ${get('date') || 'Not decided'}`,
        `Expected guests: ${get('guests') || 'Not decided'}`,
        `Additional details: ${get('message') || 'None'}`
      ].join('\n');
      const phone = '919989585599'; // Publicly listed venue contact; verify with management before launch.
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  }
});
