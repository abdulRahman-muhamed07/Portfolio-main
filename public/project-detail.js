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

    // Fetch data from JSON
    const response = await fetch('data.json');
    if (!response.ok) {
      throw new Error('Failed to load project data');
    }

    const data = await response.json();
    const projects = data.projects || [];

    // Find the project
    let project = null;
    if (projectId) {
      project = projects[parseInt(projectId)];
    } else {
      project = projects.find(p =>
        p.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() === projectName.toLowerCase()
      );
    }

    if (!project) {
      showError('Project not found');
      return;
    }

    // Populate the page with project data
    populateProjectData(project);

    // Hide loading spinner and show content
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    // Initialize all features after content is loaded
    initializeFeatures();

  } catch (error) {
    console.error('Error loading project data:', error);
    showError('Failed to load project data');
  }
}

// Show error message
function showError(message) {
  document.getElementById('loadingSpinner').style.display = 'none';
  document.getElementById('errorMessage').style.display = 'flex';
  document.getElementById('mainContent').style.display = 'none';
}

// Populate project data
function populateProjectData(project) {
  // Update page title
  document.getElementById('pageTitle').textContent = `${project.name} | Abdelrahman Mohamed`;
  document.title = `${project.name} | Abdelrahman Mohamed`;

  // Update hero section
  document.getElementById('projectTitle').textContent = project.name;
  document.getElementById('projectSubtitle').textContent = project.short_description;
  document.getElementById('projectDescription').textContent = project.description;

  // Update project cover
  const projectCover = document.getElementById('projectCover');
  projectCover.src = project.cover_image;
  projectCover.alt = `${project.name} Cover`;

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
      featureCard.innerHTML = `
        <h3><i class="${getFeatureIcon(feature)}"></i>${feature}</h3>
        <p>Advanced feature providing enhanced user experience and functionality.</p>
      `;
      featuresGrid.appendChild(featureCard);
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

  // Generate gallery
  const gallery = document.getElementById('projectGallery');
  gallery.innerHTML = '';
  if (project.media && project.media.length > 0) {
    project.media.forEach(media => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';

      if (media.type === 'screenshot' || media.type === 'gif') {
        galleryItem.innerHTML = `
          <img src="${media.url}" alt="${project.name} ${media.type}" loading="lazy" />
          <div class="gallery-overlay">
            <div class="gallery-type">${media.type === 'gif' ? 'Demo' : 'Screenshot'}</div>
          </div>
        `;
        gallery.appendChild(galleryItem);
      }
    });
  } else {
    // Show cover image if no media available
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
      <img src="${project.cover_image}" alt="${project.name} Cover" loading="lazy" />
      <div class="gallery-overlay">
        <div class="gallery-type">Cover</div>
      </div>
    `;
    gallery.appendChild(galleryItem);
  }
}

// Get project link icon based on type
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
  const iconMap = {
    'High-quality video courses': 'ti ti-video',
    'Secure authentication': 'ti ti-shield-check',
    'Advanced video streaming': 'ti ti-player-play',
    'Exams & assessments': 'ti ti-clipboard-check',
    'Transaction management': 'ti ti-credit-card',
    'Favorites & personalization': 'ti ti-heart',
    'Quran Recitation': 'ti ti-book-2',
    'Hadith Collections': 'ti ti-books',
    'Azkar': 'ti ti-rosette',
    'Qibla Direction': 'ti ti-compass',
    'Zakat Calculator': 'ti ti-calculator',
    'Custom-built Islamic Chatbot': 'ti ti-message-chatbot',
    'Light & Dark Mode Support': 'ti ti-moon-stars',
    'Speech-to-text exercises': 'ti ti-microphone',
    'Friendly text-to-speech output': 'ti ti-volume',
    'Handwriting practice': 'ti ti-writing',
    'Lottie animations': 'ti ti-player-play',
    'Firebase-synced content': 'ti ti-cloud',
    'AI-powered adaptive learning': 'ti ti-brain',
    'Interactive games': 'ti ti-device-gamepad-2',
    'Bilingual support': 'ti ti-language',
    'Disease search': 'ti ti-search',
    'Emergency case guides': 'ti ti-medical-cross',
    'Built-in emergency contacts': 'ti ti-phone',
    'Hospital locator': 'ti ti-map-pin',
    'First aid videos': 'ti ti-video',
    'Daily health tips': 'ti ti-bulb',
    'Medication tracking': 'ti ti-pill',
    'Appointment reminders': 'ti ti-calendar',
    'Local notifications': 'ti ti-bell',
    'User profile management': 'ti ti-user',
    'Account overview': 'ti ti-chart-pie',
    'Transaction history': 'ti ti-history',
    'Money transfers': 'ti ti-arrows-exchange',
    'Bill payments': 'ti ti-receipt',
    'Financial analytics': 'ti ti-chart-line',
    'Responsive design': 'ti ti-device-mobile'
  };

  // Find matching feature by checking if any key is included in the feature string
  for (const [key, icon] of Object.entries(iconMap)) {
    if (feature.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }

  return 'ti ti-star'; // Default icon
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

  // Initialize gallery
  initializeGallery();

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

// Gallery System
function initializeGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const imageModal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');
  const modalClose = document.getElementById('imageModalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  if (!imageModal || galleryItems.length === 0) return;

  let currentImageIndex = 0;
  const images = Array.from(galleryItems).filter(item =>
    item.querySelector('img') && !item.querySelector('video')
  );

  // Open modal
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const video = item.querySelector('video');

    if (img && !video) {
      item.addEventListener('click', () => {
        currentImageIndex = images.indexOf(item);
        openImageModal(img.src, img.alt);
      });
    }
  });

  function openImageModal(src, alt) {
    modalImage.src = src;
    modalImage.alt = alt;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Update navigation buttons
    modalPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
    modalNext.style.display = currentImageIndex < images.length - 1 ? 'flex' : 'none';
  }

  function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrevImage() {
    if (currentImageIndex > 0) {
      currentImageIndex--;
      const img = images[currentImageIndex].querySelector('img');
      modalImage.src = img.src;
      modalImage.alt = img.alt;

      modalPrev.style.display = currentImageIndex > 0 ? 'flex' : 'none';
      modalNext.style.display = 'flex';
    }
  }

  function showNextImage() {
    if (currentImageIndex < images.length - 1) {
      currentImageIndex++;
      const img = images[currentImageIndex].querySelector('img');
      modalImage.src = img.src;
      modalImage.alt = img.alt;

      modalNext.style.display = currentImageIndex < images.length - 1 ? 'flex' : 'none';
      modalPrev.style.display = 'flex';
    }
  }

  // Event listeners
  modalClose.addEventListener('click', closeImageModal);
  modalPrev.addEventListener('click', showPrevImage);
  modalNext.addEventListener('click', showNextImage);

  // Close on backdrop click
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal || e.target.classList.contains('image-modal__backdrop')) {
      closeImageModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (imageModal.classList.contains('active')) {
      switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          showPrevImage();
          break;
        case 'ArrowRight':
          showNextImage();
          break;
      }
    }
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
