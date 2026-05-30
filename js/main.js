/* ============================================
   ORION PHARMA INDIA — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- DOM Ready ---
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNavbar();
    initScrollAnimations();
    initCardRevealAnimations();
    initBackToTop();
    initFooterYear();
    initContactModalTriggers();
    initContactForm();
    initProductSearch();
    initCategoryFilter();

    // Featured products grid on the homepage
    if (document.getElementById('featured-products-grid')) {
      initFeaturedProductsSection();
    }

    // Catalog page: load dynamic products
    if (document.getElementById('product-search')) {
      loadCatalogProducts(function() {
        filterProducts();
        initProductDetailOverlay();
      });
    }
  }

  // =========================================
  // CARD REVEAL ANIMATIONS
  // =========================================
  function initCardRevealAnimations() {
    var cards = document.querySelectorAll('.product-card');
    if (!cards.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -20px 0px'
    });

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  // =========================================
  // FEATURED PRODUCTS SECTION (Homepage)
  // Slugs that appear as featured; change to pick different products.
  // =========================================
  var FEATURED_SLUGS = [
    'foligraf-1200-vial',
    'foligraf-900-pen',
    'rhucog-6500-pfs',
    'asporelix-0-25-vial'
  ];

  var DELAY_CLASSES = ['fade-up', 'fade-up fade-up-delay-1', 'fade-up fade-up fade-up-delay-2', 'fade-up fade-up-delay-3'];

  function initFeaturedProductsSection() {
    var grid = document.getElementById('featured-products-grid');
    if (!grid) return;

    // Data may already be loaded (products-data.js is in <head> of index.html)
    if (window.productsData) {
      renderFeaturedProducts(grid);
    } else {
      loadCatalogScript(function () { renderFeaturedProducts(grid); });
    }
  }

  function renderFeaturedProducts(grid) {
    var products = window.productsData;
    if (!products) return;

    var featured = [];
    FEATURED_SLUGS.forEach(function (slug) {
      var match = products.find(function (p) { return p.slug === slug || p.id === slug; });
      if (match) featured.push(match);
    });

    // Fallback: if any slug wasn't found, pad with the first products in the list
    if (featured.length < 4) {
      products.forEach(function (p) {
        if (featured.length >= 4) return;
        var already = featured.some(function (f) { return f.slug === p.slug; });
        if (!already) featured.push(p);
      });
    }

    var html = '';
    featured.forEach(function (p, i) {
      var imageHtml = '<img src="assets/images/placeholder.png" alt="' + p.name + '" style="width: 100%; height: 100%; object-fit: cover;">';
      html += '<a href="products/' + p.slug + '.html" class="card product-card ' + DELAY_CLASSES[i] + '" data-category="' + p.category + '">' +
        '<div class="product-card__image" style="min-height: 200px; display: flex; align-items: center; justify-content: center; overflow: hidden;">' +
          '<span class="product-card__badge" style="z-index:5;">' + p.categoryLabel + '</span>' +
          imageHtml +
        '</div>' +
        '<div class="product-card__body">' +
          '<span class="product-card__category">' + p.categoryLabel + '</span>' +
          '<h3 class="product-card__title">' + p.name + '</h3>' +
          (p.administration ? '<p class="product-card__desc">' + p.administration + '</p>' : '') +
        '</div>' +
      '</a>';
    });

    grid.innerHTML = html;

    // Trigger scroll animations for the newly rendered cards
    initCardRevealAnimations();
    initScrollAnimations();
  }



  // =========================================
  // NAVBAR
  // =========================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.querySelector('.navbar__toggle');
    const links = document.querySelector('.navbar__links');

    if (!navbar) return;

    // Scroll effect
    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Mobile toggle
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      links.querySelectorAll('.navbar__link').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          links.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on resize above breakpoint
      window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
          toggle.classList.remove('active');
          links.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // =========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // =========================================
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-up');

    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // =========================================
  // BACK TO TOP
  // =========================================
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initFooterYear() {
    document.querySelectorAll('.current-year').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // =========================================
  // CONTACT FORM VALIDATION
  // =========================================
  function initContactForm() {
    var forms = document.querySelectorAll('#contact-form, #modal-contact-form');
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var valid = true;
        var fields = form.querySelectorAll('[required]');

        fields.forEach(function (field) {
          var group = field.closest('.form-group');
          if (!group) return;

          group.classList.remove('has-error');

          if (!field.value.trim()) {
            group.classList.add('has-error');
            valid = false;
          }

          // Email validation
          if (field.type === 'email' && field.value.trim()) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
              group.classList.add('has-error');
              valid = false;
            }
          }

          // Phone validation (basic)
          if (field.type === 'tel' && field.value.trim()) {
            var phoneRegex = /^[\d\s+\-()]{7,20}$/;
            if (!phoneRegex.test(field.value.trim())) {
              group.classList.add('has-error');
              valid = false;
            }
          }
        });

        if (valid) {
          showToast('Thank you! Your message has been sent successfully.');
          form.reset();
          
          // Close contact modal if it's active
          var modal = document.getElementById('contact-modal');
          if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
          }
        }
      });

      // Clear errors on input
      form.querySelectorAll('input, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
          var group = field.closest('.form-group');
          if (group) group.classList.remove('has-error');
        });
      });
    });
  }

  // Popup Contact Modal injection and triggers
  function injectContactModal() {
    if (document.getElementById('contact-modal')) return;

    var modalHtml = 
      '<div class="modal-overlay" id="contact-modal">' +
        '<div class="modal-card">' +
          '<button class="modal-close" id="modal-close-btn" aria-label="Close modal">&times;</button>' +
          '<div class="modal-body">' +
            '<!-- Left side: info -->' +
            '<div class="modal-info">' +
              '<h3 class="modal-title">Get in Touch</h3>' +
              '<p class="modal-subtitle">Connect with Orion Pharma instantly for inquiries or support.</p>' +
              '<div class="modal-options">' +
                '<a href="tel:+919326863373" class="modal-option">' +
                  '<div class="modal-option__icon">' +
                    '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">' +
                      '<path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />' +
                    '</svg>' +
                  '</div>' +
                  '<div class="modal-option__content">' +
                    '<h4>Call Us</h4>' +
                    '<span>+91 9326863373</span>' +
                  '</div>' +
                '</a>' +
                '<a href="https://wa.me/919326863373" target="_blank" rel="noopener" class="modal-option">' +
                  '<div class="modal-option__icon" style="background: rgba(37, 211, 102, 0.15); color: #25D366;">' +
                    '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
                  '</div>' +
                  '<div class="modal-option__content">' +
                    '<h4>WhatsApp</h4>' +
                    '<span>Chat Live Now</span>' +
                  '</div>' +
                '</a>' +
                '<a href="mailto:info@orionpharmaindia.org" class="modal-option">' +
                  '<div class="modal-option__icon" style="background: rgba(37, 99, 235, 0.15); color: #60A5FA;">' +
                    '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">' +
                      '<path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 0 0-2.22 0L21 8M5 19h14a2 2 0 0 0-2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />' +
                    '</svg>' +
                  '</div>' +
                  '<div class="modal-option__content">' +
                    '<h4>Email Us</h4>' +
                    '<span>info@orionpharmaindia.org</span>' +
                  '</div>' +
                '</a>' +
              '</div>' +
            '</div>' +
            '<!-- Right side: form -->' +
            '<div class="modal-form">' +
              '<h3 class="modal-form-title">Send a Message</h3>' +
              '<form id="modal-contact-form" class="contact-form" novalidate>' +
                '<div class="form-row">' +
                  '<div class="form-group">' +
                    '<label for="modal-name">Full Name *</label>' +
                    '<input type="text" id="modal-name" name="name" required placeholder="John Doe">' +
                    '<span class="error-msg">Please enter your name</span>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="modal-email">Email Address *</label>' +
                    '<input type="email" id="modal-email" name="email" required placeholder="john@example.com">' +
                    '<span class="error-msg">Please enter a valid email address</span>' +
                  '</div>' +
                '</div>' +
                '<div class="form-row">' +
                  '<div class="form-group">' +
                    '<label for="modal-phone">Phone Number *</label>' +
                    '<input type="tel" id="modal-phone" name="phone" required placeholder="+91 XXXXX XXXXX">' +
                    '<span class="error-msg">Please enter a valid phone number</span>' +
                  '</div>' +
                  '<div class="form-group">' +
                    '<label for="modal-subject">Subject *</label>' +
                    '<input type="text" id="modal-subject" name="subject" required placeholder="General Inquiry">' +
                    '<span class="error-msg">Please enter a subject</span>' +
                  '</div>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="modal-message">Your Message *</label>' +
                  '<textarea id="modal-message" name="message" required placeholder="Describe your inquiry in detail..."></textarea>' +
                  '<span class="error-msg">Please enter your message</span>' +
                '</div>' +
                '<button type="submit" class="btn btn--primary btn--lg" style="width: 100%; margin-top: 10px;">Send Message</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    // Attach close events
    var modal = document.getElementById('contact-modal');
    var closeBtn = document.getElementById('modal-close-btn');

    if (modal && closeBtn) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });

      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  function initContactModalTriggers() {
    injectContactModal();

    document.addEventListener('click', function (e) {
      var target = e.target.closest('a');
      if (!target) return;

      var href = target.getAttribute('href');
      var isGetInTouch = target.textContent.trim().toLowerCase() === 'get in touch';

      // Intercept only "Get In Touch" buttons going to contact.html
      if (href && href.indexOf('contact.html') !== -1 && isGetInTouch) {
        e.preventDefault();
        var modal = document.getElementById('contact-modal');
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';

          // Reset pre-filled subject in case it was altered
          var subjectInput = document.getElementById('modal-subject');
          if (subjectInput && !subjectInput.value.startsWith('Product Inquiry')) {
            subjectInput.value = 'General Inquiry';
          }

          // Focus on the first input
          var firstInput = document.getElementById('modal-name');
          if (firstInput) setTimeout(function() { firstInput.focus(); }, 150);
        }
      }
    });
  }

  // =========================================
  // PRODUCT CATALOG & PAGINATION STATE
  // =========================================
  var activePage = 1;
  var itemsPerPage = 9;

  function loadCatalogProducts(callback) {
    if (window.location.protocol === 'file:') {
      loadCatalogScript(callback);
    } else {
      fetch('data/products.json')
        .then(function(res) {
          if (!res.ok) throw new Error('HTTP status ' + res.status);
          return res.json();
        })
        .then(function(data) {
          window.productsData = data;
          callback();
        })
        .catch(function(err) {
          console.warn('Local fetch data/products.json failed, falling back to script...', err);
          loadCatalogScript(callback);
        });
    }
  }

  function loadCatalogScript(callback) {
    if (window.productsData) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = 'js/products-data.js';
    script.onload = callback;
    script.onerror = function() {
      console.error('Critical Error: Failed to load fallback catalog script.');
    };
    document.head.appendChild(script);
  }

  function initProductSearch() {
    var searchInput = document.getElementById('product-search');
    if (!searchInput) return;

    var debounceTimer;
    searchInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        activePage = 1; // Reset pagination on search input
        filterProducts();
      }, 200);
    });
  }

  function initCategoryFilter() {
    var tabs = document.querySelectorAll('.category-tab');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activePage = 1; // Reset pagination on category change
        filterProducts();
      });
    });
  }

  function filterProducts() {
    var searchInput = document.getElementById('product-search');
    var activeTab = document.querySelector('.category-tab.active');
    var grid = document.getElementById('products-grid');
    var countEl = document.querySelector('.products-count strong');

    if (!grid || !window.productsData) return;

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var category = activeTab ? activeTab.getAttribute('data-category') : 'all';

    // Filter dynamic database
    var matchingProducts = window.productsData.filter(function (p) {
      var name = (p.name || '').toLowerCase();
      var cat = p.category || '';

      var matchesSearch = !query || name.indexOf(query) !== -1;
      var matchesCategory = category === 'all' || cat === category;

      return matchesSearch && matchesCategory;
    });

    // Update count
    if (countEl) {
      countEl.textContent = matchingProducts.length;
    }

    // Paginate dynamic matching items
    var startIndex = (activePage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var activeProducts = matchingProducts.slice(startIndex, endIndex);

    var html = '';
    activeProducts.forEach(function (p) {
      var imageHtml = p.imageHtml || '';
      if (p.image === 'assets/images/placeholder.png' || !imageHtml || imageHtml.indexOf('<svg') !== -1) {
        imageHtml = `<img src="assets/images/placeholder.png" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
      }
      // Dynamic dynamic catalog URL points directly to `/products/{slug}.html`
      html += `
        <a href="products/${p.slug}.html" class="card product-card" data-category="${p.category}">
          <div class="product-card__image" style="min-height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.01); overflow: hidden;">
            <span class="product-card__badge" style="z-index: 5;">${p.categoryLabel}</span>
            ${imageHtml}
          </div>
          <div class="product-card__body">
            <span class="product-card__category">${p.categoryLabel}</span>
            <h3 class="product-card__title">${p.name}</h3>
          </div>
        </a>`;
    });

    // Handle no results
    if (matchingProducts.length === 0) {
      html = `
        <div class="no-results" id="no-results" style="display:block;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:64px; height:64px; opacity:0.3; margin:auto;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6"/></svg>
          <p style="margin-top: var(--space-sm); color: var(--color-text-light);">No products found matching your search.</p>
        </div>`;
    }

    grid.innerHTML = html;

    // Trigger reveal animations on dynamic cards
    initCardRevealAnimations();

    // Render Pagination Controls
    renderPagination(matchingProducts.length);
  }

  function renderPagination(totalItems) {
    var paginationContainer = document.getElementById('products-pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    var totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) {
      return; // No pagination controls needed if only 1 page
    }

    // Prev Button
    var prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '&larr;';
    prevBtn.disabled = activePage === 1;
    prevBtn.addEventListener('click', function () {
      if (activePage > 1) {
        activePage--;
        filterProducts();
        var catHeader = document.getElementById('products-catalog');
        if (catHeader) {
          window.scrollTo({ top: catHeader.offsetTop - 80, behavior: 'smooth' });
        }
      }
    });
    paginationContainer.appendChild(prevBtn);

    // Page Number Buttons
    for (var i = 1; i <= totalPages; i++) {
      (function (pageNum) {
        var pageBtn = document.createElement('button');
        pageBtn.className = 'pagination-btn' + (activePage === pageNum ? ' active' : '');
        pageBtn.textContent = pageNum;
        pageBtn.addEventListener('click', function () {
          activePage = pageNum;
          filterProducts();
          var catHeader = document.getElementById('products-catalog');
          if (catHeader) {
            window.scrollTo({ top: catHeader.offsetTop - 80, behavior: 'smooth' });
          }
        });
        paginationContainer.appendChild(pageBtn);
      })(i);
    }

    // Next Button
    var nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = '&rarr;';
    nextBtn.disabled = activePage === totalPages;
    nextBtn.addEventListener('click', function () {
      if (activePage < totalPages) {
        activePage++;
        filterProducts();
        var catHeader = document.getElementById('products-catalog');
        if (catHeader) {
          window.scrollTo({ top: catHeader.offsetTop - 80, behavior: 'smooth' });
        }
      }
    });
    paginationContainer.appendChild(nextBtn);
  }

  // =========================================
  // ROUTING & LEGACY REDIRECTS
  // =========================================
  function initProductDetailOverlay() {
    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute();
  }

  function checkHashRoute() {
    var hash = window.location.hash;
    if (hash && hash.indexOf('#product/') === 0) {
      var slug = hash.replace('#product/', '');
      // Seamlessly redirect any legacy hash links to their new SEO-friendly URL!
      window.location.href = 'products/' + slug + '.html';
    }
  }

  // =========================================
  // TOAST NOTIFICATION
  // =========================================
  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('visible');
    });

    setTimeout(function () {
      toast.classList.remove('visible');
      setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
  }

})();
