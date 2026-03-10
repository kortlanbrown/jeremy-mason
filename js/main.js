// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Inline video cards
document.querySelectorAll('.insta-card').forEach(card => {
  const vid = card.querySelector('.insta-video-inline');

  // Force first frame to render as thumbnail
  vid.addEventListener('loadedmetadata', () => { vid.currentTime = 0.1; });
  vid.addEventListener('seeked', () => { /* frame now painted */ }, { once: true });
  const overlay = card.querySelector('.insta-play-overlay');
  const fill = card.querySelector('.insta-progress-fill');
  const followCard = card.querySelector('.insta-follow-card');
  let timer = null;

  function endPreview() {
    vid.pause();
    clearInterval(progressInterval);
    clearTimeout(timer);
    fill.style.width = '100%';
    followCard.hidden = false;
    overlay.style.display = 'none';
  }

  let progressInterval = null;

  function startProgress() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      const pct = Math.min((vid.currentTime / Math.min(15, vid.duration || 15)) * 100, 100);
      fill.style.width = pct + '%';
    }, 100);
  }

  card.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let follow link work
    if (!followCard.hidden) return;

    if (vid.paused) {
      // pause all other cards first
      document.querySelectorAll('.insta-video-inline').forEach(v => {
        if (v !== vid) { v.pause(); v.closest('.insta-card').querySelector('.insta-play-overlay').style.display = ''; }
      });
      vid.currentTime = 0;
      vid.play();
      overlay.style.display = 'none';
      startProgress();
      clearTimeout(timer);
      timer = setTimeout(endPreview, 15000);
    } else {
      vid.pause();
      overlay.style.display = '';
      clearTimeout(timer);
      clearInterval(progressInterval);
    }
  });

  vid.addEventListener('ended', endPreview);
});

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.book-card, .social-card, .about-image-wrap, .about-text')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

// Visible class triggers animation
document.head.insertAdjacentHTML('beforeend', `
  <style>.visible { opacity: 1 !important; transform: none !important; }</style>
`);
