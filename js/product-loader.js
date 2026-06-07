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
      .catch(function () {
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
      window.productsData = window.productsData || [];
      callback();
    };
    document.head.appendChild(script);
  }

  // 3. Initialize & Populate Product Page
  function initProduct() {
    var products = window.productsData;
    if (!products) {
      return;
    }

    var product = products.find(function (p) {
      return p.slug === slug || p.id === slug;
    });

    if (!product) {
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

  function getProductImage(slug, category) {
    var p = window.productsData ? window.productsData.find(function(item) { return item.slug === slug; }) : null;
    return p && p.image ? '../' + p.image : '';
  }

  // --- Inject Dynamic SEO, Schema & Premium Head Assets ---
  function injectSEO(product) {
    document.title = product.metaTitle || (product.name + ' | Orion Pharma India');

    updateMeta('description', product.metaDescription);
    updateMetaProperty('og:title', product.metaTitle || product.name);
    updateMetaProperty('og:description', product.metaDescription);
    updateMetaProperty('og:url', product.canonicalUrl || window.location.href);

    var localImg = getProductImage(product.slug, product.category);
    if (localImg && localImg.indexOf('../') === 0) {
      localImg = localImg.substring(3);
    }
    var imageUrl = localImg 
      ? 'https://orionpharmaindia.org/' + localImg 
      : (product.image.startsWith('http') ? product.image : 'https://orionpharmaindia.org/' + product.image);

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

    // Dynamic Head injection for Premium Glassmorphism design (Tailwind, Fonts, Tailwind Config, custom styles)
    // Synchronously assign Tailwind configuration to window.tailwind to prevent any CDN race conditions
    window.tailwind = {
      darkMode: "class",
      config: {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
              "surface-variant": "#2f3444",
              "surface-container-highest": "#2f3444",
              "on-primary-fixed-variant": "#004e5f",
              "outline-variant": "#3c494e",
              "tertiary-fixed-dim": "#ffba3d",
              "surface-tint": "#3cd7ff",
              "surface": "#0d1321",
              "surface-bright": "#333949",
              "surface-container-high": "#242a39",
              "on-tertiary-fixed": "#281900",
              "on-surface": "#dde2f6",
              "surface-container": "#1a1f2e",
              "surface-dim": "#0d1321",
              "primary-fixed": "#b4ebff",
              "surface-container-lowest": "#080e1c",
              "error-container": "#93000a",
              "glow-cyan": "rgba(0, 212, 255, 0.4)",
              "primary": "#a8e8ff",
              "surface-glass": "rgba(15, 23, 42, 0.6)",
              "border-glass": "rgba(255, 255, 255, 0.15)",
              "on-secondary-fixed-variant": "#00429a",
              "primary-fixed-dim": "#3cd7ff",
              "on-error": "#690005",
              "secondary-fixed-dim": "#afc6ff",
              "primary-container": "#00d4ff",
              "on-error-container": "#ffdad6",
              "tertiary": "#ffd9a1",
              "on-primary-fixed": "#001f27",
              "tertiary-fixed": "#ffdeae",
              "deep-navy": "#050a18",
              "inverse-primary": "#00677e",
              "background": "#0d1321",
              "inverse-on-surface": "#2b3040",
              "secondary": "#afc6ff",
              "on-background": "#dde2f6",
              "secondary-fixed": "#d9e2ff",
              "outline": "#859398",
              "secondary-container": "#548dff",
              "on-tertiary-fixed-variant": "#604100",
              "on-tertiary-container": "#6c4900",
              "tertiary-container": "#feb528",
              "error": "#ffb4ab",
              "on-secondary-container": "#002760",
              "on-secondary-fixed": "#001944",
              "surface-container-low": "#161b2a",
              "on-tertiary": "#432c00",
              "on-surface-variant": "#bbc9cf",
              "on-secondary": "#002d6d",
              "on-primary": "#003642",
              "on-primary-container": "#00586b",
              "inverse-surface": "#dde2f6"
            },
            "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
            },
            "spacing": {
              "gutter": "24px",
              "margin-mobile": "20px",
              "container-max": "1280px",
              "margin-desktop": "64px",
              "unit": "8px"
            },
            "fontFamily": {
              "headline-md": ["Inter"],
              "label-sm": ["Inter"],
              "display-lg": ["Inter"],
              "display-lg-mobile": ["Inter"],
              "label-md": ["Inter"],
              "body-md": ["Inter"],
              "body-lg": ["Inter"],
              "headline-lg": ["Inter"]
            },
            "fontSize": {
              "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
              "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "500"}],
              "display-lg": ["64px", {"lineHeight": "72px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "display-lg-mobile": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.05em", "fontWeight": "500"}],
              "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
              "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
              "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
            }
          }
        }
      }
    };

    if (!document.getElementById('tailwind-cdn-script')) {
      var twScript = document.createElement('script');
      twScript.id = 'tailwind-cdn-script';
      twScript.src = 'https://cdn.tailwindcss.com?plugins=forms,container-queries';
      document.head.appendChild(twScript);
    }

    if (!document.getElementById('google-fonts-inter')) {
      var fontsLink = document.createElement('link');
      fontsLink.id = 'google-fonts-inter';
      fontsLink.rel = 'stylesheet';
      fontsLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
      document.head.appendChild(fontsLink);
    }

    if (!document.getElementById('google-fonts-material')) {
      var matLink = document.createElement('link');
      matLink.id = 'google-fonts-material';
      matLink.rel = 'stylesheet';
      matLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
      document.head.appendChild(matLink);
    }

    if (!document.getElementById('mockup-styles')) {
      var customStyles = document.createElement('style');
      customStyles.id = 'mockup-styles';
      customStyles.textContent = `
        html, body {
            background-color: #050a18 !important;
            background-image: none !important;
            color: #dde2f6 !important;
            overflow-x: hidden;
            max-width: 100%;
            font-family: 'Inter', sans-serif;
            scrollbar-gutter: stable;
        }

        /* Safeguard for background glows causing horizontal scroll */
        .fixed.inset-0.overflow-hidden {
            max-width: 100vw !important;
            overflow: hidden !important;
        }

        .glass-card {
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(24px);
            border: 1px solid transparent;
            background-clip: padding-box;
            position: relative;
        }

        .glass-card::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,212,255,0.4) 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }

        .glow-button {
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
            transition: all 0.3s ease;
        }

        .glow-button:hover {
            box-shadow: 0 0 25px rgba(0, 212, 255, 0.6);
            transform: translateY(-1px);
        }

        .primary-gradient-btn {
            background: linear-gradient(135deg, #00d4ff 0%, #a8e8ff 100%) !important;
            box-shadow: 0 0 15px rgba(0, 212, 255, 0.4) !important;
            transition: all 0.3s ease;
        }

        .primary-gradient-btn:hover {
            box-shadow: 0 0 25px rgba(0, 212, 255, 0.6) !important;
            transform: translateY(-1px);
        }

        .shifting-glow {
            transition: transform 4s ease-in-out, filter 4s ease-in-out;
        }

        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }

        details summary::-webkit-details-marker {
            display: none;
        }

        /* =========================================
           PRODUCT DETAIL PAGES — MOBILE RESPONSIVE
           ========================================= */

        /* Reduce top padding on mobile so content isn't buried below navbar */
        @media (max-width: 768px) {
            main.pt-32 {
                padding-top: 5rem !important; /* 80px — just enough to clear the 72px navbar */
            }

            /* Product detail hero: image stacks on top, text below */
            .grid.grid-cols-1.lg\\:grid-cols-2.gap-16 {
                gap: 1.5rem !important;
            }

            /* Product image card — limit height on mobile */
            .glass-card.rounded-2xl.aspect-\\[4\\/3\\] {
                aspect-ratio: 4/3;
                max-height: 260px;
            }

            /* Reduce section card padding from p-10 to p-5 on mobile */
            .glass-card.p-10 {
                padding: 1.25rem !important;
            }

            .glass-card.p-8 {
                padding: 1rem !important;
            }

            /* Standard Dosage / Purity Level — 2 compact inline badges, not full-height cards */
            .grid.grid-cols-2.gap-4.self-start {
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem !important;
            }

            .grid.grid-cols-2.gap-4.self-start > div {
                padding: 0.75rem !important;
                gap: 0.5rem !important;
            }

            .grid.grid-cols-2.gap-4.self-start .text-primary.font-bold {
                font-size: 0.9375rem !important;
            }

            .grid.grid-cols-2.gap-4.self-start .text-on-surface-variant {
                font-size: 0.6875rem !important;
            }

            /* Stack Product Overview 2-col grid to 1-col on mobile */
            .grid.md\\:grid-cols-2.gap-12.items-start {
                grid-template-columns: 1fr !important;
                gap: 1.25rem !important;
            }

            /* Clinical data bullets: 1-col on mobile */
            .grid.md\\:grid-cols-3.gap-6 {
                grid-template-columns: 1fr !important;
                gap: 0.75rem !important;
            }

            /* Technical specs table: scrollable wrapper */
            .max-w-3xl.mx-auto.overflow-hidden.rounded-2xl {
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch;
            }

            /* Storage & Safety: stack 2 cards to 1-col on mobile */
            .grid.md\\:grid-cols-2.gap-gutter {
                grid-template-columns: 1fr !important;
                gap: 1rem !important;
            }

            /* Related products: 2-col on mobile */
            #related-products-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0.75rem !important;
            }

            /* Hero section heading font */
            h1.font-display-lg {
                font-size: clamp(1.6rem, 6vw, 2.25rem) !important;
                line-height: 1.2 !important;
            }

            /* CTA button: full-width on mobile */
            button[data-modal-trigger].primary-gradient-btn,
            a[data-modal-trigger].primary-gradient-btn {
                width: 100% !important;
                justify-content: center !important;
            }

            /* Contact modal: full-screen on mobile */
            #contact-modal > div {
                border-radius: 1rem !important;
                max-height: 92vh !important;
                overflow-y: auto !important;
                padding: 1.25rem !important;
            }

            /* Form: single column on mobile */
            #contact-modal .grid.grid-cols-1.md\\:grid-cols-2 {
                grid-template-columns: 1fr !important;
            }
        }

        @media (max-width: 480px) {
            main.pt-32 {
                padding-top: 4.5rem !important;
            }

            .glass-card.p-10 {
                padding: 1rem !important;
            }

            .glass-card.p-8 {
                padding: 0.875rem !important;
            }

            h1.font-display-lg {
                font-size: clamp(1.4rem, 7vw, 1.85rem) !important;
            }

            /* Keep 2-col related products even on very small screens */
            #related-products-grid {
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 0.5rem !important;
            }
        }
      `;
      document.head.appendChild(customStyles);
    }

    document.documentElement.classList.add('dark');
    document.body.className = 'dark selection:bg-primary/30';
  }

  // --- Helpers for Formatting names and strengths ---
  function formatTitleCase(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(function(word) {
      if (word === 'hp' || word === 'pfs' || word === 'vial' || word === 'inj' || word === 'cap' || word === 'iu') {
        return word.toUpperCase();
      }
      if (/^\d+(iu|mg|g)$/.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  function parseStrength(name) {
    var match = name.match(/(\d+)/);
    if (match) {
      var num = match[1];
      if (name.toLowerCase().indexOf('inj') !== -1 || name.toLowerCase().indexOf('cap') !== -1 || name.toLowerCase().indexOf('tab') !== -1 || name.toLowerCase().indexOf('gel') !== -1) {
        if (name.toLowerCase().indexOf('humog') !== -1 || name.toLowerCase().indexOf('menopur') !== -1) {
          return num + ' IU';
        }
        return num + ' mg';
      }
      return num + ' IU';
    }
    return 'Standard';
  }

  // --- Render Responsive Premium HTML Layout ---
  function renderLayout(product) {
    var shell = document.getElementById('product-page-shell');
    if (!shell) return;

    var imageUrl = getProductImage(product.slug, product.category);
    if (!imageUrl) {
      imageUrl = product.image.startsWith('http') ? product.image : '../' + product.image;
    }

    var categoryBadge = "";
    if (product.category === 'fertility') {
      categoryBadge = "Precision Reproductive Health";
    } else if (product.category === 'hormonal') {
      categoryBadge = "Advanced Hormonal Therapy";
    } else {
      categoryBadge = "Specialized Clinical Medicine";
    }

    var titleCasedName = formatTitleCase(product.name);
    var strengthVal = parseStrength(product.name);

    var card1Value, card1Label, card1Icon;
    if (strengthVal === 'Standard') {
      card1Value = product.administration;
      card1Label = 'Administration';
      card1Icon = 'vaccines';
    } else {
      card1Value = strengthVal;
      card1Label = 'Standard Dosage';
      card1Icon = 'medication';
    }

    var isHP = product.name.indexOf('HP') !== -1 || 
               (product.composition && product.composition.toLowerCase().indexOf('recombinant') !== -1) || 
               (product.composition && product.composition.toLowerCase().indexOf('highly purified') !== -1);
    var card2Value = isHP ? '99.8%' : 'Premium';
    var card2Label = isHP ? 'Purity Level' : 'Clinical Grade';
    var card2Icon = isHP ? 'science' : 'workspace_premium';

    var clinicalHeading = "View Clinical Efficacy & Clinical Data";
    var clinicalParagraph = "";
    var clinicalBullets = [];

    if (product.category === 'fertility') {
      clinicalParagraph = "Clinical trial results (Phase III) demonstrate a significant increase in the follicular growth index and predictable ovarian response compared to conventional treatments over stimulation cycles.";
      clinicalBullets = [
        "High Oocyte Yield",
        "Predictable Response",
        "Superior Tolerability"
      ];
    } else if (product.category === 'hormonal') {
      clinicalParagraph = "Clinical profiles confirm bio-equivalence and sustained release pharmacokinetics, ensuring consistent therapeutic hormone levels with reduced dosage frequency and improved tolerability.";
      clinicalBullets = [
        "Stabilized Delivery",
        "Targeted Efficacy",
        "High Compliance"
      ];
    } else {
      clinicalParagraph = "Bio-availability trials and clinical evaluations demonstrate high therapeutic precision, rapid onset of action, and excellent safety profiles under specialized medical protocols.";
      clinicalBullets = [
        "Rapid Bio-availability",
        "Therapeutic Precision",
        "Proven Safety Record"
      ];
    }

    var specsHtml = `
      <tr class="hover:bg-white/5 transition-colors"><td class="p-4 border-b border-border-glass font-medium text-on-surface">Active Agent</td><td class="p-4 border-b border-border-glass">${product.composition || 'As specified'}</td></tr>
      <tr class="hover:bg-white/5 transition-colors"><td class="p-4 border-b border-border-glass font-medium text-on-surface">Concentration</td><td class="p-4 border-b border-border-glass">${strengthVal !== 'Standard' ? strengthVal : 'Refer to prescribing info'}</td></tr>
      <tr class="hover:bg-white/5 transition-colors"><td class="p-4 border-b border-border-glass font-medium text-on-surface">Administration</td><td class="p-4 border-b border-border-glass">${product.administration || 'As prescribed'}</td></tr>
      <tr class="hover:bg-white/5 transition-colors"><td class="p-4 border-b border-border-glass font-medium text-on-surface">Therapeutic Class</td><td class="p-4 border-b border-border-glass">${product.therapeuticClass || 'Pharmaceutical'}</td></tr>
      <tr class="hover:bg-white/5 transition-colors"><td class="p-4 font-medium text-on-surface">Shelf Life</td><td class="p-4">24 Months (Unopened)</td></tr>
    `;

    var storageTemp = "Store below 25°C";
    var storageDesc = "Store in a cool, dry place. Keep out of reach of children. Protect from direct sunlight.";
    
    var isColdChain = product.category === 'fertility' || 
                      product.name.indexOf('HP') !== -1 || 
                      product.administration.toLowerCase().indexOf('syringe') !== -1 ||
                      product.administration.toLowerCase().indexOf('injection') !== -1 ||
                      product.administration.toLowerCase().indexOf('pen') !== -1;
                      
    if (isColdChain) {
      storageTemp = "2°C to 8°C";
      storageDesc = "Do not freeze. Keep the vial in the outer carton to protect from light. Once opened, use within 28 days if stored correctly.";
    }

    var safetyDesc = "";
    if (product.category === 'fertility') {
      safetyDesc = "Contraindicated in cases of hypersensitivity, primary ovarian failure, or pituitary tumors. Use under specialist medical supervision.";
    } else if (product.category === 'hormonal') {
      safetyDesc = "Contraindicated in patients with active thromboembolic disorders, undiagnosed vaginal bleeding, or hormone-dependent malignancies.";
    } else {
      safetyDesc = "Contraindicated in patients with known hypersensitivity to any of the active ingredients. Consult a physician before use.";
    }

    shell.innerHTML = `
      <!-- TopNavBar Placeholders -->
      <div id="navbar-placeholder"></div>

      <!-- Shifting Ambient Background Glow -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div id="bg-glow-1" class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#00d4ff] rounded-full blur-[110px] opacity-35 shifting-glow"></div>
        <div id="bg-glow-2" class="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[#548dff] rounded-full blur-[110px] opacity-30 shifting-glow"></div>
      </div>

      <main class="pt-20 md:pt-32 pb-20 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto relative">
        <!-- Hero Section -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <!-- Product Image -->
          <div class="relative group">
            <div class="absolute inset-0 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-all duration-700"></div>
            <div class="glass-card rounded-2xl p-0 relative z-10 aspect-[4/3] w-full flex items-center justify-center overflow-hidden border border-white/10 shadow-2xl">
              <img src="${imageUrl}" alt="${titleCasedName}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"/>
            </div>
          </div>
          <!-- Key Details -->
          <div class="space-y-8">
            <div>
              <span class="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-label-sm mb-6">
                ${categoryBadge}
              </span>
              <h1 class="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6 leading-tight">
                ${titleCasedName}
              </h1>
              <p class="font-headline-md text-headline-md text-primary/80 mb-8">${product.composition}</p>
              <p class="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                ${product.description}
              </p>
            </div>
            <div class="flex flex-wrap gap-4">
              <button data-modal-trigger data-subject="Quote Request: ${titleCasedName}" class="primary-gradient-btn text-on-primary-fixed-variant font-bold font-label-md text-label-md px-8 py-4 rounded-xl flex items-center gap-2">
                <span class="material-symbols-outlined">mail</span>
                Request Quote
              </button>
            </div>
          </div>
        </section>

        <!-- Product Overview -->
        <section class="mb-16">
          <div class="glass-card p-10 rounded-3xl">
            <h2 class="font-headline-lg text-headline-lg text-primary mb-6">Product Overview</h2>
            <div class="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 class="font-headline-md text-on-surface mb-4">Therapeutic Focus</h3>
                <p class="text-on-surface-variant font-body-md leading-relaxed">
                  ${product.description}
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4 self-start">
                <div class="bg-white/5 p-5 rounded-2xl border border-border-glass flex flex-col gap-3 hover:bg-white/10 transition-all duration-300">
                  <span class="material-symbols-outlined text-primary text-[28px]">${card1Icon}</span>
                  <div>
                    <p class="text-primary font-bold text-[18px] leading-tight">${card1Value}</p>
                    <p class="text-on-surface-variant text-[12px] font-medium mt-1">${card1Label}</p>
                  </div>
                </div>
                <div class="bg-white/5 p-5 rounded-2xl border border-border-glass flex flex-col gap-3 hover:bg-white/10 transition-all duration-300">
                  <span class="material-symbols-outlined text-primary text-[28px]">${card2Icon}</span>
                  <div>
                    <p class="text-primary font-bold text-[18px] leading-tight">${card2Value}</p>
                    <p class="text-on-surface-variant text-[12px] font-medium mt-1">${card2Label}</p>
                  </div>
                </div>
              </div>
            </div>
            <!-- Collapsible Clinical Data -->
            <details class="mt-12 group">
              <summary class="flex items-center justify-between cursor-pointer list-none border-t border-border-glass pt-6">
                <span class="font-headline-md text-on-surface flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">analytics</span>
                  ${clinicalHeading}
                </span>
                <span class="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">expand_more</span>
              </summary>
              <div class="mt-8 space-y-6">
                <div class="bg-white/5 p-8 rounded-2xl border border-border-glass">
                  <p class="text-on-surface-variant mb-4">${clinicalParagraph}</p>
                  <ul class="grid md:grid-cols-3 gap-6 text-on-surface text-label-md">
                    ${clinicalBullets.map(function(b) {
                      return `<li class="flex items-center gap-3"><span class="w-2 h-2 rounded-full bg-primary"></span> ${b}</li>`;
                    }).join('')}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </section>

        <!-- Technical Specifications -->
        <section class="mb-16">
          <div class="glass-card p-10 rounded-3xl">
            <h2 class="font-headline-lg text-headline-lg text-primary mb-8 text-center">Technical Specifications</h2>
            <div class="max-w-3xl mx-auto overflow-hidden rounded-2xl border border-border-glass">
              <table class="w-full text-left">
                <thead class="bg-white/10 text-on-surface font-label-md">
                  <tr>
                    <th class="p-4 border-b border-border-glass">Feature</th>
                    <th class="p-4 border-b border-border-glass">Detail</th>
                  </tr>
                </thead>
                <tbody class="text-on-surface-variant font-body-md">
                  ${specsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Storage & Safety Sections -->
        <section class="grid md:grid-cols-2 gap-gutter mb-20">
          <!-- Storage & Handling -->
          <div class="glass-card p-8 rounded-3xl">
            <h3 class="font-headline-md text-primary mb-6 flex items-center gap-3">
              <span class="material-symbols-outlined">ac_unit</span>
              Storage &amp; Handling
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-border-glass">
                <span class="text-on-surface font-medium">Temperature</span>
                <span class="text-primary">${storageTemp}</span>
              </div>
              <p class="text-on-surface-variant text-label-md px-2">${storageDesc}</p>
            </div>
          </div>
          <!-- Safety Profile -->
          <div class="glass-card p-8 rounded-3xl border-l-4 border-l-error">
            <h3 class="font-headline-md text-on-surface mb-6 flex items-center gap-3">
              <span class="material-symbols-outlined text-error">warning</span>
              Safety &amp; Compliance
            </h3>
            <p class="text-on-surface-variant text-body-md mb-4 leading-relaxed">
              ${safetyDesc}
            </p>
            <button data-modal-trigger data-subject="Prescribing Info Request: ${titleCasedName}" class="text-primary hover:underline text-label-md flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer text-left">
              Full Prescribing Info <span class="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>
        </section>

        <!-- Related Products Section -->
        <section id="related-products" class="mb-16">
          <div class="section-header text-center mb-10">
            <span class="text-primary font-label-sm text-[12px] uppercase tracking-wider mb-2 block">Explore More</span>
            <h2 class="font-headline-lg text-headline-lg text-on-surface">Related Products</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8" id="related-products-grid">
            <!-- Dynamic related products cards inserted here -->
          </div>
        </section>
      </main>

      <!-- Footer Placeholders -->
      <div id="footer-placeholder"></div>
      <div id="whatsapp-fab-placeholder"></div>
      <div id="back-to-top-placeholder"></div>

      <!-- Contact Modal -->
      <div id="contact-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-deep-navy/80 backdrop-blur-md">
        <div class="glass-card w-full max-w-2xl rounded-[32px] p-6 md:p-8 relative border border-white/20 shadow-2xl">
          <button id="modal-close" class="absolute top-6 right-6 text-on-surface hover:text-white transition-colors text-2xl focus:outline-none" aria-label="Close modal">&times;</button>
          <div class="space-y-6">
            <div class="text-center md:text-left">
              <h3 class="text-headline-lg font-headline-lg text-white">Get in Touch</h3>
              <p class="text-body-md text-on-surface-variant mt-1">Connect with Orion Pharma instantly for inquiries or support.</p>
            </div>
            <form id="modal-contact-form" class="space-y-4" novalidate>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="modal-name" class="block text-label-md font-bold text-white">Full Name *</label>
                  <input type="text" id="modal-name" required placeholder="John Doe" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"/>
                  <span class="text-error text-[12px] hidden" id="error-name">Please enter your name</span>
                </div>
                <div class="space-y-2">
                  <label for="modal-email" class="block text-label-md font-bold text-white">Email Address *</label>
                  <input type="email" id="modal-email" required placeholder="john@example.com" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"/>
                  <span class="text-error text-[12px] hidden" id="error-email">Please enter a valid email address</span>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="modal-phone" class="block text-label-md font-bold text-white">Phone Number *</label>
                  <input type="tel" id="modal-phone" required placeholder="+91 XXXXX XXXXX" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"/>
                  <span class="text-error text-[12px] hidden" id="error-phone">Please enter a valid phone number</span>
                </div>
                <div class="space-y-2">
                  <label for="modal-subject" class="block text-label-md font-bold text-white">Subject *</label>
                  <input type="text" id="modal-subject" required placeholder="General Inquiry" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"/>
                  <span class="text-error text-[12px] hidden" id="error-subject">Please enter a subject</span>
                </div>
              </div>
              <div class="space-y-2">
                <label for="modal-message" class="block text-label-md font-bold text-white">Your Message *</label>
                <textarea id="modal-message" required placeholder="Describe your inquiry in detail..." rows="4" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"></textarea>
                <span class="text-error text-[12px] hidden" id="error-message">Please enter your message</span>
              </div>
              <button type="submit" class="w-full primary-gradient-btn py-3 rounded-xl text-body-md font-bold text-on-primary-fixed-variant transition-all mt-4">
                Send Message
              </button>
            </form>
          </div>
      </div>
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
      var relImageUrl = getProductImage(rel.slug, rel.category);
      if (!relImageUrl) {
        relImageUrl = rel.image.startsWith('http') ? rel.image : '../' + rel.image;
      }
      var relTitleCased = formatTitleCase(rel.name);

      html += `
        <a href="${rel.slug}.html" class="glass-card rounded-2xl p-4 relative z-10 flex flex-col hover:scale-[1.02] transition-transform duration-300 group">
          <div class="aspect-[4/3] flex items-center justify-center overflow-hidden bg-white/5 rounded-xl border border-border-glass mb-4 p-0 relative">
            <div class="absolute inset-0 bg-primary/5 blur-[30px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img src="${relImageUrl}" alt="${relTitleCased}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          </div>
          <span class="text-primary font-label-sm text-[11px] uppercase tracking-wider mb-1 block">${rel.categoryLabel}</span>
          <h3 class="text-on-surface font-headline-md text-[16px] font-bold line-clamp-1 mb-1">${relTitleCased}</h3>
          <p class="text-on-surface-variant text-[13px] line-clamp-2 leading-relaxed mb-2">${rel.composition}</p>
        </a>`;
    });

    grid.innerHTML = html || '<p style="grid-column: span 3; text-align: center; color: var(--color-text-light); opacity: 0.6;">No related products found.</p>';
  }

  // --- Setup Page Interactivity and Event Listeners ---
  function setupInteractivity(product) {
    // 1. Scroll Effect on Navbar
    window.addEventListener('scroll', function () {
      var nav = document.querySelector('nav') || document.querySelector('.navbar');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('py-2', 'shadow-2xl', 'bg-surface/90', 'scrolled');
          nav.classList.remove('py-4');
        } else {
          nav.classList.add('py-4');
          nav.classList.remove('py-2', 'shadow-2xl', 'bg-surface/90', 'scrolled');
        }
      }
    }, { passive: true });

    // 2. Custom subject binding for modal triggers on this page
    document.querySelectorAll('[data-modal-trigger]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var customSubject = btn.getAttribute('data-subject');
        if (customSubject) {
          setTimeout(function () {
            var subjectInput = document.getElementById('modal-subject');
            if (subjectInput) {
              subjectInput.value = customSubject;
            }
          }, 50);
        }
      });
    });

    // 3. Intersection Observer for Entry Animations on Glass Cards
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.remove('opacity-0', 'translate-y-4');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.glass-card').forEach(function (card) {
        card.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700', 'ease-out');
        observer.observe(card);
      });
    } else {
      document.querySelectorAll('.glass-card').forEach(function (card) {
        card.style.opacity = '1';
        card.style.transform = 'none';
      });
    }

    // 4. Modal Close listeners
    var contactModal = document.getElementById('contact-modal');
    var modalClose = document.getElementById('modal-close');
    var modalForm = document.getElementById('modal-contact-form');

    if (modalClose && contactModal) {
      modalClose.addEventListener('click', function () {
        contactModal.classList.add('hidden');
        document.body.style.overflow = '';
      });

      contactModal.addEventListener('click', function (e) {
        if (e.target === contactModal) {
          contactModal.classList.add('hidden');
          document.body.style.overflow = '';
        }
      });
    }

    // 5. Modal Form submission and validation logic
    if (modalForm) {
      modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var isValid = true;
        
        var name = document.getElementById('modal-name');
        var email = document.getElementById('modal-email');
        var phone = document.getElementById('modal-phone');
        var subject = document.getElementById('modal-subject');
        var message = document.getElementById('modal-message');

        function checkField(el, errorElId, validationFn) {
          if (!el) return;
          var val = el.value.trim();
          var errorEl = document.getElementById(errorElId);
          if (!val || (validationFn && !validationFn(val))) {
            if (errorEl) errorEl.classList.remove('hidden');
            el.classList.add('border-error');
            isValid = false;
          } else {
            if (errorEl) errorEl.classList.add('hidden');
            el.classList.remove('border-error');
          }
        }

        checkField(name, 'error-name');
        checkField(email, 'error-email', function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        });
        checkField(phone, 'error-phone', function (v) {
          return /^[\d\s+\-()]{7,20}$/.test(v);
        });
        checkField(subject, 'error-subject');
        checkField(message, 'error-message');

        if (isValid) {
          showToast('Thank you! Your message has been sent successfully.');
          modalForm.reset();
          if (contactModal) {
            contactModal.classList.add('hidden');
            document.body.style.overflow = '';
          }
        }
      });
    }

    // Clear validation styling when user types
    if (modalForm) {
      modalForm.querySelectorAll('input, textarea').forEach(function (el) {
        el.addEventListener('input', function () {
          el.classList.remove('border-error');
          var errId = 'error-' + el.id.replace('modal-', '');
          var errEl = document.getElementById(errId);
          if (errEl) errEl.classList.add('hidden');
        });
      });
    }

    // Shifting background glow logic
    var glow1 = document.getElementById('bg-glow-1');
    var glow2 = document.getElementById('bg-glow-2');

    function moveGlow(element) {
      if (!element) return;
      var maxX = window.innerWidth * 0.5;
      var maxY = window.innerHeight * 0.5;
      var x = (Math.random() - 0.5) * maxX;
      var y = (Math.random() - 0.5) * maxY;
      var scale = 0.8 + Math.random() * 0.5;
      var hue = Math.floor(Math.random() * 360);
      
      element.style.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + scale + ')';
      element.style.filter = 'hue-rotate(' + hue + 'deg) blur(110px)';
    }

    if (glow1 && glow2) {
      moveGlow(glow1);
      moveGlow(glow2);
      
      setInterval(function () { moveGlow(glow1); }, 4000);
      setInterval(function () { moveGlow(glow2); }, 5000);
    }

    // Toast helper
    function showToast(msg) {
      var existing = document.querySelector('.custom-toast');
      if (existing) existing.remove();

      var toast = document.createElement('div');
      toast.className = 'custom-toast fixed bottom-6 left-6 z-50 glass-card px-6 py-4 rounded-2xl border border-primary/30 text-white shadow-2xl transition-all duration-300 opacity-0 translate-y-4 flex items-center gap-2';
      toast.innerHTML = `
        <span class="material-symbols-outlined text-primary">check_circle</span>
        <span class="text-body-md font-medium">${msg}</span>
      `;
      document.body.appendChild(toast);

      requestAnimationFrame(function () {
        toast.classList.remove('opacity-0', 'translate-y-4');
      });

      setTimeout(function () {
        toast.classList.add('opacity-0', 'translate-y-4');
        setTimeout(function () { toast.remove(); }, 300);
      }, 4000);
    }
  }

})();

