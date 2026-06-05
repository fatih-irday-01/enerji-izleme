'use strict';

// Mobile nav toggle
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });
}

// Close mobile nav on link click
mobileNav && mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileNav.classList.remove('open'));
});

// Smooth scroll offset for fixed nav
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Scroll-reveal animation
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.flow-step, .module-card, .device-card, .feature-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});

document.addEventListener('animationend', () => {}, false);

// Add revealed class handler
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);
});

// CTA form
const ctaForm = document.getElementById('ctaForm');
if (ctaForm) {
  ctaForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = ctaForm.querySelector('.cta-btn');
    const original = btn.textContent;
    btn.textContent = '✓ Talebiniz Alındı!';
    btn.style.background = '#10B981';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
      ctaForm.reset();
    }, 4000);
  });
}

// Nav background on scroll
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-wrap');
  if (!nav) return;
  nav.style.background = window.scrollY > 20
    ? 'rgba(8,15,30,0.97)'
    : 'rgba(8,15,30,0.85)';
}, { passive: true });

// Animate dashboard mock bars on load
window.addEventListener('load', () => {
  document.querySelectorAll('.mock-bar').forEach((bar, i) => {
    bar.style.opacity = '0';
    bar.style.transition = `opacity .4s ease ${0.1 + i * 0.05}s, height .5s ease ${0.1 + i * 0.05}s`;
    setTimeout(() => { bar.style.opacity = '1'; }, 100);
  });
});
