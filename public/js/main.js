/* ==========================================================================
   Zenvorali Cleaning — main.js
   - Smooth scrolling for in-page anchors
   - Sticky / auto-hiding header
   - Mobile drawer navigation + mega-dropdown accordion
   - Scroll reveal (IntersectionObserver + animationend cleanup)
   - Animated stat counters
   - FAQ accordion (height-animated, ARIA)
   - Before/after image slider (mouse, touch, keyboard)
   - Rating bars + "current day" highlight
   - To-top button
   - Reading progress, lazy iframes, share actions, form polish
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  html.classList.remove('no-js');
  html.classList.add('js');
  if (reduceMotion) html.classList.add('no-smooth');

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function on(el, evt, fn, opts) { if (el) el.addEventListener(evt, fn, opts || false); }

  /* ----------------------------------------------------------------------
     1. Smooth scrolling for same-page anchors (with sticky-header offset)
     ---------------------------------------------------------------------- */
  function headerOffset() {
    var header = $('.site-header');
    return header ? header.offsetHeight + 16 : 90;
  }

  function scrollToTarget(target) {
    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset();
    if (reduceMotion) {
      window.scrollTo(0, top);
    } else {
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
    target.setAttribute('tabindex', '-1');
    window.setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion ? 0 : 480);
  }

  on(document, 'click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href*="#"]') : null;
    if (!link) return;

    var href = link.getAttribute('href');
    if (!href || href === '#' || link.hasAttribute('data-no-smooth')) return;
    if (link.target && link.target !== '_self') return;

    var hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    var pathPart = href.slice(0, hashIndex);
    var id = href.slice(hashIndex + 1);
    if (!id) return;

    var samePage = pathPart === '' ||
      pathPart === location.pathname ||
      pathPart === location.pathname.replace(/\/$/, '') ||
      pathPart.replace(/^\.\//, '') === location.pathname;
    if (!samePage) return;

    var target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    closeNav();
    scrollToTarget(target);

    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* ----------------------------------------------------------------------
     2. Sticky / auto-hiding header
     ---------------------------------------------------------------------- */
  var header = $('.site-header');
  var lastY = window.pageYOffset;
  var ticking = false;

  function updateHeader() {
    var y = window.pageYOffset;
    if (!header) return;

    header.classList.toggle('is-stuck', y > 12);

    var navOpen = nav && nav.classList.contains('is-open');
    if (!navOpen && !body.classList.contains('is-locked')) {
      if (y > 420 && y > lastY + 6) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 4 || y < 200) {
        header.classList.remove('is-hidden');
      }
    } else {
      header.classList.remove('is-hidden');
    }

    lastY = y;
    ticking = false;
  }

  on(window, 'scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ----------------------------------------------------------------------
     3. Mobile drawer navigation
     ---------------------------------------------------------------------- */
  var nav = $('#primaryNav');
  var navToggle = $('.nav__toggle');
  var navClose = $('.nav__close');
  var overlay = $('.nav-overlay');
  var navBreakpoint = 900;

  function isDrawer() { return window.innerWidth <= navBreakpoint; }

  function openNav() {
    if (!nav) return;
    nav.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    body.classList.add('is-locked');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'true');
    if (header) header.classList.remove('is-hidden');
  }

  function closeNav() {
    if (!nav || !nav.classList.contains('is-open')) return;
    nav.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    body.classList.remove('is-locked');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    $$('.nav__item.is-open').forEach(function (item) {
      item.classList.remove('is-open');
      var btn = $('.nav__link', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  on(navToggle, 'click', function () {
    if (!nav) return;
    if (nav.classList.contains('is-open')) closeNav(); else openNav();
  });

  on(navClose, 'click', closeNav);
  on(overlay, 'click', closeNav);

  on(document, 'keydown', function (e) {
    if (e.key === 'Escape') {
      if (nav && nav.classList.contains('is-open')) {
        closeNav();
        if (navToggle) navToggle.focus();
      }
    }
  });

  var resizeTimer;
  on(window, 'resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (!isDrawer()) closeNav();
    }, 140);
  });

  /* ----------------------------------------------------------------------
     4. Mega dropdown — mobile accordion toggle, desktop hover (CSS-driven)
     ---------------------------------------------------------------------- */
  $$('.nav__item').forEach(function (item) {
    var trigger = $('.nav__link', item);
    var panel = $('.dropdown', item);
    if (!trigger || !panel) return;

    trigger.setAttribute('aria-expanded', 'false');
    if (panel.id) trigger.setAttribute('aria-controls', panel.id);

    on(trigger, 'click', function (e) {
      if (!isDrawer()) return; // desktop is handled by CSS hover/focus-within
      e.preventDefault();
      var willOpen = !item.classList.contains('is-open');
      $$('.nav__item.is-open', nav).forEach(function (other) {
        if (other === item) return;
        other.classList.remove('is-open');
        var t = $('.nav__link', other);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    on(trigger, 'keydown', function (e) {
      if (isDrawer()) return;
      if (e.key === 'Escape') {
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.blur();
      }
    });
  });

  /* ----------------------------------------------------------------------
     5. Scroll reveal (IntersectionObserver + animationend cleanup)
     ---------------------------------------------------------------------- */
  var revealNodes = $$('.reveal');

  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealNodes.forEach(function (el) { el.classList.add('is-in', 'is-done'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add('is-in');
        el.addEventListener('animationend', function handler(ev) {
          if (ev.target !== el) return;
          el.classList.add('is-done');
          el.removeEventListener('animationend', handler);
        });
        window.setTimeout(function () { el.classList.add('is-done'); }, 1600);
        revealObserver.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealNodes.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------------------
     6. Animated stat counters
     ---------------------------------------------------------------------- */
  function finalText(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    if (isNaN(target)) return '';
    return (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString('en-US')) + suffix;
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var duration = parseInt(el.getAttribute('data-duration'), 10) || 1500;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var value = target * eased;
      el.textContent = (decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString('en-US')) + suffix;
      if (p < 1) window.requestAnimationFrame(frame);
      else el.textContent = finalText(el);
    }

    window.requestAnimationFrame(frame);
  }

  var counters = $$('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window) || reduceMotion) {
      counters.forEach(function (el) { el.textContent = finalText(el); });
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ----------------------------------------------------------------------
     7. Rating bars (animate on view)
     ---------------------------------------------------------------------- */
  var bars = $$('.rating-bar__fill');
  if (bars.length) {
    var animateBars = function () {
      bars.forEach(function (bar) { bar.style.width = (bar.getAttribute('data-pct') || '0') + '%'; });
    };
    if (!('IntersectionObserver' in window)) {
      animateBars();
    } else {
      var panel = $('.rating-panel');
      if (panel) {
        var barObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            animateBars();
            barObserver.disconnect();
          });
        }, { threshold: 0.25 });
        barObserver.observe(panel);
      } else {
        animateBars();
      }
    }
  }

  /* ----------------------------------------------------------------------
     8. FAQ accordion
     ---------------------------------------------------------------------- */
  $$('.faq-item').forEach(function (item) {
    var btn = $('.faq-item__q', item);
    var panel = $('.faq-item__a', item);
    if (!btn || !panel) return;

    btn.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
    if (panel.id) btn.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'region');
    if (btn.id) panel.setAttribute('aria-labelledby', btn.id);

    panel.style.height = item.classList.contains('is-open') ? 'auto' : '0px';

    on(btn, 'click', function () {
      var isOpen = item.classList.contains('is-open');

      var group = item.closest('[data-faq-group]');
      if (group && !isOpen) {
        $$('.faq-item.is-open', group).forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          var ob = $('.faq-item__q', other);
          var op = $('.faq-item__a', other);
          if (ob) ob.setAttribute('aria-expanded', 'false');
          if (op) op.style.height = '0px';
        });
      }

      if (isOpen) {
        panel.style.height = panel.scrollHeight + 'px';
        window.requestAnimationFrame(function () { panel.style.height = '0px'; });
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.height = panel.scrollHeight + 'px';
        var done = function (ev) {
          if (ev.target !== panel) return;
          if (item.classList.contains('is-open')) panel.style.height = 'auto';
          panel.removeEventListener('transitionend', done);
        };
        panel.addEventListener('transitionend', done);
      }
    });
  });

  var faqResizeTimer;
  on(window, 'resize', function () {
    window.clearTimeout(faqResizeTimer);
    faqResizeTimer = window.setTimeout(function () {
      $$('.faq-item.is-open .faq-item__a').forEach(function (p) { p.style.height = 'auto'; });
    }, 160);
  });

  /* ----------------------------------------------------------------------
     9. Before / after slider
     ---------------------------------------------------------------------- */
  $$('.ba-slider').forEach(function (slider) {
    var grip = $('.ba-slider__grip', slider);
    var dragging = false;

    slider.setAttribute('role', 'slider');
    if (!slider.hasAttribute('aria-label')) slider.setAttribute('aria-label', 'Before and after comparison');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', '50');
    slider.setAttribute('tabindex', '0');

    function setPos(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      slider.style.setProperty('--pos', pct + '%');
      slider.setAttribute('aria-valuenow', String(Math.round(pct)));
    }

    function start(e) {
      dragging = true;
      slider.classList.add('is-dragging');
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }

    function move(e) {
      if (!dragging) return;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
      if (e.cancelable) e.preventDefault();
    }

    function end() {
      dragging = false;
      slider.classList.remove('is-dragging');
    }

    on(slider, 'mousedown', start);
    on(window, 'mousemove', move);
    on(window, 'mouseup', end);
    on(slider, 'touchstart', start, { passive: true });
    on(slider, 'touchmove', move, { passive: false });
    on(window, 'touchend', end);

    on(slider, 'click', function (e) {
      if (grip && (e.target === grip || grip.contains(e.target))) return;
      setPos(e.clientX);
    });

    on(slider, 'keydown', function (e) {
      var current = parseFloat(slider.getAttribute('aria-valuenow')) || 50;
      var step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft') current = Math.max(0, current - step);
      else if (e.key === 'ArrowRight') current = Math.min(100, current + step);
      else if (e.key === 'Home') current = 0;
      else if (e.key === 'End') current = 100;
      else return;
      e.preventDefault();
      slider.style.setProperty('--pos', current + '%');
      slider.setAttribute('aria-valuenow', String(Math.round(current)));
    });
  });

  /* ----------------------------------------------------------------------
     10. Today's opening-hours highlight
     ---------------------------------------------------------------------- */
  var todayIdx = new Date().getDay(); // 0 = Sunday
  $$('[data-day-index]').forEach(function (row) {
    if (parseInt(row.getAttribute('data-day-index'), 10) === todayIdx) row.classList.add('is-today');
  });

  /* ----------------------------------------------------------------------
     11. To-top button + reading progress
     ---------------------------------------------------------------------- */
  var toTop = $('.to-top');
  if (toTop) {
    var toggleToTop = function () { toTop.classList.toggle('is-visible', window.pageYOffset > 620); };
    on(window, 'scroll', toggleToTop, { passive: true });
    toggleToTop();
    on(toTop, 'click', function () {
      if (reduceMotion) window.scrollTo(0, 0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var progressBar = $('.reading-progress__bar');
  if (progressBar) {
    var updateProgress = function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? (window.pageYOffset / docH) * 100 : 0;
      progressBar.style.width = Math.max(0, Math.min(100, pct)) + '%';
    };
    on(window, 'scroll', updateProgress, { passive: true });
    on(window, 'resize', updateProgress);
    updateProgress();
  }

  /* ----------------------------------------------------------------------
     12. Table-of-contents / quick-nav active section
     ---------------------------------------------------------------------- */
  var tocLinks = $$('.toc a[href^="#"], .quick-nav__list a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var sections = tocLinks
      .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
      .filter(Boolean);

    if (sections.length) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          tocLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
      sections.forEach(function (s) { sectionObserver.observe(s); });
    }
  }

  /* ----------------------------------------------------------------------
     13. Share buttons
     ---------------------------------------------------------------------- */
  $$('[data-share]').forEach(function (btn) {
    on(btn, 'click', function (e) {
      e.preventDefault();
      var network = btn.getAttribute('data-share');
      var url = encodeURIComponent(btn.getAttribute('data-share-url') || window.location.href);
      var title = encodeURIComponent(btn.getAttribute('data-share-title') || document.title);
      var target = '';

      if (network === 'facebook') target = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
      else if (network === 'x') target = 'https://twitter.com/intent/tweet?url=' + url + '&text=' + title;
      else if (network === 'linkedin') target = 'https://www.linkedin.com/sharing/share-offsite/?url=' + url;
      else if (network === 'pinterest') target = 'https://pinterest.com/pin/create/button/?url=' + url + '&description=' + title;
      else if (network === 'email') target = 'mailto:?subject=' + title + '&body=' + url;
      else if (network === 'copy') {
        var text = decodeURIComponent(url);
        var done = function () {
          btn.classList.add('is-copied');
          window.setTimeout(function () { btn.classList.remove('is-copied'); }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(done);
        } else {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (err) { /* noop */ }
          document.body.removeChild(ta);
          done();
        }
        return;
      }

      if (target) window.open(target, '_blank', 'noopener,noreferrer,width=680,height=620');
    });
  });

  /* ----------------------------------------------------------------------
     14. Form polish: inline validation + submit lock
     ---------------------------------------------------------------------- */
  $$('form[data-validate]').forEach(function (form) {
    var submitBtn = $('[type="submit"]', form);

    function validateField(field) {
      var input = $('input, select, textarea', field);
      if (!input) return true;
      var wrap = input.closest('.field') || field;
      var errorEl = $('.field__error', wrap);
      var valid = true;

      if (input.hasAttribute('required') && !String(input.value).trim()) {
        valid = false;
      } else if (input.type === 'email' && input.value) {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value);
      } else if (input.type === 'tel' && input.value) {
        valid = String(input.value).replace(/[^\d]/g, '').length >= 10;
      } else if (input.hasAttribute('minlength') && input.value) {
        valid = input.value.length >= parseInt(input.getAttribute('minlength'), 10);
      }

      wrap.classList.toggle('field--invalid', !valid);
      input.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (errorEl) errorEl.hidden = valid;
      return valid;
    }

    $$('.field', form).forEach(function (field) {
      var input = $('input, select, textarea', field);
      if (!input) return;
      on(input, 'blur', function () { validateField(field); });
      on(input, 'input', function () {
        if ((input.closest('.field') || field).classList.contains('field--invalid')) validateField(field);
      });
    });

    on(form, 'submit', function (e) {
      var firstInvalid = null;
      $$('.field', form).forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = $('input, select, textarea', field);
      });

      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
        return;
      }

      if (submitBtn) {
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.classList.add('is-loading');
      }
    });
  });

  /* ----------------------------------------------------------------------
     15. Lazy iframes (deferred src loading)
     ---------------------------------------------------------------------- */
  var lazyFrames = $$('iframe[data-src]');
  if (lazyFrames.length) {
    if (!('IntersectionObserver' in window)) {
      lazyFrames.forEach(function (f) { f.src = f.getAttribute('data-src'); });
    } else {
      var frameObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var f = entry.target;
          f.src = f.getAttribute('data-src');
          f.removeAttribute('data-src');
          frameObserver.unobserve(f);
        });
      }, { rootMargin: '260px' });
      lazyFrames.forEach(function (f) { frameObserver.observe(f); });
    }
  }

  /* ----------------------------------------------------------------------
     16. External links: enforce rel safety
     ---------------------------------------------------------------------- */
  $$('a[target="_blank"]').forEach(function (a) {
    var rel = (a.getAttribute('rel') || '').split(/\s+/).filter(Boolean);
    if (rel.indexOf('noopener') === -1) rel.push('noopener');
    if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
  });

  /* ----------------------------------------------------------------------
     17. Meter widths declared via data-width
     ---------------------------------------------------------------------- */
  var meters = $$('[data-width]');
  if (meters.length && 'IntersectionObserver' in window) {
    var meterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.getAttribute('data-width');
        meterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    meters.forEach(function (m) { meterObserver.observe(m); });
  } else {
    meters.forEach(function (m) { m.style.width = m.getAttribute('data-width'); });
  }

  /* ----------------------------------------------------------------------
     18. Copy quick actions (phone / email)
     ---------------------------------------------------------------------- */
  $$('[data-copy]').forEach(function (el) {
    on(el, 'click', function () {
      var text = el.getAttribute('data-copy');
      if (!text || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(function () {
        el.classList.add('is-copied');
        window.setTimeout(function () { el.classList.remove('is-copied'); }, 1500);
      }).catch(function () { /* noop */ });
    });
  });

  /* ----------------------------------------------------------------------
     19. Current-year stamping (covers cached markup)
     ---------------------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ----------------------------------------------------------------------
     20. Sticky CTA bar on long pages
     ---------------------------------------------------------------------- */
  var stickyBar = $('.sticky-cta');
  if (stickyBar) {
    var toggleStickyBar = function () {
      var show = window.pageYOffset > 700 &&
        window.pageYOffset < (document.documentElement.scrollHeight - window.innerHeight - 420);
      stickyBar.classList.toggle('is-visible', show);
    };
    on(window, 'scroll', toggleStickyBar, { passive: true });
    toggleStickyBar();
  }
})();
