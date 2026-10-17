// Interactions and dynamic controls for Shinta Selviriani Portfolio

// 1. Navigation scroll shadow
const nav = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (nav) {
    nav.style.boxShadow = y > 20 ? '0 8px 30px rgba(23,60,50,.07)' : 'none';
  }
});

// 2. Scroll reveal animations
const revealItems = document.querySelectorAll(
  '.edu-card, .timeline-item, .tax-paper-spotlight, .tax-sub-card, .skill-panel, .slide-card, .contact-card, .cert-card, .achieve-card'
);
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

revealItems.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// 3. Running Slide Gallery Controls & Marquee interaction
const marqueeTrack = document.querySelector('.running-slide-track');
const marqueeWrap = document.querySelector('.running-gallery-wrap');
const pauseBtn = document.getElementById('toggleMarqueeBtn');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');

let isPaused = false;

if (pauseBtn && marqueeTrack) {
  pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
      marqueeTrack.classList.add('paused');
      pauseBtn.innerHTML = '▶ Putar Slide';
      pauseBtn.classList.add('is-active');
    } else {
      marqueeTrack.classList.remove('paused');
      pauseBtn.innerHTML = '⏸ Jeda Slide';
      pauseBtn.classList.remove('is-active');
    }
  });
}

// Prev / Next manual scrolling buttons
if (prevBtn && marqueeWrap) {
  prevBtn.addEventListener('click', () => {
    marqueeWrap.scrollBy({ left: -340, behavior: 'smooth' });
  });
}
if (nextBtn && marqueeWrap) {
  nextBtn.addEventListener('click', () => {
    marqueeWrap.scrollBy({ left: 340, behavior: 'smooth' });
  });
}

// 4. Lightbox Modal Preview
const lightbox = document.getElementById('imageLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTag = document.getElementById('lightboxTag');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const lightboxMeta = document.getElementById('lightboxMeta');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(data) {
  if (!lightbox) return;
  
  if (lightboxImg) {
    if (data.img) {
      lightboxImg.src = data.img;
      lightboxImg.alt = data.title || 'Foto Kegiatan';
      lightboxImg.style.display = 'block';
    } else {
      lightboxImg.src = '';
      lightboxImg.style.display = 'none';
    }
  }

  if (lightboxTag) lightboxTag.textContent = data.tag || 'DOKUMENTASI';
  if (lightboxTitle) lightboxTitle.textContent = data.title || 'Dokumentasi Kegiatan';
  if (lightboxDesc) lightboxDesc.textContent = data.desc || 'Foto pendukung dokumentasi kegiatan dan penghargaan.';
  if (lightboxMeta) lightboxMeta.innerHTML = data.meta ? `<span>📍</span> ${data.meta}` : '<span>✦</span> Shinta Selviriani Portfolio';

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Attach click triggers to all experience photo cards, certificates, achievements, and gallery slide cards
function initLightboxTriggers() {
  const cards = document.querySelectorAll('[data-lightbox="true"]');
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked a sub-thumbnail item directly, let that handler process it
      if (e.target.closest('.achieve-thumb-item')) return;
      
      e.preventDefault();
      
      const imgEl = card.querySelector('img');
      const img = card.getAttribute('data-img') || (imgEl ? imgEl.src : '');
      const tag = card.getAttribute('data-tag') || (card.querySelector('.slide-tag, .slide-category-pill, .exp-photo-badge, .cert-badge, .achieve-rank-pill') ? card.querySelector('.slide-tag, .slide-category-pill, .exp-photo-badge, .cert-badge, .achieve-rank-pill').textContent.trim() : '');
      const title = card.getAttribute('data-title') || (card.querySelector('.slide-title, .cert-title, .achieve-title, h3') ? card.querySelector('.slide-title, .cert-title, .achieve-title, h3').textContent.trim() : '');
      const desc = card.getAttribute('data-desc') || (card.querySelector('.slide-description, .cert-desc, .achieve-desc, p') ? card.querySelector('.slide-description, .cert-desc, .achieve-desc, p').textContent.trim() : '');
      const meta = card.getAttribute('data-meta') || (card.querySelector('.slide-footer span, .cert-issuer, .achieve-organizer, .date') ? card.querySelector('.slide-footer span, .cert-issuer, .achieve-organizer, .date').textContent.trim() : '');

      openLightbox({ img, tag, title, desc, meta });
    });
  });

  // Handle achievement sub-thumbnails
  const subThumbs = document.querySelectorAll('.achieve-thumb-item');
  subThumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = thumb.closest('.achieve-card');
      const imgEl = thumb.querySelector('img');
      const captionEl = thumb.querySelector('span');
      
      const img = imgEl ? imgEl.src : '';
      const title = (parentCard && parentCard.getAttribute('data-title')) || 'Dokumentasi Kompetisi';
      const desc = captionEl ? `Dokumentasi: ${captionEl.textContent.trim()} — ${title}` : 'Foto momen kompetisi dan penghargaan.';
      const tag = (parentCard && parentCard.getAttribute('data-tag')) || 'KOMPETISI';
      const meta = (parentCard && parentCard.getAttribute('data-meta')) || 'Dokumentasi Penghargaan';

      openLightbox({ img, tag, title, desc, meta });
    });
  });
}

// 5. One-Click Copy Email Feature
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyFeedback = document.getElementById('copyFeedback');
const copyBtnLabel = document.getElementById('copyBtnLabel');

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = copyEmailBtn.getAttribute('data-email') || 'shntaaks@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      if (copyFeedback) {
        copyFeedback.classList.add('show');
        setTimeout(() => {
          copyFeedback.classList.remove('show');
        }, 2400);
      }
      if (copyBtnLabel) {
        const originalText = copyBtnLabel.textContent;
        copyBtnLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtnLabel.textContent = originalText;
        }, 2400);
      }
    }).catch(() => {
      prompt('Copy email address:', email);
    });
  });
}

// 6. Certificates Pagination (Maksimal 6 per halaman)
function initCertificatesPagination() {
  const grid = document.querySelector('.cert-grid');
  const paginationWrap = document.getElementById('certPaginationWrap');
  const paginationControls = document.getElementById('certPaginationControls');
  const paginationInfo = document.getElementById('certPaginationInfo');

  if (!grid || !paginationWrap) return;

  const cards = Array.from(grid.querySelectorAll('.cert-card'));
  const ITEMS_PER_PAGE = 6;
  const totalCards = cards.length;
  const totalPages = Math.ceil(totalCards / ITEMS_PER_PAGE);

  // Jika kartu <= 6, sembunyikan pagination bar dan tampilkan semua
  if (totalCards <= ITEMS_PER_PAGE) {
    paginationWrap.style.display = 'none';
    cards.forEach(card => {
      card.style.display = 'flex';
    });
    return;
  }

  paginationWrap.style.display = 'flex';
  let currentPage = 1;

  function renderPage(page, scrollToTop = false) {
    currentPage = page;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    cards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'flex';
        card.classList.remove('cert-fade-in');
        // Force reflow for CSS animation restart
        void card.offsetWidth;
        card.classList.add('cert-fade-in');
        card.classList.add('visible'); // pastikan langsung tampak
      } else {
        card.style.display = 'none';
      }
    });

    // Info teks paginasi
    const showingStart = startIndex + 1;
    const showingEnd = Math.min(endIndex, totalCards);
    if (paginationInfo) {
      paginationInfo.textContent = `Menampilkan ${showingStart}–${showingEnd} dari total ${totalCards} sertifikat (Halaman ${currentPage} dari ${totalPages})`;
    }

    // Tombol-tombol kontrol paginasi
    if (paginationControls) {
      paginationControls.innerHTML = '';

      // Tombol Prev
      const prevBtn = document.createElement('button');
      prevBtn.className = 'cert-page-btn cert-page-nav';
      prevBtn.setAttribute('type', 'button');
      prevBtn.setAttribute('aria-label', 'Halaman Sebelumnya');
      prevBtn.innerHTML = '← Prev';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) renderPage(currentPage - 1, true);
      });
      paginationControls.appendChild(prevBtn);

      // Tombol Angka Halaman
      for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `cert-page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.setAttribute('type', 'button');
        pageBtn.setAttribute('aria-label', `Halaman ${i}`);
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          if (i !== currentPage) renderPage(i, true);
        });
        paginationControls.appendChild(pageBtn);
      }

      // Tombol Next
      const nextBtn = document.createElement('button');
      nextBtn.className = 'cert-page-btn cert-page-nav';
      nextBtn.setAttribute('type', 'button');
      nextBtn.setAttribute('aria-label', 'Halaman Selanjutnya');
      nextBtn.innerHTML = 'Next →';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) renderPage(currentPage + 1, true);
      });
      paginationControls.appendChild(nextBtn);
    }

    if (scrollToTop) {
      const section = document.getElementById('certificates');
      if (section) {
        const yOffset = -70; // offset untuk navbar sticky
        const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  }

  // Tampilkan halaman pertama
  renderPage(1, false);
}

// Run initializers
document.addEventListener('DOMContentLoaded', () => {
  initLightboxTriggers();
  initCertificatesPagination();
});

