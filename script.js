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

// 7. Content Input Studio (Khusus route /input)
function initInputStudio() {
  const overlay = document.getElementById('inputStudioOverlay');
  if (!overlay) return;

  function isInputRoute() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path === '/input' ||
      path === '/input/' ||
      path.endsWith('/input') ||
      path.endsWith('/input/') ||
      hash === '#/input' ||
      hash === '#input' ||
      search.includes('input=true') ||
      search.includes('route=input')
    );
  }

  function syncStudioVisibility() {
    if (isInputRoute()) {
      overlay.classList.add('is-active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      updateStudioPreview();
    } else {
      overlay.classList.remove('is-active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  // Handle Close Button
  const closeBtn = document.getElementById('studioCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.location.hash.includes('input')) {
        window.location.hash = '';
      } else if (window.location.pathname.includes('/input')) {
        if (window.history.pushState) {
          window.history.pushState({}, '', window.location.origin + '/');
        } else {
          window.location.href = './';
        }
      }
      syncStudioVisibility();
    });
  }

  // Category Tabs switching
  let currentCategory = 'certificates';
  const tabBtns = document.querySelectorAll('.studio-tab-btn');
  const fieldsets = {
    certificates: document.getElementById('fieldsCertificates'),
    experience: document.getElementById('fieldsExperience'),
    achievements: document.getElementById('fieldsAchievements'),
    gallery: document.getElementById('fieldsGallery')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');

      Object.keys(fieldsets).forEach(cat => {
        if (fieldsets[cat]) {
          fieldsets[cat].style.display = (cat === currentCategory) ? 'grid' : 'none';
        }
      });

      updateStudioPreview();
    });
  });

  // Toast Helper
  const toast = document.getElementById('studioToast');
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // Live Generator & Preview
  const previewWrap = document.getElementById('studioCardPreviewWrap');
  const codeOutput = document.getElementById('studioCodeOutput');

  function updateStudioPreview() {
    let generatedHtml = '';
    let previewElement = '';

    if (currentCategory === 'certificates') {
      const badge = document.getElementById('certBadge')?.value || '1st Winner';
      const year = document.getElementById('certYear')?.value || '2026';
      const title = document.getElementById('certTitle')?.value || 'Judul Sertifikat';
      const issuer = document.getElementById('certIssuer')?.value || 'Penyelenggara';
      const certId = document.getElementById('certId')?.value || 'ID: CERT-2026';
      const img = document.getElementById('certImg')?.value || 'images/certificates/unpam-tax-competition.jpeg';
      const desc = document.getElementById('certDesc')?.value || 'Deskripsi sertifikat...';

      previewElement = `
        <article class="cert-card" style="max-width: 360px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.12);">
          <div class="cert-img-wrap">
            <span class="cert-badge">${badge}</span>
            <span class="cert-year">${year}</span>
            <img src="${img}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="cert-body">
            <span class="cert-issuer">${issuer}</span>
            <h3 class="cert-title">${title}</h3>
            <p class="cert-desc">${desc}</p>
            <div class="cert-footer">
              <span class="cert-id">${certId}</span>
              <span class="cert-cta">View certificate ↗</span>
            </div>
          </div>
        </article>
      `;

      generatedHtml = `<!-- SERTIFIKAT BARU: ${title} -->
<article class="cert-card" data-lightbox="true" data-title="${title}"
  data-desc="${desc}"
  data-tag="${badge}" data-meta="${issuer} · ${year}">
  <div class="cert-img-wrap">
    <span class="cert-badge">${badge}</span>
    <span class="cert-year">${year}</span>
    <img src="${img}" alt="${title}">
  </div>
  <div class="cert-body">
    <span class="cert-issuer">${issuer}</span>
    <h3 class="cert-title">${title}</h3>
    <p class="cert-desc">${desc}</p>
    <div class="cert-footer">
      <span class="cert-id">${certId}</span>
      <span class="cert-cta">View certificate ↗</span>
    </div>
  </div>
</article>`;
    } else if (currentCategory === 'experience') {
      const period = document.getElementById('expPeriod')?.value || 'Jul 2026 — Present';
      const company = document.getElementById('expCompany')?.value || 'Nama Perusahaan';
      const role = document.getElementById('expRole')?.value || 'Posisi Jabatan';
      const desc = document.getElementById('expDesc')?.value || 'Deskripsi pekerjaan dan kontribusi...';

      previewElement = `
        <div class="timeline-item" style="background: rgba(16,46,39,0.06); padding: 18px; border-radius: 14px;">
          <span class="date" style="font-weight: 700; color: #5a7a6c;">${period}</span>
          <div>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 20px; color: var(--green); margin-bottom: 2px;">${company}</h3>
            <b style="color: var(--green2); font-size: 12px;">${role}</b>
            <p style="font-size: 13px; color: #556860; margin-top: 8px;">${desc}</p>
          </div>
        </div>
      `;

      generatedHtml = `<!-- EXPERIENCE ITEM: ${company} -->
<div class="timeline-item">
  <span class="date">${period}</span>
  <div>
    <h3>${company}</h3>
    <b>${role}</b>
    <p>${desc}</p>
  </div>
</div>`;
    } else if (currentCategory === 'achievements') {
      const rank = document.getElementById('achieveRank')?.value || '🏆 1st Winner National';
      const year = document.getElementById('achieveYear')?.value || '2026';
      const title = document.getElementById('achieveTitle')?.value || 'Nama Prestasi';
      const organizer = document.getElementById('achieveOrganizer')?.value || 'Penyelenggara';
      const img = document.getElementById('achieveImg')?.value || 'images/certificates/unpam-tax-competition.jpeg';
      const desc = document.getElementById('achieveDesc')?.value || 'Rincian prestasi...';

      previewElement = `
        <article class="cert-card" style="max-width: 360px; margin: 0 auto;">
          <div class="cert-img-wrap">
            <span class="cert-badge">${rank}</span>
            <span class="cert-year">${year}</span>
            <img src="${img}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="cert-body">
            <span class="cert-issuer">${organizer}</span>
            <h3 class="cert-title">${title}</h3>
            <p class="cert-desc">${desc}</p>
          </div>
        </article>
      `;

      generatedHtml = `<!-- ACHIEVEMENT ITEM: ${title} -->
<article class="achieve-card" data-lightbox="true" data-title="${title}"
  data-desc="${desc}"
  data-tag="${rank}" data-meta="${organizer} · ${year}">
  <div class="achieve-visual-wrap">
    <div class="achieve-main-photo">
      <span class="achieve-rank-pill gold">${rank}</span>
      <span class="achieve-year-tag">${year}</span>
      <img src="${img}" alt="${title}">
    </div>
  </div>
  <div class="achieve-content">
    <span class="achieve-organizer">${organizer}</span>
    <h3 class="achieve-title">${title}</h3>
    <p class="achieve-desc">${desc}</p>
  </div>
</article>`;
    } else if (currentCategory === 'gallery') {
      const tag = document.getElementById('galTag')?.value || 'TAX COMPETITION';
      const badge = document.getElementById('galBadge')?.value || '1st Place Winner';
      const title = document.getElementById('galTitle')?.value || 'Judul Momen';
      const img = document.getElementById('galImg')?.value || 'images/certificates/unpam-tax-competition.jpeg';
      const desc = document.getElementById('galDesc')?.value || 'Deskripsi foto kegiatan...';

      previewElement = `
        <article class="cert-card" style="max-width: 320px; margin: 0 auto;">
          <div class="cert-img-wrap">
            <span class="cert-badge">${badge}</span>
            <img src="${img}" alt="${title}" onerror="this.src='https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=600&q=80'">
          </div>
          <div class="cert-body">
            <span class="cert-issuer">${tag}</span>
            <h3 class="cert-title">${title}</h3>
            <p class="cert-desc">${desc}</p>
          </div>
        </article>
      `;

      generatedHtml = `<!-- GALLERY SLIDE: ${title} -->
<article class="slide-card" data-lightbox="true" data-title="${title}"
  data-desc="${desc}"
  data-tag="${tag}">
  <div class="slide-img-box">
    <span class="slide-category-pill">${badge}</span>
    <img src="${img}" alt="${title}">
  </div>
  <div class="slide-content">
    <div class="slide-tag">${tag}</div>
    <h3 class="slide-title">${title}</h3>
    <p class="slide-description">${desc}</p>
  </div>
</article>`;
    }

    if (previewWrap) previewWrap.innerHTML = previewElement;
    if (codeOutput) codeOutput.textContent = generatedHtml;
  }

  // Form input listeners for dynamic typing update
  const studioForm = document.getElementById('studioForm');
  if (studioForm) {
    studioForm.addEventListener('input', updateStudioPreview);
  }

  // Copy HTML Button
  const copyHtmlBtn = document.getElementById('studioCopyHtmlBtn');
  const quickCopyBtn = document.getElementById('studioQuickCopyBtn');

  function copyCodeToClipboard() {
    if (!codeOutput) return;
    const code = codeOutput.textContent;
    navigator.clipboard.writeText(code).then(() => {
      showToast('✓ Kode HTML berhasil disalin ke clipboard!');
    }).catch(() => {
      prompt('Salin kode HTML di bawah ini:', code);
    });
  }

  if (copyHtmlBtn) copyHtmlBtn.addEventListener('click', copyCodeToClipboard);
  if (quickCopyBtn) quickCopyBtn.addEventListener('click', copyCodeToClipboard);

  // Save to Local Preview & Persistence
  const saveLocalBtn = document.getElementById('studioSaveLocalBtn');
  if (saveLocalBtn) {
    saveLocalBtn.addEventListener('click', () => {
      if (currentCategory === 'certificates') {
        const grid = document.querySelector('.cert-grid');
        if (grid && codeOutput) {
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = codeOutput.textContent.trim();
          const newCard = tempDiv.firstElementChild;
          if (newCard) {
            grid.appendChild(newCard);
            // Re-init lightbox triggers and pagination
            if (typeof initLightboxTriggers === 'function') initLightboxTriggers();
            if (typeof initCertificatesPagination === 'function') initCertificatesPagination();
            showToast('✓ Sertifikat baru berhasil ditambahkan ke halaman!');
          }
        }
      } else {
        showToast('✓ Salin kode HTML untuk ditempel ke file section!');
      }
    });
  }

  // Reset Form
  const resetBtn = document.getElementById('studioResetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (studioForm) studioForm.reset();
      updateStudioPreview();
      showToast('Form berhasil di-reset.');
    });
  }

  // Listen to hash / route changes
  window.addEventListener('hashchange', syncStudioVisibility);
  window.addEventListener('popstate', syncStudioVisibility);

  // Initial check
  syncStudioVisibility();
}

// Run initializers
document.addEventListener('DOMContentLoaded', () => {
  initLightboxTriggers();
  initCertificatesPagination();
  initInputStudio();
});


