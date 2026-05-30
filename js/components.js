/* ============================================
   ORION PHARMA INDIA — Shared Components
   Injects: Navbar, Footer, WhatsApp FAB, Back-to-Top
   ============================================ */

(function () {
  'use strict';

  /* -----------------------------------------------
     SITE CONFIG
     Single source of truth for all shared data
  ----------------------------------------------- */
  var SITE = {
    name: 'Orion Pharma',
    logoText: 'OP',
    phone: '+91 9326863373',
    whatsapp: 'https://wa.me/919326863373',
    whatsappChat: 'https://wa.me/919326863373?text=Hi',
    email: 'info@orionpharmaindia.org',
    address: 'Ground & First Floor, Batul Park, Washim Bypass Square, Akola, Maharashtra, India - 444002',
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.4592325611106!2d76.986352!3d20.691568300000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd731dff0697035%3A0x84bac850a980e66c!2sOrion%20Pharma!5e0!3m2!1sen!2sin!4v1780135947188!5m2!1sen!2sin',
    developer: { name: 'pizzascript.com', url: 'https://pizzascript.com' },
    navLinks: [
      { href: 'index.html',    label: 'Home' },
      { href: 'about.html',    label: 'About' },
      { href: 'products.html', label: 'Products' },
      { href: 'contact.html',  label: 'Contact' }
    ],
    footerProductLinks: [
      { href: 'products.html', label: 'Fertility Products' },
      { href: 'products.html', label: 'Hormonal Products' },
      { href: 'products.html', label: 'hCG Products' },
      { href: 'products.html', label: 'Anticoagulants' }
    ]
  };

  /* -----------------------------------------------
     HELPERS
  ----------------------------------------------- */

  // Detect folder depth relative to the website root
  function getPathPrefix() {
    var path = window.location.pathname;
    if (path.indexOf('/products/') !== -1 || path.indexOf('/services/') !== -1) {
      return '../';
    }
    return '';
  }

  // Resolve which nav link is active based on current page filename
  function getActivePage() {
    var path = window.location.pathname;
    var file = path.split('/').pop() || 'index.html';
    // Treat bare "/" or empty as index
    if (file === '' || file === '/') file = 'index.html';
    return file;
  }

  function svgWhatsapp() {
    return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">' +
      '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
      '</svg>';
  }

  function svgFacebook() {
    return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">' +
      '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>' +
      '</svg>';
  }

  function svgLinkedIn() {
    return '<svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">' +
      '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>' +
      '</svg>';
  }

  /* -----------------------------------------------
     NAVBAR COMPONENT
  ----------------------------------------------- */
  function renderNavbar() {
    var target = document.getElementById('navbar-placeholder');
    if (!target) return;

    var activePage = getActivePage();
    var pathPrefix = getPathPrefix();
    var isProductPage = window.location.pathname.indexOf('/products/') !== -1;
    var isServicesPage = window.location.pathname.indexOf('/services/') !== -1;
    var servicesActive = isServicesPage ? ' active' : '';

    var linksHtml = '';
    SITE.navLinks.forEach(function (link, index) {
      var href = pathPrefix + link.href;
      var isActive = (link.href === 'products.html' && isProductPage) || link.href === activePage ? ' active' : '';
      linksHtml += '<a href="' + href + '" class="navbar__link' + isActive + '">' + link.label + '</a>';

      // Insert Services Dropdown after "About" (index 1)
      if (index === 1) {
        linksHtml +=
          '<div class="navbar__dropdown-container">' +
            '<button class="navbar__link navbar__dropdown-toggle' + servicesActive + '" aria-haspopup="true" aria-expanded="false">' +
              'Services <span class="dropdown-arrow">▼</span>' +
            '</button>' +
            '<div class="navbar__dropdown">' +
              '<a href="' + pathPrefix + 'services/human-infertility.html" class="navbar__dropdown-link">Human Infertility</a>' +
              '<a href="' + pathPrefix + 'services/gynecology.html" class="navbar__dropdown-link">Gynecology</a>' +
              '<a href="' + pathPrefix + 'services/critical-care-medicines.html" class="navbar__dropdown-link">Critical Care</a>' +
            '</div>' +
          '</div>';
      }
    });

    target.outerHTML =
      '<nav class="navbar" id="navbar">' +
        '<div class="container navbar__inner">' +
          '<a href="' + pathPrefix + 'index.html" class="navbar__logo">' +
            '<div class="navbar__logo-icon">' + SITE.logoText + '</div>' +
            'Orion <span>Pharma</span>' +
          '</a>' +
          '<div class="navbar__links" id="nav-links">' +
            linksHtml +
            '<div class="navbar__cta">' +
              '<a href="' + pathPrefix + 'contact.html" class="btn btn--primary btn--sm">Get In Touch</a>' +
            '</div>' +
          '</div>' +
          '<button class="navbar__toggle" id="nav-toggle" aria-label="Toggle navigation">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</nav>';
  }

  /* -----------------------------------------------
     FOOTER COMPONENT
  ----------------------------------------------- */
  function renderFooter() {
    var target = document.getElementById('footer-placeholder');
    if (!target) return;

    var pathPrefix = getPathPrefix();

    var quickLinksHtml = SITE.navLinks.map(function (link) {
      var label = link.label === 'Home' ? 'Home' : (link.label === 'About' ? 'About Us' : link.label);
      return '<a href="' + pathPrefix + link.href + '" class="footer__link">' + label + '</a>';
    }).join('');

    var productLinksHtml = SITE.footerProductLinks.map(function (link) {
      return '<a href="' + pathPrefix + link.href + '" class="footer__link">' + link.label + '</a>';
    }).join('');

    target.outerHTML =
      '<footer class="footer" id="footer">' +
        '<div class="container">' +
          '<div class="footer__grid">' +

            // Brand column
            '<div class="footer__brand">' +
              '<a href="' + pathPrefix + 'index.html" class="footer__logo">' +
                '<div class="footer__logo-icon">' + SITE.logoText + '</div>' +
                SITE.name +
              '</a>' +
              '<p class="footer__desc">Providing trusted medicines at affordable prices. Specializing in Human Infertility, Gynecology, Oncology and Critical Care medicines since 2017.</p>' +
              '<div class="footer__socials">' +
                '<a href="' + SITE.whatsapp + '" class="footer__social" aria-label="WhatsApp" target="_blank" rel="noopener">' + svgWhatsapp() + '</a>' +
                '<a href="#" class="footer__social" aria-label="Facebook">' + svgFacebook() + '</a>' +
                '<a href="#" class="footer__social" aria-label="LinkedIn">' + svgLinkedIn() + '</a>' +
              '</div>' +
            '</div>' +

            // Quick Links column
            '<div class="footer__column">' +
              '<h4>Quick Links</h4>' +
              '<div class="footer__links">' + quickLinksHtml + '</div>' +
            '</div>' +

            // Products column
            '<div class="footer__column">' +
              '<h4>Products</h4>' +
              '<div class="footer__links">' + productLinksHtml + '</div>' +
            '</div>' +

            // Contact column
            '<div class="footer__column">' +
              '<h4>Contact Info</h4>' +
              '<div class="footer__contact-row">' +
                '<div class="footer__contact-text">' +
                  '<span class="footer__contact-address">' + SITE.address + '</span>' +
                  '<a href="' + SITE.whatsapp + '" class="footer__link">' + SITE.phone + '</a>' +
                '</div>' +
                '<div class="footer__mini-map">' +
                  '<iframe src="' + SITE.mapEmbed + '" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
                '</div>' +
              '</div>' +
            '</div>' +

          '</div>' +
          '<div class="footer__bottom">' +
            '<p class="footer__copy">&copy; <span class="current-year">' + new Date().getFullYear() + '</span> Orion Pharma India. All rights reserved.</p>' +
            '<div class="footer__bottom-links">' +
              '<a href="' + SITE.developer.url + '" target="_blank" rel="noopener" class="footer__bottom-link">Developed by ' + SITE.developer.name + '</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</footer>';
  }

  /* -----------------------------------------------
     WHATSAPP FAB COMPONENT
  ----------------------------------------------- */
  function renderWhatsAppFab() {
    var target = document.getElementById('whatsapp-fab-placeholder');
    if (!target) return;

    target.outerHTML =
      '<a href="' + SITE.whatsappChat + '" class="whatsapp-fab" aria-label="Chat on WhatsApp" target="_blank" rel="noopener">' +
        '<svg width="26" height="26" fill="currentColor" viewBox="0 0 24 24">' +
          '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
        '</svg>' +
      '</a>';
  }

  /* -----------------------------------------------
     BACK-TO-TOP COMPONENT
  ----------------------------------------------- */
  function renderBackToTop() {
    var target = document.getElementById('back-to-top-placeholder');
    if (!target) return;

    target.outerHTML =
      '<button class="back-to-top" aria-label="Back to top">' +
        '<svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>' +
      '</button>';
  }

  /* -----------------------------------------------
     BOOT — run as early as possible
  ----------------------------------------------- */
  function boot() {
    renderNavbar();
    renderFooter();
    renderWhatsAppFab();
    renderBackToTop();
  }

  // Expose boot globally to support dynamic shell loaders
  window.initNavigationComponents = boot;

  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
