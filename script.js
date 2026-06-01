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

initFilter('hinge-filters', 'hinges-grid');
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
const productData = {
  'Stainless Steel Butt Hinge': {
    category: 'Butt Hinge',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Size', value: '4" × 3" × 2.5mm' },
      { label: 'Finish', value: 'Satin' },
      { label: 'Weight', value: '120g' },
      { label: 'Load Capacity', value: 'Up to 40kg per hinge' },
      { label: 'Screws Included', value: 'Yes (8 pcs)' },
    ],
    description: 'Our most popular butt hinge, crafted from premium SS 304 stainless steel. The satin finish resists fingerprints and blends seamlessly with modern door frames. Features precision ball bearings for ultra-smooth operation and is corrosion-resistant for both interior and exterior use.',
    price: '₹185 / piece',
  },
  'Brass Butt Hinge — Antique': {
    category: 'Butt Hinge',
    specs: [
      { label: 'Material', value: 'Solid Brass' },
      { label: 'Size', value: '4" × 3" × 3mm' },
      { label: 'Finish', value: 'Antique Bronze' },
      { label: 'Weight', value: '160g' },
      { label: 'Load Capacity', value: 'Up to 35kg per hinge' },
      { label: 'Screws Included', value: 'Yes (8 pcs)' },
    ],
    description: 'A beautifully crafted solid brass hinge with an antique bronze finish. Perfect for heritage restoration, vintage-style interiors, and premium wooden doors. Each hinge is individually finished to create a unique, time-honored appearance.',
    price: '₹320 / piece',
  },
  'Heavy Duty Barrel Hinge': {
    category: 'Barrel Hinge',
    specs: [
      { label: 'Material', value: 'Stainless Steel 316' },
      { label: 'Size', value: '3" × 1.5"' },
      { label: 'Finish', value: 'Mirror Polish' },
      { label: 'Load Capacity', value: 'Up to 80kg' },
      { label: 'Rotation', value: '360°' },
      { label: 'Application', value: 'Gates & Heavy Doors' },
    ],
    description: 'Heavy-duty barrel hinge designed for gates, industrial doors, and high-traffic applications. Made from marine-grade SS 316 stainless steel for exceptional corrosion resistance. The mirror polish finish adds a professional aesthetic to any installation.',
    price: '₹450 / piece',
  },
  'Compact Barrel Hinge': {
    category: 'Barrel Hinge',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Size', value: '2" × 1"' },
      { label: 'Finish', value: 'Brushed' },
      { label: 'Load Capacity', value: 'Up to 40kg' },
      { label: 'Rotation', value: '270°' },
      { label: 'Application', value: 'Cabinets & Lightweight Doors' },
    ],
    description: 'Compact and versatile barrel hinge ideal for cabinet doors, small gates, and lightweight applications. The brushed stainless steel finish provides a contemporary look while maintaining excellent durability and smooth rotation.',
    price: '₹280 / piece',
  },
  'Parliament Hinge — Wide Throw': {
    category: 'Parliament Hinge',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Size', value: '5" × 4" × 3mm' },
      { label: 'Finish', value: 'Satin Chrome' },
      { label: 'Opening Angle', value: '180°' },
      { label: 'Load Capacity', value: 'Up to 50kg per hinge' },
      { label: 'Application', value: 'Wide-opening doors' },
    ],
    description: 'Parliament hinges with extended leaves that allow doors to open a full 180° — clearing architraves and thick frames. Essential for accessibility compliance and wide-opening requirements. Satin chrome finish for a sleek, modern appearance.',
    price: '₹520 / piece',
  },
  'Soft-Close Concealed Hinge': {
    category: 'Concealed Hinge',
    specs: [
      { label: 'Material', value: 'Steel + Nickel Plating' },
      { label: 'Cup Size', value: '35mm' },
      { label: 'Finish', value: 'Nickel Plated' },
      { label: 'Opening Angle', value: '110°' },
      { label: 'Soft-Close', value: 'Integrated damper' },
      { label: 'Overlay', value: 'Full overlay' },
    ],
    description: 'Premium concealed hinge with integrated soft-close mechanism. Perfect for kitchen cabinets, wardrobes, and furniture. The clip-on design allows for tool-free mounting and 3-dimensional adjustment for perfect door alignment every time.',
    price: '₹95 / piece',
  },
  'Lever Door Handle — Modern': {
    category: 'Door Handle',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Length', value: '130mm' },
      { label: 'Finish', value: 'Satin Nickel' },
      { label: 'Type', value: 'Lever on Rose' },
      { label: 'Rose Diameter', value: '52mm' },
      { label: 'Spindle', value: '8mm square included' },
    ],
    description: 'Sleek, modern lever handle with a minimalist design. The ergonomic lever provides comfortable grip and smooth return action. Rose-mounted design for clean aesthetics. Suitable for interior doors in residential and commercial projects.',
    price: '₹850 / pair',
  },
  'Round Pull Handle — Minimal': {
    category: 'Door Handle',
    specs: [
      { label: 'Material', value: 'Solid Brass' },
      { label: 'Diameter', value: '50mm' },
      { label: 'Finish', value: 'PVD Gold' },
      { label: 'Type', value: 'Flush Pull' },
      { label: 'Depth', value: '8mm recess' },
      { label: 'Application', value: 'Sliding Doors' },
    ],
    description: 'Ultra-minimal flush pull handle designed for sliding doors and pocket doors. Crafted from solid brass with a luxurious PVD gold finish that is scratch-resistant and maintains its lustre for years. The recessed design sits flush with the door surface.',
    price: '₹1,200 / piece',
  },
  'Mortise Door Lock — Security': {
    category: 'Door Lock',
    specs: [
      { label: 'Material', value: 'Stainless Steel Body' },
      { label: 'Center Distance', value: '85mm' },
      { label: 'Finish', value: 'Satin Steel' },
      { label: 'Type', value: '3-Lever Mortise' },
      { label: 'Backset', value: '60mm' },
      { label: 'Keys', value: '3 keys included' },
    ],
    description: 'High-security 3-lever mortise lock designed for residential front doors. The stainless steel body ensures long-lasting durability, while the precision-machined levers provide reliable locking action. Comes with 3 keys and a strike plate.',
    price: '₹680 / piece',
  },
  'Magnetic Door Stopper': {
    category: 'Door Stopper',
    specs: [
      { label: 'Material', value: 'Zinc Alloy' },
      { label: 'Height', value: '45mm' },
      { label: 'Finish', value: 'Chrome' },
      { label: 'Mount Type', value: 'Floor Mount' },
      { label: 'Magnet', value: 'Neodymium' },
      { label: 'Hold Force', value: '3kg' },
    ],
    description: 'Elegant magnetic door stopper that holds doors open securely. The powerful neodymium magnet provides firm hold while the zinc alloy body ensures durability. Floor-mounted design with minimal visual footprint. Includes a matching door-mounted catch plate.',
    price: '₹220 / piece',
  },
  'Hydraulic Door Closer': {
    category: 'Door Closer',
    specs: [
      { label: 'Material', value: 'Aluminium Body' },
      { label: 'Weight Capacity', value: 'Up to 65kg' },
      { label: 'Finish', value: 'Silver' },
      { label: 'Closing Speed', value: 'Adjustable' },
      { label: 'Latching Speed', value: 'Adjustable' },
      { label: 'Backcheck', value: 'Yes' },
    ],
    description: 'Professional-grade hydraulic door closer with adjustable closing and latching speeds. The backcheck feature prevents doors from slamming open. Suitable for interior and light exterior doors up to 65kg. Easy to install with included template and fixings.',
    price: '₹1,450 / piece',
  },
  'Wall-Mount Door Stopper': {
    category: 'Door Stopper',
    specs: [
      { label: 'Material', value: 'Stainless Steel 304' },
      { label: 'Projection', value: '75mm' },
      { label: 'Finish', value: 'Brushed SS' },
      { label: 'Mount Type', value: 'Wall Mount' },
      { label: 'Bumper', value: 'Silicone Tip' },
      { label: 'Fixings', value: 'Included' },
    ],
    description: 'Wall-mounted door stopper with a soft silicone tip to prevent wall and door damage. The brushed stainless steel body complements modern interiors. Simple installation with included wall plugs and screws. Designed to handle heavy doors with ease.',
    price: '₹175 / piece',
  },
};

function openModal(productName) {
  const modal = document.getElementById('product-modal');
  const data = productData[productName];
  if (!modal || !data) return;

  document.getElementById('modal-title').textContent = productName;
  document.getElementById('modal-category').textContent = data.category;
  document.getElementById('modal-desc').textContent = data.description;

  const specsGrid = document.getElementById('modal-specs');
  specsGrid.innerHTML = data.specs.map(spec => `
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
