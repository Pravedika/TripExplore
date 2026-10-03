/* ============================================================
   MERIDIAN TRAVEL — Core Script
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Page loader ---------- */
  const loader = document.querySelector('.page-loader');
  window.addEventListener('load', function () {
    setTimeout(() => loader && loader.classList.add('hide'), 350);
  });
  // fallback in case load already fired
  setTimeout(() => loader && loader.classList.add('hide'), 2500);

  /* ---------- Sticky / scrolled navbar ---------- */
  const navbar = document.querySelector('.navbar-meridian');
  function handleNavScroll(){
    if(!navbar) return;
    if(window.scrollY > 40){ navbar.classList.add('scrolled'); }
    else { navbar.classList.remove('scrolled'); }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  /* ---------- Mobile nav toggle ---------- */
  const navToggleBtn = document.querySelector('.nav-toggle-btn');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  function closeNav(){
    navLinks && navLinks.classList.remove('open');
    navOverlay && navOverlay.classList.remove('open');
  }
  if(navToggleBtn){
    navToggleBtn.addEventListener('click', function(){
      navLinks.classList.toggle('open');
      navOverlay.classList.toggle('open');
    });
  }
  navOverlay && navOverlay.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------- Highlight active nav link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if(href === currentPage){ link.classList.add('active'); }
  });

  /* ---------- Dark / Light mode toggle ---------- */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle');
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('meridian-theme') || 'light';
  if(savedTheme === 'dark'){ root.setAttribute('data-theme','dark'); }
  function updateThemeIcons(){
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggleBtns.forEach(btn => {
      btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
  }
  updateThemeIcons();
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', function(){
      const isDark = root.getAttribute('data-theme') === 'dark';
      if(isDark){ root.removeAttribute('data-theme'); localStorage.setItem('meridian-theme','light'); }
      else { root.setAttribute('data-theme','dark'); localStorage.setItem('meridian-theme','dark'); }
      updateThemeIcons();
    });
  });

  /* ---------- Scroll to top button ---------- */
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  if(scrollTopBtn){
    window.addEventListener('scroll', function(){
      if(window.scrollY > 500){ scrollTopBtn.classList.add('show'); }
      else { scrollTopBtn.classList.remove('show'); }
    });
    scrollTopBtn.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* ---------- Scroll reveal (fade-in animation), fallback if AOS absent ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealEls.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.15});
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Stats counter animation ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if(counters.length){
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.5});
    counters.forEach(c => counterObserver.observe(c));
  }
  function animateCounter(el){
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (target % 1 === 0 ? Math.floor(value) : value.toFixed(1)) + suffix;
      if(progress < 1){ requestAnimationFrame(tick); }
      else { el.textContent = target + suffix; }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Destination / Package filtering ---------- */
  const filterPills = document.querySelectorAll('.filter-pill');
  const filterableItems = document.querySelectorAll('[data-category]');
  if(filterPills.length){
    filterPills.forEach(pill => {
      pill.addEventListener('click', function(){
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        const filter = this.getAttribute('data-filter');
        filterableItems.forEach(item => {
          const cats = item.getAttribute('data-category');
          const show = filter === 'all' || cats.includes(filter);
          if(show){
            item.style.display = '';
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0) scale(1)';
            });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px) scale(0.96)';
            setTimeout(() => { if(item.style.opacity === '0'){ item.style.display = 'none'; } }, 300);
          }
        });
      });
    });
    filterableItems.forEach(item => {
      item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
    });
  }

  /* ---------- Search form (home) ---------- */
  const searchForm = document.querySelector('.search-form');
  if(searchForm){
    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      const dest = searchForm.querySelector('[name="destination"]').value;
      const btn = searchForm.querySelector('.search-submit-btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        window.location.href = 'destinations.html' + (dest ? ('?search=' + encodeURIComponent(dest)) : '');
      }, 700);
    });
  }

  /* ---------- Contact form validation ---------- */
  const contactForm = document.querySelector('#contactForm');
  if(contactForm){
    contactForm.addEventListener('submit', function(e){
      e.preventDefault();
      let valid = true;
      const name = contactForm.querySelector('#cf-name');
      const email = contactForm.querySelector('#cf-email');
      const subject = contactForm.querySelector('#cf-subject');
      const message = contactForm.querySelector('#cf-message');
      const phone = contactForm.querySelector('#cf-phone');

      function validateField(field, condition){
        if(condition){ field.classList.remove('is-invalid'); }
        else { field.classList.add('is-invalid'); valid = false; }
      }

      validateField(name, name.value.trim().length >= 2);
      validateField(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
      validateField(subject, subject.value.trim().length >= 3);
      validateField(message, message.value.trim().length >= 10);
      if(phone){ validateField(phone, phone.value.trim().length >= 7); }

      const successAlert = document.querySelector('.form-alert-success');
      if(valid){
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          contactForm.reset();
          successAlert && successAlert.classList.add('show');
          setTimeout(() => successAlert && successAlert.classList.remove('show'), 5000);
        }, 900);
      }
    });

    // live validation clear
    contactForm.querySelectorAll('.form-control-meridian').forEach(field => {
      field.addEventListener('input', function(){ this.classList.remove('is-invalid'); });
    });
  }

  /* ---------- Newsletter form ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if(input.value.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())){
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        input.value = '';
        setTimeout(() => btn.innerHTML = original, 2000);
      } else {
        input.style.boxShadow = '0 0 0 2px #e74c3c';
        setTimeout(() => input.style.boxShadow = '', 1200);
      }
    });
  });

  /* ---------- Set min date for date inputs (today) ---------- */
  document.querySelectorAll('input[type="date"]').forEach(input => {
    const today = new Date().toISOString().split('T')[0];
    input.setAttribute('min', today);
  });

  /* ---------- Gallery lightbox (simple) ---------- */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function(){
      const img = this.querySelector('img');
      if(img){ window.open(img.src, '_blank'); }
    });
  });

});
