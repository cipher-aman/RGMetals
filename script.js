/* ========================================
   RG Metals — Interactive JavaScript
   ======================================== */

// ===== Particles Background =====
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() * 40 + 20; // gold range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          this.x -= dx * force * 0.01;
          this.y -= dy * force * 0.01;
        }
      }

      // Wrap
      if (this.x > canvas.width + 10) this.x = -10;
      if (this.x < -10) this.x = canvas.width + 10;
      if (this.y > canvas.height + 10) this.y = -10;
      if (this.y < -10) this.y = canvas.height + 10;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 60%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(245, 158, 11, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });
})();


// ===== Navbar Scroll Effect =====
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const navToggle = document.getElementById('nav-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinksContainer.classList.toggle('open');
    });

    // Close on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('open');
      });
    });
  }
})();


// ===== Counter Animation =====
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let hasAnimated = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 10000) {
          counter.textContent = current.toLocaleString();
        } else {
          counter.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          if (target >= 10000) {
            counter.textContent = target.toLocaleString();
          } else {
            counter.textContent = target;
          }
        }
      }

      requestAnimationFrame(updateCount);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) observer.observe(statsSection);
})();


// ===== Scroll Reveal =====
(function initScrollReveal() {
  // Add reveal class to elements
  const revealTargets = document.querySelectorAll(
    '.category-card, .product-card, .why-card, .section-header, .contact-card'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation
        const delay = Array.from(entry.target.parentElement.children)
          .filter(c => c.classList.contains('reveal'))
          .indexOf(entry.target);
        
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 100);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealTargets.forEach(el => observer.observe(el));
})();


// ===== Product Filter =====
function initFilter(filterBarId, gridId) {
  const filterBar = document.getElementById(filterBarId);
  const grid = document.getElementById(gridId);
  if (!filterBar || !grid) return;

  const buttons = filterBar.querySelectorAll('.filter-btn');
  const cards = grid.querySelectorAll('.product-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.5s ease-out forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// Only accessories have filters now (hinges have no filters)
initFilter('accessory-filters', 'accessories-grid');


// ===== 3D Tower Bolt Mouse Tracking =====
(function initBoltTracking() {
  const bolt = document.getElementById('floating-bolt');
  const hero = document.querySelector('.hero');
  if (!bolt || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateY = x * 30;
    const rotateX = -y * 20;

    bolt.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
  });

  hero.addEventListener('mouseleave', () => {
    bolt.style.transform = '';
    bolt.style.transition = 'transform 0.8s ease-out';
    setTimeout(() => {
      bolt.style.transition = '';
    }, 800);
  });
})();


// ===== Product Card 3D Tilt =====
(function initCardTilt() {
  const cards = document.querySelectorAll('.product-card-inner');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      card.style.transition = 'transform 0.5s ease-out';
      setTimeout(() => {
        card.style.transition = 'var(--transition-smooth)';
      }, 500);
    });
  });
})();


// ===== Product Modal =====
// Generic specs used for all products (will be populated with real data later)
const defaultSpecs = [
  { label: 'Material', value: '-------' },
  { label: 'Size', value: '-------' },
  { label: 'Finish', value: '-------' },
  { label: 'Weight', value: '-------' },
];

// Map product names to their image paths and categories
function getProductInfo(productName) {
  const name = productName.toLowerCase();
  let category = 'Accessory';
  let imagePath = '';

  if (name.startsWith('tower bolt')) {
    category = 'Tower Bolt';
    const num = name.replace('tower bolt ', '');
    imagePath = `images/towerbolt_${num}.jpg`;
  } else if (name.startsWith('handle')) {
    category = 'Handle';
    if (name.includes('(3 handles)')) {
      imagePath = 'images/handle_4 (3 handles).jpg';
    } else {
      const num = name.replace('handle ', '');
      imagePath = `images/handle_${num}.jpg`;
    }
  } else if (name.startsWith('stopper')) {
    category = 'Stopper';
    const num = name.replace('stopper ', '');
    imagePath = `images/stopper_${num}.jpg`;
  } else if (name.startsWith('hinge')) {
    category = 'Hinge';
    const num = name.replace('hinge ', '');
    imagePath = `images/hinge_${num}.jpg`;
  }

  return { category, imagePath };
}

function openModal(productName) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;

  const info = getProductInfo(productName);

  document.getElementById('modal-title').textContent = productName;
  document.getElementById('modal-category').textContent = info.category;
  document.getElementById('modal-desc').textContent = 'Product specifications will be updated soon. Contact us for detailed information about this product.';

  // Update modal image
  const imageContainer = document.getElementById('modal-image-container');
  if (imageContainer && info.imagePath) {
    imageContainer.innerHTML = `<img src="${info.imagePath}" alt="${productName}" class="product-image" style="height: 100%; min-height: 300px; border-radius: var(--radius-md);">`;
  }

  const specsGrid = document.getElementById('modal-specs');
  specsGrid.innerHTML = defaultSpecs.map(spec => `
    <div class="spec">
      <span class="spec-label">${spec.label}</span>
      <span class="spec-value">${spec.value}</span>
    </div>
  `).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on overlay click
document.getElementById('product-modal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});


// ===== Contact Form =====
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const originalText = btn.innerHTML;

  btn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style="animation: spin 1s linear infinite">
      <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10" fill="none"/>
    </svg>
    Sending...
  `;
  btn.disabled = true;

  // Simulate submission
  setTimeout(() => {
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10l4 4 8-8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Sent Successfully!
    `;
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.background = '';
      document.getElementById('contact-form').reset();
    }, 3000);
  }, 1500);
}

// Add spin animation
const style = document.createElement('style');
style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(style);


// ===== Smooth Scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const offset = 80;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});
