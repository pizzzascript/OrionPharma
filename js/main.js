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
    initBackToTop();
    initFooterYear();
    initContactModalTriggers();
    initContactForm();
    initProductSearch();
    initCategoryFilter();
    
    // Call filterProducts on load if we are on the products catalog page
    if (document.getElementById('product-search')) {
      filterProducts();
      initProductDetailOverlay();
    }
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
  // PRODUCT SEARCH
  // =========================================
  var activePage = 1;
  var itemsPerPage = 9;

  // =========================================
  // PRODUCT DESCRIPTIONS DATABASE & GENERATOR
  // =========================================
  var productDescriptions = {
    "foligraf 1200 vial": {
      ingredient: "Recombinant Human Follicle Stimulating Hormone (r-FSH)",
      class: "Gonadotropin / Follicle Stimulating Hormone",
      form: "Freeze-dried Powder for Injection (Vial)",
      description: "Foligraf 1200 IU contains highly purified recombinant human Follicle Stimulating Hormone (r-FSH) produced by recombinant DNA technology. It is a critical hormone indicated in females for controlled ovarian stimulation and the development of multiple follicles in assisted reproduction cycles (like IVF and ICSI), and in males to stimulate spermatogenesis."
    },
    "foligraf 900 pen": {
      ingredient: "Recombinant Human Follicle Stimulating Hormone (r-FSH)",
      class: "Gonadotropin / Follicle Stimulating Hormone",
      form: "Prefilled Pen Injector Device",
      description: "Foligraf 900 IU Pen provides recombinant human FSH in a highly precise, multidose pen delivery system. Designed for ease of self-administration, it allows patients to dial exact prescribed dosages in micro-increments, significantly reducing dosing errors and improving comfort during assisted reproductive cycles."
    },
    "rhucog 6500 pfs": {
      ingredient: "Recombinant Human Chorionic Gonadotropin (r-hCG)",
      class: "Gonadotropin / Ovulation Stimulator",
      form: "Pre-filled Syringe (PFS)",
      description: "Rhucog 6500 IU is a recombinant human Chorionic Gonadotropin (choriogonadotropin alfa) supplied in a pre-filled, sterile syringe. It is administered to mimic the natural luteinizing hormone (LH) surge, triggering final follicular maturation, rupture, and corpus luteum formation in women undergoing controlled ovarian hyperstimulation."
    },
    "asporelix 0.25 vial": {
      ingredient: "Cetrorelix Acetate",
      class: "GnRH Receptor Antagonist",
      form: "Lyophilized Powder for Injection (Vial)",
      description: "Asporelix 0.25 mg contains Cetrorelix Acetate, a synthetic decapeptide with gonadotropin-releasing hormone (GnRH) antagonistic activity. It binds competitively to pituitary GnRH receptors, preventing premature ovulation and luteinization during controlled ovarian hyperstimulation, ensuring eggs are retrieved at the optimal time."
    },
    "lonopin 40 pfs": {
      ingredient: "Enoxaparin Sodium",
      class: "Anticoagulant / Low Molecular Weight Heparin (LMWH)",
      form: "Pre-filled Syringe (PFS)",
      description: "Lonopin 40 mg is a premium Enoxaparin Sodium formulation supplied in a pre-filled syringe (0.4 ml). It is a low molecular weight heparin (LMWH) possessing high anti-Factor Xa activity relative to anti-Factor IIa activity. It is indicated for the prophylaxis and treatment of deep vein thrombosis (DVT), pulmonary embolism, and systemic coagulation prevention during hemodialysis."
    },
    "humog hp 75 vial": {
      ingredient: "Highly Purified Menotrophin (hMG)",
      class: "Gonadotropin / Menopausal Gonadotropin",
      form: "Freeze-dried Powder for Injection (Vial)",
      description: "Humog HP 75 IU is a highly purified Menotrophin (Human Menopausal Gonadotropin or hMG) injection containing follicle-stimulating hormone (FSH) and luteinizing hormone (LH) extracted from postmenopausal urine. It is indicated for the treatment of female infertility by inducing follicular development, and for male hypogonadotropic hypogonadism to stimulate spermatogenesis."
    },
    "puretrig 5000 hp vial": {
      ingredient: "Highly Purified Human Chorionic Gonadotropin (hCG)",
      class: "Gonadotropin / Luteinizing Hormone Analog",
      form: "Powder for Injection (Vial)",
      description: "Puretrig 5000 HP is a highly purified preparation of human Chorionic Gonadotropin (hCG) sourced from postmenopausal pregnancy urine. It acts as an analog to luteinizing hormone (LH), triggering final oocyte maturation and ovulation in females, and supporting testosterone synthesis in males."
    },
    "folliculin hp 150": {
      ingredient: "Highly Purified Urofollitropin (HP-FSH)",
      class: "Gonadotropin / Follicle Stimulating Hormone",
      form: "Powder for Injection (Vial)",
      description: "Folliculin HP 150 IU contains highly purified follicle-stimulating hormone (Urofollitropin) extracted from human urine. It is formulated to contain negligible LH activity, and is widely indicated for inducing ovulation in patients with polycystic ovarian syndrome (PCOS) or undergoing IVF protocols."
    }
  };

  // Helper function to dynamically generate a description based on name and category if it doesn't exist in the database
  function getProductDetails(name, category) {
    var key = name.trim().toLowerCase();
    
    // Check if we have exact match
    if (productDescriptions[key]) {
      return productDescriptions[key];
    }
    
    // Inferred details based on name and category
    var details = {
      ingredient: "Pharmaceutical Active Ingredient",
      class: "Therapeutic Agent",
      form: "Liquid Vial / PFS / Tablet",
      description: ""
    };
    
    // Infer ingredient and class based on keywords
    if (key.indexOf('foli') !== -1 || key.indexOf('graf') !== -1 || key.indexOf('surge') !== -1) {
      details.ingredient = "Urofollitropin / Recombinant FSH";
      details.class = "Fertility Regulator / Follicle Stimulating Hormone";
      details.form = key.indexOf('pen') !== -1 ? "Pen Injector" : (key.indexOf('pfs') !== -1 ? "Pre-filled Syringe" : "Vial Injection");
      details.description = name + " is an advanced fertility formulation of follicle-stimulating hormone (FSH). It is indicated for stimulating follicle development in the ovaries as part of ovulation induction or assisted reproductive technology (ART) protocols like IVF.";
    } else if (key.indexOf('trig') !== -1 || key.indexOf('hcg') !== -1 || key.indexOf('rhucog') !== -1) {
      details.ingredient = "Human Chorionic Gonadotropin (hCG)";
      details.class = "Ovulation Stimulator / Gonadotropin";
      details.form = key.indexOf('pfs') !== -1 ? "Pre-filled Syringe" : "Powder Vial with Solvent";
      details.description = name + " is a highly purified Chorionic Gonadotropin formulation. It functions as an LH analog, promoting egg release from mature follicles and supporting corpus luteum development. It is also used to address low testosterone in males.";
    } else if (key.indexOf('hmg') !== -1 || key.indexOf('humog') !== -1 || key.indexOf('menotas') !== -1 || key.indexOf('menopur') !== -1 || key.indexOf('eugon') !== -1 || key.indexOf('zyhmg') !== -1) {
      details.ingredient = "Highly Purified Menotrophin (hMG)";
      details.class = "Hormonal / Gonadotropin Stimulator";
      details.form = "Powder Vial for Injection";
      details.description = name + " is a highly purified Menotrophin (HMG) supplying equal parts of Follicle-Stimulating Hormone (FSH) and Luteinizing Hormone (LH). It is used to stimulate ovarian follicle maturation in infertile women, as well as hormone therapy in males.";
    } else if (key.indexOf('relix') !== -1 || key.indexOf('cetro') !== -1 || key.indexOf('cure') !== -1) {
      details.ingredient = "Cetrorelix Acetate or GnRH Antagonist";
      details.class = "GnRH Antagonist / Ovulation Preventative";
      details.form = key.indexOf('pfs') !== -1 ? "Pre-filled Syringe" : "Combi-pack Vial";
      details.description = name + " contains a GnRH receptor antagonist that suppresses premature luteinizing hormone (LH) surges. This regulates the ovarian cycle during controlled stimulation, allowing follicles to mature uniformly for collection.";
    } else if (key.indexOf('pin') !== -1 || key.indexOf('parin') !== -1 || key.indexOf('exhep') !== -1 || key.indexOf('lomocare') !== -1 || key.indexOf('lmwx') !== -1) {
      details.ingredient = "Enoxaparin Sodium (LMWH)";
      details.class = "Anticoagulant / Low Molecular Weight Heparin";
      details.form = key.indexOf('cartridge') !== -1 ? "Cartridge Device" : "Pre-filled Syringe (PFS)";
      details.description = name + " is a low molecular weight heparin (LMWH) anti-thrombotic agent. It helps prevent and treat blood clots, including deep vein thrombosis (DVT) and pulmonary embolism. It is routinely used post-surgery or during high-risk pregnancy protocols.";
    } else if (key.indexOf('gestone') !== -1 || key.indexOf('progest') !== -1 || key.indexOf('progivian') !== -1) {
      details.ingredient = "Natural Progesterone / Progestin";
      details.class = "Hormonal Support / Progesterone Therapy";
      details.form = key.indexOf('gel') !== -1 ? "Vaginal Gel Applicator" : (key.indexOf('cap') !== -1 ? "Soft Capsules" : "Intramuscular Injection");
      details.description = name + " is a progesterone replacement formulation. It is indicated for luteal support in assisted reproductive technology (ART), threat of miscarriage, pre-term birth prevention, or menstrual cycle regulation.";
    } else if (key.indexOf('estradiol') !== -1 || key.indexOf('estrogel') !== -1 || key.indexOf('estofert') !== -1 || key.indexOf('evadiol') !== -1) {
      details.ingredient = "Estradiol Valerate / Estrogen Hemihydrate";
      details.class = "Estrogen Therapy / Hormone Replacement";
      details.form = key.indexOf('gel') !== -1 ? "Transdermal Gel" : "Oral Tablets";
      details.description = name + " is an estrogen supplement designed to support endometrial lining thickness and manage estrogen levels during IVF cycles, hormone replacement therapy (HRT), or treatment of ovarian dysfunction.";
    } else {
      // General fallbacks based on categories
      if (category === 'fertility') {
        details.ingredient = "Urofollitropin / Follicle Stimulating Hormone";
        details.class = "Gonadotropin Stimulator";
        details.form = "Vial Injection";
        details.description = name + " is a specialized fertility medication engineered to support follicular growth and ovulation. It forms a key part of therapeutic protocols for couples undergoing assisted reproduction.";
      } else if (category === 'hcg') {
        details.ingredient = "Human Chorionic Gonadotropin (hCG)";
        details.class = "Luteinizing Hormone Analog";
        details.form = "Vial / Syringe";
        details.description = name + " acts as a trigger injection in fertility treatments. By replicating the LH surge, it facilitates release of mature eggs for fertilization or retrieval in IVF cycles.";
      } else if (category === 'anticoagulant') {
        details.ingredient = "Enoxaparin Sodium / Heparin Derivative";
        details.class = "Anti-Thrombotic Agent";
        details.form = "Pre-filled Syringe";
        details.description = name + " is an anticoagulant injection used to prevent coagulation and clotting disorders. It is commonly prescribed for obstetric thromboprophylaxis or cardiovascular recovery.";
      } else {
        details.ingredient = "Specialty Pharmaceutical Active";
        details.class = "Therapeutic Agent / Specialty Care";
        details.form = "Vial / PFS / Tablet";
        details.description = name + " is an advanced pharmaceutical formulation developed under GMP-compliant manufacturing environments. It is engineered to meet strict quality and stability criteria to support targeted healthcare treatments.";
      }
    }
    
    return details;
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
    var cards = document.querySelectorAll('.product-card');
    var countEl = document.querySelector('.products-count strong');

    if (!cards.length) return;

    var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    var category = activeTab ? activeTab.getAttribute('data-category') : 'all';
    
    var matchingCards = [];

    cards.forEach(function (card) {
      var name = (card.getAttribute('data-name') || '').toLowerCase();
      var cat = card.getAttribute('data-category') || '';

      var matchesSearch = !query || name.indexOf(query) !== -1;
      var matchesCategory = category === 'all' || cat === category;

      if (matchesSearch && matchesCategory) {
        matchingCards.push(card);
      } else {
        card.style.display = 'none';
      }
    });

    // Update count
    if (countEl) {
      countEl.textContent = matchingCards.length;
    }

    // Show/hide no results
    var noResults = document.getElementById('no-results');
    if (noResults) {
      noResults.style.display = matchingCards.length === 0 ? 'block' : 'none';
    }

    // Render Pagination Controls
    renderPagination(matchingCards.length);

    // Show only active page cards
    var startIndex = (activePage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;

    matchingCards.forEach(function (card, index) {
      if (index >= startIndex && index < endIndex) {
        card.style.display = '';
        card.classList.add('visible');
      } else {
        card.style.display = 'none';
      }
    });
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
  // PRODUCT DETAIL OVERLAY & ROUTING
  // =========================================
  function initProductDetailOverlay() {
    var grid = document.getElementById('products-grid');
    var overlay = document.getElementById('product-detail-overlay');
    var backBtn = document.getElementById('detail-back-btn');
    var inquireBtn = document.getElementById('detail-inquire-btn');

    if (!grid || !overlay) return;

    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.product-card');
      if (!card) return;

      e.preventDefault();
      var productName = card.getAttribute('data-name');
      var slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      window.location.hash = 'product/' + slug;
    });

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        history.pushState("", document.title, window.location.pathname + window.location.search);
        checkHashRoute();
      });
    }

    if (inquireBtn) {
      inquireBtn.addEventListener('click', function () {
        var title = document.getElementById('detail-title').textContent;
        openInquiryModal(title);
      });
    }

    window.addEventListener('hashchange', checkHashRoute);
    checkHashRoute();
  }

  function openInquiryModal(productName) {
    var modal = document.getElementById('contact-modal');
    if (!modal) {
      injectContactModal();
      modal = document.getElementById('contact-modal');
    }
    
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      var subjectInput = document.getElementById('modal-subject');
      if (subjectInput) {
        subjectInput.value = 'Product Inquiry: ' + productName;
      }
      
      var nameInput = document.getElementById('modal-name');
      if (nameInput) {
        setTimeout(function() { nameInput.focus(); }, 150);
      }
    }
  }

  function checkHashRoute() {
    var hash = window.location.hash;
    var overlay = document.getElementById('product-detail-overlay');
    if (!overlay) return;

    if (hash && hash.indexOf('#product/') === 0) {
      var slug = hash.replace('#product/', '');
      var cards = document.querySelectorAll('.product-card');
      var foundCard = null;

      cards.forEach(function (card) {
        var name = card.getAttribute('data-name');
        var cardSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (cardSlug === slug) {
          foundCard = card;
        }
      });

      if (foundCard) {
        var productName = foundCard.getAttribute('data-name');
        var category = foundCard.getAttribute('data-category');
        var imageInnerHtml = foundCard.querySelector('.product-card__image').innerHTML;
        
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = imageInnerHtml;
        var badge = tempDiv.querySelector('.product-card__badge');
        if (badge) badge.remove();
        
        var details = getProductDetails(productName, category);
        
        document.getElementById('detail-image-wrapper').innerHTML = tempDiv.innerHTML;
        document.getElementById('detail-category').textContent = category.charAt(0).toUpperCase() + category.slice(1);
        document.getElementById('detail-title').textContent = productName.toUpperCase();
        document.getElementById('detail-description').textContent = details.description;
        document.getElementById('detail-meta-class').textContent = details.class;
        document.getElementById('detail-meta-form').textContent = details.form;
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    } else {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
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
