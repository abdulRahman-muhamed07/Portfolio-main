// Project Detail Page JavaScript
document.addEventListener('DOMContentLoaded', function () {
  // Load project data first
  loadProjectData();
});

// Get URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Load project data dynamically
async function loadProjectData() {
  try {
    // Get project parameter from URL
    const projectName = getUrlParameter('project');
    const projectId = getUrlParameter('id');

    if (!projectName && !projectId) {
      showError('No project specified');
      return;
    }

    // Fetch data from a stable URL so the project page works from any deployed path.
    const dataUrl = new URL('/data.json?v=20260930', window.location.origin).href;
    const response = await fetch(dataUrl, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load data.json (HTTP ${response.status})`);
    }

    const data = await response.json();
    const projects = Array.isArray(data.projects) ? data.projects : [];

    // Find the project using a stable id/slug, with a name fallback for older links.
    let project = null;
    if (projectId) {
      project = projects.find(p => String(p.id || p.slug) === String(projectId));
      if (!project && /^\d+$/.test(projectId)) {
        project = projects[parseInt(projectId)];
      }
    }
    if (!project && projectName) {
      project = projects.find(p =>
        String(p.slug || p.name)
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim() === String(projectName).toLowerCase()
      );
    }

    if (!project) {
      throw new Error(`Project not found for id="${projectId || ''}" project="${projectName || ''}"`);
    }

    // Populate first so the page is usable even if optional visual effects fail.
    populateProjectData(project);

    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    // UI effects are optional; a failure here must not turn a valid project into a loading error.
    try {
      initializeFeatures();
    } catch (featureError) {
      console.warn('Optional project-page enhancement failed:', featureError);
    }

  } catch (error) {
    console.error('Error loading project data:', error);
    showError('Failed to load project data', error?.message || 'The project data could not be loaded.');
  }
}

// Show error message
function showError(title = 'Project Not Found', message = 'The requested project could not be found.') {
  document.getElementById('loadingSpinner').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'flex';
  document.getElementById('mainContent').style.display = 'none';
  const errorTitle = document.getElementById('errorTitle');
  const errorDescription = document.getElementById('errorDescription');
  if (errorTitle) errorTitle.textContent = title;
  if (errorDescription) errorDescription.textContent = message;
}

// Populate project data
function populateProjectData(project) {
  // Update page title and social preview metadata
  const pageTitle = `${project.name} | Abdelrahman Elsepaay`;
  const metaDescription = project.short_description || project.description || 'Backend project by Abdelrahman Elsepaay.';
  document.getElementById('pageTitle').textContent = pageTitle;
  document.title = pageTitle;
  document.getElementById('metaDescription')?.setAttribute('content', metaDescription);
  document.getElementById('ogTitle')?.setAttribute('content', pageTitle);
  document.getElementById('ogDescription')?.setAttribute('content', metaDescription);
  document.getElementById('twitterTitle')?.setAttribute('content', pageTitle);
  document.getElementById('twitterDescription')?.setAttribute('content', metaDescription);
  document.getElementById('canonicalLink')?.setAttribute('href', window.location.href);
  document.getElementById('ogImage')?.setAttribute('content', new URL(project.cover_image, window.location.href).href);
  document.getElementById('twitterImage')?.setAttribute('content', new URL(project.cover_image, window.location.href).href);

  // Update hero section
  document.getElementById('projectTitle').textContent = project.name;
  document.getElementById('projectSubtitle').textContent = project.short_description;
  document.getElementById('projectDescription').textContent = project.description;

  const projectMeta = document.getElementById('projectMeta');
  if (projectMeta) {
    projectMeta.innerHTML = [project.category, project.role].filter(Boolean).map(value => `<span>${escapeHtml(value)}</span>`).join('');
  }

  // Update project cover
  const projectCover = document.getElementById('projectCover');
  projectCover.src = project.cover_image;
  projectCover.alt = `${project.name} project preview`;
  projectCover.onerror = () => { projectCover.onerror = null; projectCover.src = 'assets/covers/dummy.png'; };

  // Generate project links
  const linksContainer = document.getElementById('projectLinks');
  linksContainer.innerHTML = '';
  if (project.links && project.links.length > 0) {
    project.links.forEach((link, index) => {
      const isPrimary = index === 0 ? 'primary' : '';
      const linkEl = document.createElement('a');
      linkEl.className = `project-link ${isPrimary}`;
      linkEl.href = link.url;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.innerHTML = `
        <i class="${getLinkIcon(link.type)}"></i>
        <span>${link.type}</span>
      `;
      linksContainer.appendChild(linkEl);
    });
  }

  // Generate features
  const featuresGrid = document.getElementById('featuresGrid');
  featuresGrid.innerHTML = '';
  if (project.features && project.features.length > 0) {
    project.features.forEach(feature => {
      const featureCard = document.createElement('div');
      featureCard.className = 'feature-card';
      featureCard.innerHTML = `<h3><i class="${getFeatureIcon(feature)}"></i>${escapeHtml(feature)}</h3>`;
      featuresGrid.appendChild(featureCard);
    });
  }

  // Generate engineering highlights
  const engineeringGrid = document.getElementById('engineeringGrid');
  if (engineeringGrid) {
    engineeringGrid.innerHTML = '';
    (project.engineering_highlights || []).forEach(item => {
      const card = document.createElement('article');
      card.className = 'engineering-card';
      card.innerHTML = `
        <div class="engineering-card__icon"><i class="${escapeHtml(item.icon || 'ti ti-code')}"></i></div>
        <div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.text)}</p>
        </div>`;
      engineeringGrid.appendChild(card);
    });
  }

  // Generate architecture flow
  const architectureFlow = document.getElementById('architectureFlow');
  if (architectureFlow) {
    architectureFlow.innerHTML = '';
    (project.architecture_flow || []).forEach((step, index, steps) => {
      const node = document.createElement('div');
      node.className = 'architecture-node';
      node.innerHTML = `<span>${index + 1}</span><strong>${escapeHtml(step)}</strong>`;
      architectureFlow.appendChild(node);
      if (index < steps.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'architecture-arrow';
        arrow.innerHTML = '<i class="ti ti-arrow-right"></i>';
        architectureFlow.appendChild(arrow);
      }
    });
  }

  // Generate technologies
  const techGrid = document.getElementById('techGrid');
  techGrid.innerHTML = '';
  if (project.technologies_used && project.technologies_used.length > 0) {
    project.technologies_used.forEach(tech => {
      const techChip = document.createElement('div');
      techChip.className = 'tech-chip';
      techChip.textContent = tech;
      techGrid.appendChild(techChip);
    });
  }

  // Initialize the four-image project carousel
  const carouselMainImage = document.getElementById('carouselMainImage');
  const carouselCaption = document.getElementById('carouselCaption');
  const carouselSource = document.getElementById('carouselSource');
  const carouselCounter = document.getElementById('carouselCounter');
  const carouselThumbs = document.getElementById('carouselThumbs');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');
  const referenceBadge = document.getElementById('carouselReferenceBadge');

  const mediaItems = (project.media || []).filter(media => media.url).slice(0, 4);
  let currentCarouselIndex = 0;

  function renderCarouselImage(index) {
    if (!carouselMainImage || !mediaItems.length) return;
    currentCarouselIndex = (index + mediaItems.length) % mediaItems.length;
    const media = mediaItems[currentCarouselIndex];

    carouselMainImage.onerror = () => {
      carouselMainImage.onerror = null;
      carouselMainImage.src = project.cover_image;
    };
    carouselMainImage.src = media.url;
    carouselMainImage.alt = `${project.name} — ${media.label || 'UI reference'}`;
    carouselCaption.textContent = media.label || 'UI Reference';
    carouselSource.textContent = media.source_name ? `Source: ${media.source_name}` : 'External UI reference';
    carouselCounter.textContent = `${currentCarouselIndex + 1} / ${mediaItems.length}`;
    referenceBadge.textContent = media.type === 'reference-ui' ? 'Reference UI' : 'Project Media';

    carouselThumbs?.querySelectorAll('.carousel-thumb').forEach((thumb, thumbIndex) => {
      thumb.classList.toggle('active', thumbIndex === currentCarouselIndex);
      thumb.setAttribute('aria-current', thumbIndex === currentCarouselIndex ? 'true' : 'false');
    });

    if (carouselPrev) carouselPrev.style.display = mediaItems.length > 1 ? 'grid' : 'none';
    if (carouselNext) carouselNext.style.display = mediaItems.length > 1 ? 'grid' : 'none';
  }

  if (carouselThumbs) {
    carouselThumbs.innerHTML = '';
    mediaItems.forEach((media, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'carousel-thumb';
      button.setAttribute('aria-label', `Show ${media.label || 'image'}`);
      button.innerHTML = `
        <img src="${escapeHtml(media.url)}" alt="" loading="lazy" decoding="async" />
        <span>${escapeHtml(media.label || `Image ${index + 1}`)}</span>
      `;
      button.addEventListener('click', () => renderCarouselImage(index));
      carouselThumbs.appendChild(button);
    });
  }

  carouselPrev?.addEventListener('click', () => renderCarouselImage(currentCarouselIndex - 1));
  carouselNext?.addEventListener('click', () => renderCarouselImage(currentCarouselIndex + 1));

  renderCarouselImage(0);

}

// Get project link icon based on type
function escapeHtml(str) {
  return (str || '').toString().replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function getLinkIcon(type) {
  const icons = {
    'GitHub': 'ti ti-brand-github',
    'Google Play': 'ti ti-brand-google-play',
    'App Store': 'ti ti-brand-apple',
    'Google Drive': 'ti ti-brand-google-drive',
    'Live Demo': 'ti ti-external-link',
    'Website': 'ti ti-world'
  };
  return icons[type] || 'ti ti-external-link';
}

// Generate feature icons
function getFeatureIcon(feature) {
  const lower = feature.toLowerCase();
  if (lower.includes('clean architecture')) return 'ti ti-building-arch';
  if (lower.includes('jwt') || lower.includes('authentication')) return 'ti ti-shield-lock';
  if (lower.includes('role-based') || lower.includes('rbac')) return 'ti ti-user-shield';
  if (lower.includes('sql') || lower.includes('ef core') || lower.includes('repository')) return 'ti ti-database';
  if (lower.includes('pagination') || lower.includes('search') || lower.includes('filtering')) return 'ti ti-filter';
  if (lower.includes('docker')) return 'ti ti-brand-docker';
  if (lower.includes('swagger')) return 'ti ti-file-type-json';
  if (lower.includes('booking')) return 'ti ti-calendar-check';
  if (lower.includes('favorites')) return 'ti ti-heart';
  if (lower.includes('reviews')) return 'ti ti-star';
  if (lower.includes('invoice') || lower.includes('payment')) return 'ti ti-receipt';
  if (lower.includes('inventory') || lower.includes('product')) return 'ti ti-package';
  if (lower.includes('hr') || lower.includes('employee')) return 'ti ti-users';

  const iconMap = {
    'workflow': 'ti ti-route',
    'architecture': 'ti ti-building-arch',
    'jwt': 'ti ti-shield-lock',
    'role-based': 'ti ti-user-shield',
    'sql': 'ti ti-database',
    'health': 'ti ti-heart-rate-monitor',
    'docker': 'ti ti-brand-docker',
    'swagger': 'ti ti-file-type-json',
    'booking': 'ti ti-calendar-check',
    'favorite': 'ti ti-heart',
    'review': 'ti ti-star',
    'invoice': 'ti ti-receipt',
    'payment': 'ti ti-credit-card',
    'inventory': 'ti ti-package',
    'employee': 'ti ti-users',
    'test': 'ti ti-test-pipe',
    'ci': 'ti ti-brand-github'
  };

  // Find matching feature by keyword.
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lower.includes(key)) return icon;
  }

  return 'ti ti-star';
}

// Initialize all features after content loads
function initializeFeatures() {
  // Initialize AOS
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  });

  // Initialize theme system
  initializeTheme();

  // Initialize particles
  initializeParticles();

  // Initialize cursor follower
  initializeCursorFollower();

  // Initialize mobile navigation
  initializeMobileNav();

  // Initialize back to top button
  initializeBackToTop();

  // The project page now uses the dedicated four-image carousel initialized in populateProjectData().

  // Set current year
  document.getElementById('year').textContent = new Date().getFullYear();
}

// Theme Management
function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', function () {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggle i');
  icon.className = theme === 'dark' ? 'ti ti-sun' : 'ti ti-moon-stars';
}

// Particles System
function initializeParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1
    };
  }

  function initParticles() {
    particles = [];
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 30));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

    particles.forEach(particle => {
      ctx.globalAlpha = particle.opacity;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }

  function animate() {
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  resizeCanvas();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
}

// Cursor Follower
function initializeCursorFollower() {
  const cursorFollower = document.getElementById('cursorFollower');
  if (!cursorFollower) return;

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(updateFollower);
  }

  updateFollower();

  // Interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .gallery-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(2)';
      cursorFollower.style.opacity = '0.3';
    });

    el.addEventListener('mouseleave', () => {
      cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorFollower.style.opacity = '0.6';
    });
  });
}

// Mobile Navigation
function initializeMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close nav on link click (mobile)
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });
}

// Back to Top
function initializeBackToTop() {
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.style.opacity = '1';
      backToTop.style.visibility = 'visible';
    } else {
      backToTop.style.opacity = '0';
      backToTop.style.visibility = 'hidden';
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Toast Notification System
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
