/* ==========================================================================
   ORION PHARMA INDIA — Shared Product Detail Loader
   ========================================================================== */

(function () {
  'use strict';

  // 1. Determine Product Slug
  var slug = window.productSlug || getSlugFromFilename();

  function getSlugFromFilename() {
    var parts = window.location.pathname.split('/');
    var filename = parts.pop() || '';
    return filename.replace('.html', '');
  }

  // 2. Load Products Catalog Data (Double-click protocol check)
  if (window.location.protocol === 'file:') {
    loadDatabaseScript(initProduct);
  } else {
    fetch('../data/products.json')
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP status ' + res.status);
        return res.json();
      })
      .then(function (data) {
        window.productsData = data;
        initProduct();
      })
      .catch(function (err) {
        console.warn('JSON fetch failed, falling back to script...', err);
        loadDatabaseScript(initProduct);
      });
  }

  function loadDatabaseScript(callback) {
    if (window.productsData) {
      callback();
      return;
    }
    var script = document.createElement('script');
    script.src = '../js/products-data.js';
    script.onload = callback;
    script.onerror = function () {
      console.error('Critical Error: Failed to load products data script.');
    };
    document.head.appendChild(script);
  }

  // 3. Initialize & Populate Product Page
  function initProduct() {
    var products = window.productsData;
    if (!products) {
      console.error('Products database not found.');
      return;
    }

    var product = products.find(function (p) {
      return p.slug === slug || p.id === slug;
    });

    if (!product) {
      console.warn('Product not found for slug: ' + slug + '. Redirecting to catalog.');
      window.location.href = '../products.html';
      return;
    }

    // A. Dynamic SEO head tags injection
    injectSEO(product);

    // B. Build responsive premium layout shell
    renderLayout(product);

    // C. Render Related Products
    renderRelatedProducts(product, products);

    // D. Initialise Navigation placeholders (Navbar, Footer, FABs) via components.js
    if (window.initNavigationComponents) {
      window.initNavigationComponents();
    }

    // E. Setup Page Interactivity and Event Listeners
    setupInteractivity(product);
  }

  // --- Helpers for SEO Tag updates ---
  function updateMeta(name, content) {
    if (!content) return;
    var el = document.querySelector('meta[name="' + name + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function updateMetaProperty(property, content) {
    if (!content) return;
    var el = document.querySelector('meta[property="' + property + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  // --- Inject Dynamic SEO & Schema ---
  function injectSEO(product) {
    document.title = product.metaTitle || (product.name + ' | Orion Pharma India');

    updateMeta('description', product.metaDescription);
    updateMetaProperty('og:title', product.metaTitle || product.name);
    updateMetaProperty('og:description', product.metaDescription);
    updateMetaProperty('og:url', product.canonicalUrl || window.location.href);

    var imageUrl = product.image.startsWith('http') 
      ? product.image 
      : 'https://orionpharmaindia.org/' + product.image;
    updateMetaProperty('og:image', imageUrl);

    updateMetaProperty('twitter:title', product.metaTitle || product.name);
    updateMetaProperty('twitter:description', product.metaDescription);
    updateMetaProperty('twitter:image', imageUrl);

    // Canonical link
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = product.canonicalUrl || window.location.href;

    // Structured JSON-LD Product Schema
    var productSchema = document.createElement('script');
    productSchema.type = 'application/ld+json';
    productSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "category": product.categoryLabel,
      "image": imageUrl,
      "url": product.canonicalUrl || window.location.href,
      "manufacturer": {
        "@type": "Organization",
        "name": "Orion Pharma India"
      }
    });
    document.head.appendChild(productSchema);

    // Structured JSON-LD Breadcrumb Schema
    var breadcrumbSchema = document.createElement('script');
    breadcrumbSchema.type = 'application/ld+json';
    breadcrumbSchema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://orionpharmaindia.org/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": "https://orionpharmaindia.org/products"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": product.canonicalUrl || window.location.href
        }
      ]
    });
    document.head.appendChild(breadcrumbSchema);
  }

  // --- Render Responsive Premium HTML Layout ---
  function renderLayout(product) {
    var shell = document.getElementById('product-page-shell');
    if (!shell) return;

    // Relative Image Path Prepend Helper for one-folder nested products
    var imageHtml = product.imageHtml;
    if (product.image === 'assets/images/placeholder.png' || !imageHtml || imageHtml.indexOf('<svg') !== -1) {
      imageHtml = '<img src="../assets/images/placeholder.png" alt="' + product.name + '" style="width: 100%; height: 100%; object-fit: cover;">';
    } else {
      imageHtml = imageHtml.replace(/src="assets\//g, 'src="../assets/');
    }

    var badgeHtml = '';
    if (product.verificationStatus === 'pending') {
      badgeHtml = `
        <span class="verification-badge" style="padding: 0.3rem 0.75rem; font-size: var(--fs-xs); font-weight: 600; text-transform: uppercase; border-radius: var(--radius-full); background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.25); color: var(--color-danger); letter-spacing: 0.05em; display: inline-flex; align-items: center; gap: 4px;">
          <span style="width: 6px; height: 6px; border-radius: 50%; background-color: var(--color-danger); display: inline-block;"></span>
          Pending Verification
        </span>`;
    }

    shell.innerHTML = `
      <!-- Navbar Placeholder -->
      <div id="navbar-placeholder"></div>

      <!-- Hero Section / Breadcrumbs -->
      <section class="hero hero--page" id="product-hero">
        <div class="hero__bg-image" style="position: absolute; inset: 0; background-image: url('../assets/images/syg.jpg'); background-size: cover; background-position: center; opacity: 0.15; z-index: 1;"></div>
        <div class="hero__bg-pattern" style="z-index: 2;"></div>
        <div class="hero__glow hero__glow--1" style="z-index: 2;"></div>
        <div class="container" style="position: relative; z-index: 3;">
          <div class="hero__content" style="text-align:center;max-width:700px;margin:0 auto;">
            <div class="breadcrumb" style="display: flex; justify-content: center; align-items: center; gap: 8px; font-size: var(--fs-small); color: var(--color-text-light); margin-bottom: var(--space-md); font-weight: 500;">
              <a href="../index.html" style="color: var(--color-text-light); transition: color var(--transition-fast);">Home</a>
              <span style="opacity: 0.5;">&bull;</span>
              <a href="../products.html" style="color: var(--color-text-light); transition: color var(--transition-fast);">Products</a>
              <span style="opacity: 0.5;">&bull;</span>
              <span style="color: var(--color-accent); font-weight: 600;">${product.name}</span>
            </div>
            <h1 class="hero__title" style="margin-bottom:0;"><span class="hero__title-accent">${product.name}</span></h1>
            <p class="hero__subtitle" style="margin: 0 auto; margin-top: 8px; font-size: var(--fs-small); color: var(--color-text-light); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">${product.categoryLabel}</p>
          </div>
        </div>
      </section>

      <!-- Product Detail Container -->
      <section class="section" id="product-detail">
        <div class="container">
          <div style="margin-bottom: var(--space-xl);">
            <a href="../products.html" class="detail-back-btn" style="display: inline-flex; align-items: center; gap: var(--space-sm); background: none; border: none; color: var(--color-text-light); font-size: var(--fs-small); font-weight: 600; cursor: pointer; transition: color var(--transition-fast); text-decoration: none;">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Product Catalog
            </a>
          </div>

            <div class="card" style="padding: var(--space-2xl); border-radius: var(--radius-xl);">
            <div class="detail-grid">
              
              <!-- Image Section -->
              <div class="detail-image-wrapper" style="display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid rgba(255,255,255,0.05); min-height: 350px;">
                ${imageHtml}
              </div>
              
              <!-- Info Section -->
              <div class="detail-info">
                <div style="display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap;">
                  <span class="detail-category" style="font-size: var(--fs-xs); font-weight: 700; color: var(--color-accent); text-transform: uppercase; letter-spacing: 0.05em;">${product.categoryLabel}</span>
                  ${badgeHtml}
                </div>
                
                <h2 class="detail-title" style="font-size: var(--fs-h2); font-weight: 800; color: var(--color-white); margin-top: var(--space-xs);">${product.name}</h2>
                
                <div class="detail-divider" style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); margin: var(--space-md) 0;"></div>
                
                <div class="detail-desc-section">
                  <h3 class="detail-desc-title" style="font-size: var(--fs-small); font-weight: 600; text-transform: uppercase; color: var(--color-text-light); margin-bottom: 8px; letter-spacing: 0.05em;">Product Description</h3>
                  <p class="detail-description" style="color: var(--color-text-body); line-height: 1.6; font-size: var(--fs-body);">${product.description || 'Pending Verification'}</p>
                </div>
                
                <div class="detail-divider" style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%); margin: var(--space-md) 0;"></div>
                
                <div class="detail-meta-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-md);">
                  <div class="detail-meta-item" style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-size: var(--fs-xs); color: var(--color-text-light); text-transform: uppercase; font-weight: 500;">Composition / Ingredient</span>
                    <strong style="color: var(--color-white); font-weight: 600; font-size: var(--fs-small);">${product.composition || 'Pending Client Verification'}</strong>
                  </div>
                  <div class="detail-meta-item" style="display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-size: var(--fs-xs); color: var(--color-text-light); text-transform: uppercase; font-weight: 500;">Therapeutic Class</span>
                    <strong style="color: var(--color-white); font-weight: 600; font-size: var(--fs-small);">${product.therapeuticClass || 'Pending Client Verification'}</strong>
                  </div>
                  <div class="detail-meta-item" style="grid-column: span 2; display: flex; flex-direction: column; gap: 4px;">
                    <span style="font-size: var(--fs-xs); color: var(--color-text-light); text-transform: uppercase; font-weight: 500;">Form / Administration</span>
                    <strong style="color: var(--color-white); font-weight: 600; font-size: var(--fs-small);">${product.administration || 'Pending Client Verification'}</strong>
                  </div>
                </div>
                
                <div class="detail-actions" style="margin-top: var(--space-xl);">
                  <button class="btn btn--primary btn--lg" id="detail-inquire-btn" style="width: 100%; justify-content: center;">Inquire about this Product</button>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products Section -->
      <section class="section section--alt" id="related-products">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: var(--space-xl);">
            <span class="section-header__label" style="font-size: var(--fs-xs); text-transform: uppercase; color: var(--color-accent); font-weight: 700; letter-spacing: 0.05em; display: block; margin-bottom: var(--space-xs);">Explore More</span>
            <h2 class="section-header__title" style="font-size: var(--fs-h2); font-weight: 800; color: var(--color-white);">Related Products</h2>
          </div>
          <div class="grid grid--3" id="related-products-grid">
            <!-- Dynamic related products cards inserted here -->
          </div>
        </div>
      </section>

      <!-- Footer Placeholder -->
      <div id="footer-placeholder"></div>

      <!-- WhatsApp FAB Placeholder -->
      <div id="whatsapp-fab-placeholder"></div>

      <!-- Back to Top Placeholder -->
      <div id="back-to-top-placeholder"></div>

      <!-- Inquiry modal removed: product inquiry now redirects to Contact page -->
    `;
  }

  // --- Render Related Products Grid ---
  function renderRelatedProducts(product, products) {
    var grid = document.getElementById('related-products-grid');
    if (!grid) return;

    var related = products
      .filter(function (p) {
        return p.category === product.category && p.slug !== product.slug;
      })
      .slice(0, 3);

    var html = '';
    related.forEach(function (rel) {
      var relImageHtml = rel.imageHtml;
      if (rel.image === 'assets/images/placeholder.png' || !relImageHtml || relImageHtml.indexOf('<svg') !== -1) {
        relImageHtml = '<img src="../assets/images/placeholder.png" alt="' + rel.name + '" style="width: 100%; height: 100%; object-fit: cover;">';
      } else {
        relImageHtml = relImageHtml.replace(/src="assets\//g, 'src="../assets/');
      }

      // Link points to standard filename in local directory: rel.slug + '.html'
      html += `
        <a href="${rel.slug}.html" class="card product-card" data-category="${rel.category}">
          <div class="product-card__image" style="min-height: 200px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.01); overflow: hidden;">
            <span class="product-card__badge" style="z-index: 5;">${rel.categoryLabel}</span>
            ${relImageHtml}
          </div>
          <div class="product-card__body">
            <span class="product-card__category">${rel.categoryLabel}</span>
            <h3 class="product-card__title">${rel.name}</h3>
          </div>
        </a>`;
    });

    grid.innerHTML = html || '<p style="grid-column: span 3; text-align: center; color: var(--color-text-light); opacity: 0.6;">No related products found.</p>';
  }

  // --- Setup Page Interactivity and Event Listeners ---
  function setupInteractivity(product) {
    // 1. Scroll Effect on Navbar
    var navbar = document.querySelector('.navbar');
    if (navbar) {
      var onScroll = function () {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // 2. Mobile Menu Toggle
    var toggle = document.querySelector('.navbar__toggle');
    var links = document.querySelector('.navbar__links');
    if (toggle && links) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
      });

      links.querySelectorAll('.navbar__link').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          links.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // 3. Back To Top click handler
    var backBtn = document.querySelector('.back-to-top');
    if (backBtn) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 300) {
          backBtn.classList.add('visible');
        } else {
          backBtn.classList.remove('visible');
        }
      }, { passive: true });

      backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // 4. Product Inquiry: redirect to Contact page (no popup)
    var inquireBtn = document.getElementById('detail-inquire-btn');
    if (inquireBtn) {
      inquireBtn.addEventListener('click', function () {
        var subject = encodeURIComponent('Product Inquiry: ' + product.name);
        window.location.href = '../contact.html?subject=' + subject;
      });
    }

    // 5. Toast Message Helper
    function displayToast(message) {
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

    // (no modal form on product pages anymore)
  }

})();
