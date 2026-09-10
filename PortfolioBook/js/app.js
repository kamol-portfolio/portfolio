(function () {
  'use strict';

  var ORDER = ['home', 'about', 'skills', 'experience', 'projects', 'certifications', 'education', 'achievements', 'contact'];
  var META = {
    home:           { title: 'Cover' },
    about:          { title: 'About Kamol' },
    skills:         { title: 'Skills & Expertise' },
    experience:     { title: 'Experience' },
    projects:       { title: 'Selected Projects' },
    certifications: { title: 'Certifications' },
    education:      { title: 'Education & Journey' },
    achievements:   { title: 'Impact & Achievements' },
    contact:        { title: 'Contact' }
  };

  var pages = {};
  document.querySelectorAll('.page').forEach(function (p) {
    pages[p.getAttribute('data-page')] = p;
  });

  var idxTabs = document.querySelectorAll('.idx-tab');
  var titleSmall = document.querySelector('.book-title small');
  var folioCounter = document.querySelector('.folio-counter');
  var prevBtn = document.querySelector('.page-nav-btn.is-prev');
  var nextBtn = document.querySelector('.page-nav-btn.is-next');

  var current = 'home';
  var animating = false;
  var TURN_MS = 460;

  function pageFromHash() {
    var h = (window.location.hash || '').replace('#', '');
    return META[h] ? h : 'home';
  }

  function render(page) {
    idxTabs.forEach(function (t) {
      t.classList.toggle('is-active', t.getAttribute('data-goto') === page);
    });
    if (titleSmall) titleSmall.textContent = META[page].title;

    var i = ORDER.indexOf(page);
    if (folioCounter) {
      folioCounter.innerHTML = 'Page <span>' + String(i + 1).padStart(2, '0') + '</span> of ' + String(ORDER.length).padStart(2, '0');
    }
    if (prevBtn) prevBtn.disabled = i <= 0;
    if (nextBtn) nextBtn.disabled = i >= ORDER.length - 1;
  }

  function goTo(page, opts) {
    opts = opts || {};
    if (!META[page]) page = 'home';
    if (page === current && !opts.force) return;
    if (animating) return;

    var oldPage = pages[current];
    var newPage = pages[page];
    if (!newPage) return;

    var oldIndex = ORDER.indexOf(current);
    var newIndex = ORDER.indexOf(page);
    var direction = newIndex >= oldIndex ? 'next' : 'prev';

    if (opts.silent || !oldPage || oldPage === newPage) {
      if (oldPage) oldPage.classList.remove('is-active');
      newPage.classList.add('is-active');
      current = page;
      render(page);
      if (!opts.silent && window.location.hash !== '#' + page) {
        history.pushState(null, '', '#' + page);
      }
      window.scrollTo(0, 0);
      return;
    }

    animating = true;
    oldPage.classList.remove('is-active');
    oldPage.classList.add(direction === 'next' ? 'is-turning-out-next' : 'is-turning-out-prev');
    newPage.classList.add(direction === 'next' ? 'is-turning-in-next' : 'is-turning-in-prev');

    window.scrollTo(0, 0);

    window.setTimeout(function () {
      oldPage.classList.remove('is-turning-out-next', 'is-turning-out-prev');
      newPage.classList.remove('is-turning-in-next', 'is-turning-in-prev');
      newPage.classList.add('is-active');
      current = page;
      animating = false;
      render(page);
    }, TURN_MS);

    if (window.location.hash !== '#' + page) {
      history.pushState(null, '', '#' + page);
    }
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-goto]');
    if (!trigger) return;
    e.preventDefault();
    goTo(trigger.getAttribute('data-goto'));
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      var i = ORDER.indexOf(current);
      if (i > 0) goTo(ORDER[i - 1]);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      var i = ORDER.indexOf(current);
      if (i < ORDER.length - 1) goTo(ORDER[i + 1]);
    });
  }

  window.addEventListener('hashchange', function () {
    goTo(pageFromHash());
  });

  document.addEventListener('keydown', function (e) {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'ArrowRight') { var n = ORDER.indexOf(current); if (n < ORDER.length - 1) goTo(ORDER[n + 1]); }
    if (e.key === 'ArrowLeft') { var p = ORDER.indexOf(current); if (p > 0) goTo(ORDER[p - 1]); }
  });

  goTo(pageFromHash(), { silent: true, force: true });

  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var subject = form.subject.value.trim() || 'Portfolio inquiry';
      var message = form.message.value.trim();
      var body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
      var mailto = 'mailto:your-email@example.com' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  var yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.body.classList.add('is-ready');
})();
