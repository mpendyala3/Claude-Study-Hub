/* Shared site chrome: theme, nav highlighting, sidebar scrollspy, docs search. */
(function () {
  'use strict';

  /* ---- storage ----
     Everything is saved under one prefix. It used to be ccarf-, from when the
     Architect track lived here too; that track is its own site now, on the
     same github.io origin, and a shared origin is a shared localStorage. The
     two sites' exercise ids overlap, so the prefixes have to differ or one
     site's half-typed answer lands in the other's box. Carry across the keys
     this site still owns, once, and leave the originals where they are -- the
     Architect site is still reading its own. */
  var PFX = 'csh-';

  try {
    ['theme', 'ccao-exam', 'ccdv-exam'].forEach(function (k) {
      var was = localStorage.getItem('ccarf-' + k);
      if (was !== null && localStorage.getItem(PFX + k) === null) {
        localStorage.setItem(PFX + k, was);
      }
    });
  } catch (e) {}

  window.store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(PFX + k); return v === null ? d : JSON.parse(v); }
      catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem(PFX + k, JSON.stringify(v)); } catch (e) {}
    },
    del: function (k) { try { localStorage.removeItem(PFX + k); } catch (e) {} }
  };

  /* ---- theme ---- */
  var KEY = PFX + 'theme';
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  if (saved) document.documentElement.setAttribute('data-theme', saved);
  else if (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  window.toggleTheme = function () {
    var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
    try { localStorage.setItem(KEY, cur); } catch (e) {}
    syncThemeBtn();
  };

  function syncThemeBtn() {
    var b = document.getElementById('themeBtn');
    if (b) b.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀' : '☾';
  }

  /* The header is two rows -- the three main pages, then the current section's
     own pages -- and its height changes as either row wraps, or drops entirely
     on Home, which has no second row. --hdr carries that height: the sticky
     exam bar and the anchor scroll offset both read it. The CSS value is a
     fallback for no-JS; this keeps it exact at every width. */
  var hdrObserver = null;

  function syncHeaderHeight() {
    var bar = document.querySelector('.topbar');
    if (!bar) return;
    var h = Math.round(bar.getBoundingClientRect().height);
    if (h > 0) document.documentElement.style.setProperty('--hdr', h + 'px');
  }

  document.addEventListener('DOMContentLoaded', function () {
    syncThemeBtn();

    syncHeaderHeight();
    var bar = document.querySelector('.topbar');
    if (bar && window.ResizeObserver) {
      /* Hold the observer: an unreferenced one can be collected. */
      hdrObserver = new ResizeObserver(syncHeaderHeight);
      hdrObserver.observe(bar);
    }
    window.addEventListener('resize', syncHeaderHeight);
    /* Layout can still shift after DOMContentLoaded -- a scrollbar appearing can
       cross a breakpoint and re-wrap the nav -- so measure once more when the
       page is fully loaded. Cheap, and it does not depend on ResizeObserver. */
    window.addEventListener('load', syncHeaderHeight);

    /* Active nav, two rows with two different rules. The main row cannot match
       on filename -- CCAO-F points at ccao-index.html, yet it has to stay lit
       on ccao-docs and the rest -- so it matches on the section derived from
       the filename prefix. The sub row is a page list, so exact filename is
       right there. */
    var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === '') page = 'index.html';

    var sect = 'home';
    if (page.indexOf('ccao-') === 0) sect = 'ccao';
    else if (page.indexOf('ccdv-') === 0) sect = 'ccdv';

    var top = document.querySelector('.nav-main a[data-sect="' + sect + '"]');
    if (top) top.classList.add('active');

    document.querySelectorAll('.nav-sub a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (href === page) {
        a.classList.add('active');
        var g = a.closest ? a.closest('.navgroup') : null;
        if (g) g.classList.add('is-current');
      }
    });

    /* sidebar scrollspy */
    var links = Array.prototype.slice.call(document.querySelectorAll('.sidebar a[href^="#"]'));
    if (links.length) {
      var targets = links.map(function (a) {
        return document.getElementById(a.getAttribute('href').slice(1));
      });
      var spy = function () {
        var best = 0, y = window.scrollY + 120;
        targets.forEach(function (t, i) { if (t && t.offsetTop <= y) best = i; });
        links.forEach(function (a, i) { a.classList.toggle('active', i === best); });
      };
      window.addEventListener('scroll', spy, { passive: true });
      spy();
    }

    /* docs search: filter sidebar links + sections */
    var sb = document.getElementById('docSearch');
    if (sb) {
      sb.addEventListener('input', function () {
        var q = sb.value.trim().toLowerCase();
        document.querySelectorAll('[data-searchable]').forEach(function (sec) {
          var hit = !q || sec.textContent.toLowerCase().indexOf(q) !== -1;
          sec.classList.toggle('hide', !hit);
          if (q && hit) sec.querySelectorAll('details.qa').forEach(function (d) {
            if (d.textContent.toLowerCase().indexOf(q) !== -1) d.open = true;
          });
        });
      });
    }

    /* expand/collapse all Q&A */
    var xa = document.getElementById('expandAll');
    if (xa) xa.addEventListener('click', function () {
      var any = !!document.querySelector('details.qa:not([open])');
      document.querySelectorAll('details.qa').forEach(function (d) { d.open = any; });
      xa.textContent = any ? 'Collapse all Q&A' : 'Expand all Q&A';
    });
  });
})();
