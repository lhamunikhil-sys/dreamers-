/* ============================================================
   main.js — 3D Portfolio Website
   ============================================================ */

'use strict';

/* ====================================================
   WAIT FOR LIBS TO LOAD
   ==================================================== */
window.addEventListener('load', () => {
  initAll();
});

function initAll() {
  initCursor();
  initNavbar();
  initHamburger();
  initHeroCanvas();
  initScrollReveal();
  initSkillBars();
  initCounters();
  initAbout3D();
  initContactForm();
  initServiceCardTilt();
  initTechIconSpin();
}

/* ====================================================
   CUSTOM CURSOR
   ==================================================== */
function initCursor() {
  if (window.innerWidth < 768) return;
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  const hoverEls = document.querySelectorAll('a, button, .service-card, .tech-item, .testimonial-card, input, select, textarea');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();
}

/* ====================================================
   NAVBAR SCROLL
   ==================================================== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* ====================================================
   HAMBURGER MENU
   ==================================================== */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  let open = false;
  btn.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  menu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      open = false;
      menu.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ====================================================
   THREE.JS HERO CANVAS
   ==================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 4;

  /* ---- Particles ---- */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);

  const palettePairs = [
    [new THREE.Color('#8b5cf6'), new THREE.Color('#6d28d9')],
    [new THREE.Color('#ec4899'), new THREE.Color('#be185d')],
    [new THREE.Color('#22d3ee'), new THREE.Color('#0891b2')],
    [new THREE.Color('#a78bfa'), new THREE.Color('#8b5cf6')],
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 1.5 + Math.random() * 6;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 2;

    const pair = palettePairs[Math.floor(Math.random() * palettePairs.length)];
    const c = pair[Math.floor(Math.random() * 2)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ---- Floating Wireframe Shapes ---- */
  const wireframeMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color('#8b5cf6'),
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const shapes = [];

  // Icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const ico = new THREE.Mesh(icoGeo, wireframeMat.clone());
  ico.position.set(-2.5, 0.5, -1);
  scene.add(ico);
  shapes.push({ mesh: ico, rotSpeed: { x: 0.003, y: 0.005 }, floatAmp: 0.15, floatFreq: 0.7 });

  // Octahedron
  const octGeo = new THREE.OctahedronGeometry(0.7, 0);
  const octMat = wireframeMat.clone();
  octMat.color = new THREE.Color('#ec4899');
  const oct = new THREE.Mesh(octGeo, octMat);
  oct.position.set(2.8, -0.4, -0.5);
  scene.add(oct);
  shapes.push({ mesh: oct, rotSpeed: { x: 0.006, y: 0.003 }, floatAmp: 0.2, floatFreq: 0.5 });

  // Torus
  const torGeo = new THREE.TorusGeometry(0.55, 0.18, 8, 24);
  const torMat = wireframeMat.clone();
  torMat.color = new THREE.Color('#22d3ee');
  torMat.opacity = 0.15;
  const tor = new THREE.Mesh(torGeo, torMat);
  tor.position.set(1.2, 1.6, -1.5);
  scene.add(tor);
  shapes.push({ mesh: tor, rotSpeed: { x: 0.008, y: 0.004 }, floatAmp: 0.1, floatFreq: 0.9 });

  // Second torus (back)
  const tor2Geo = new THREE.TorusGeometry(0.8, 0.12, 6, 20);
  const tor2Mat = wireframeMat.clone();
  tor2Mat.color = new THREE.Color('#a78bfa');
  tor2Mat.opacity = 0.07;
  const tor2 = new THREE.Mesh(tor2Geo, tor2Mat);
  tor2.position.set(-1.5, -1.8, -2);
  scene.add(tor2);
  shapes.push({ mesh: tor2, rotSpeed: { x: 0.002, y: 0.007 }, floatAmp: 0.25, floatFreq: 0.4 });

  /* ---- Mouse Parallax ---- */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---- Resize ---- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ---- Animation Loop ---- */
  let clock = typeof THREE !== 'undefined' ? new THREE.Clock() : null;
  const basePositions = positions.slice();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock ? clock.getElapsedTime() : 0;

    // Smooth mouse follow
    targetX += (mouseX * 0.3 - targetX) * 0.05;
    targetY += (mouseY * 0.2 - targetY) * 0.05;

    // Rotate particles
    particles.rotation.y = elapsed * 0.04 + targetX * 0.3;
    particles.rotation.x = elapsed * 0.02 + targetY * 0.15;

    // Animate floating shapes
    shapes.forEach((s, i) => {
      s.mesh.rotation.x += s.rotSpeed.x;
      s.mesh.rotation.y += s.rotSpeed.y;
      s.mesh.position.y += Math.sin(elapsed * s.floatFreq + i) * 0.003;
      s.mesh.position.x += Math.cos(elapsed * (s.floatFreq * 0.6) + i) * 0.002;
    });

    // Camera subtle drift
    camera.position.x += (targetX * 0.5 - camera.position.x) * 0.04;
    camera.position.y += (-targetY * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();
}

/* ====================================================
   SCROLL REVEAL
   ==================================================== */
function initScrollReveal() {
  const addClasses = () => {
    // Sections
    document.querySelectorAll('section > .container, .marquee-wrapper').forEach(el => {
      el.querySelectorAll('.service-card, .project-item, .tech-item, .testimonial-card').forEach(child => {
        if (!child.classList.contains('reveal')) child.classList.add('reveal');
      });
    });
    document.querySelectorAll('.about-text').forEach(el => el.classList.add('reveal-right'));
    document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
    document.querySelectorAll('.section-header, .contact-info, .contact-form').forEach(el => el.classList.add('reveal'));
  };
  addClasses();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Stagger children
        const siblings = Array.from(el.parentNode.children).filter(c =>
          c.classList.contains('reveal') || c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
        );
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = (idx * 0.08) + 's';
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ====================================================
   SKILL BARS
   ==================================================== */
function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill').forEach(fill => fill.classList.add('animated'));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillSection = document.querySelector('.skill-bars');
  if (skillSection) observer.observe(skillSection);
}

/* ====================================================
   COUNTER ANIMATION
   ==================================================== */
function initCounters() {
  const stats = document.querySelectorAll('.stat');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statEl = entry.target;
        const target = parseInt(statEl.getAttribute('data-count'));
        const numEl = statEl.querySelector('.stat-num');
        if (!numEl) return;

        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          start = Math.round(eased * target);
          numEl.textContent = start;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(statEl);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}

/* ====================================================
   ABOUT CARD 3D TILT
   ==================================================== */
function initAbout3D() {
  const card = document.getElementById('aboutCard');
  if (!card) return;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / (rect.height / 2)) * 12;
    const rotY = (x / (rect.width / 2)) * 12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
}

/* ====================================================
   SERVICE CARD TILT
   ==================================================== */
function initServiceCardTilt() {
  document.querySelectorAll('.service-card:not(.service-card--cta)').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 5;
      const rotY = (x / (rect.width / 2)) * 5;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
}

/* ====================================================
   TECH ICON 3D SPIN ON HOVER
   ==================================================== */
function initTechIconSpin() {
  document.querySelectorAll('.tech-item').forEach(item => {
    const icon = item.querySelector('.tech-icon');
    if (!icon) return;
    item.addEventListener('mouseenter', () => {
      icon.style.animation = 'none';
      icon.offsetHeight; // reflow
      icon.style.transition = 'transform 0.8s ease';
      icon.style.transform = 'rotateY(360deg)';
    });
    item.addEventListener('mouseleave', () => {
      icon.style.transform = 'rotateY(0deg)';
    });
  });
}

/* ====================================================
   CONTACT FORM
   ==================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const original = span.textContent;

    // Loading state
    span.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Simulate send (replace with actual fetch/EmailJS/FormSubmit)
    setTimeout(() => {
      span.textContent = original;
      btn.disabled = false;
      btn.style.opacity = '';
      form.reset();
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1500);
  });
}

/* ====================================================
   SMOOTH ANCHOR SCROLL
   ==================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ====================================================
   MARQUEE PAUSE ON HOVER
   ==================================================== */
const track = document.querySelector('.marquee-track');
if (track) {
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
}
