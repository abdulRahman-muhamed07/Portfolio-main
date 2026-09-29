// Theme handling
const THEME_KEY = 'theme-preference';
const root = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');

function setTheme(mode) {
  root.setAttribute('data-theme', mode);
  try { localStorage.setItem(THEME_KEY, mode); } catch {}
  themeToggleBtn.innerHTML = mode === 'dark' ? '<i class="ti ti-sun"></i>' : '<i class="ti ti-moon-stars"></i>';
}

(function initTheme() {
  let saved = 'dark';
  try { saved = localStorage.getItem(THEME_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); } catch {}
  setTheme(saved);
})();

themeToggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Toggle menu open/close
navToggle?.addEventListener('click', () => navLinks.classList.toggle('show'));

// Close menu when a nav link is clicked
if (navLinks) {
  const navLinkItems = navLinks.querySelectorAll('a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('show');
    });
  });
}

// Close menu when clicking outside of it
document.addEventListener('click', (e) => {
  if (navLinks && navLinks.classList.contains('show')) {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('show');
    }
  }
});

// Back to top
const backToTop = document.getElementById('backToTop');
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.getElementById('year').textContent = new Date().getFullYear();

// Animate On Scroll
AOS.init({
  once: true,
  duration: 600,
  easing: 'ease-out-quart',
  offset: 60,
});

// Utilities
function el(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstElementChild;
}

function sanitize(str) {
  return (str || '').toString().replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}



// ===== CREATIVE FEATURES =====

// 1. Particle System
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  init() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        particle.x -= dx * 0.001;
        particle.y -= dy * 0.001;
      }
      
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(124, 92, 255, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system
const canvas = document.getElementById('particleCanvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.innerWidth > 720) {
  new ParticleSystem(canvas);
}

// 2. Interactive Cursor Follower
let cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateCursor() {
  if (cursorFollower) {
    cursorFollower.style.left = mouseX + 'px';
    cursorFollower.style.top = mouseY + 'px';
  }
  requestAnimationFrame(updateCursor);
}
updateCursor();

// Cursor interactions
document.addEventListener('mousedown', () => cursorFollower?.classList.add('active'));
document.addEventListener('mouseup', () => cursorFollower?.classList.remove('active'));

// 3. Typing Animation
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// 4. Counter Animation
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }
  updateCounter();
}

// Initialize typing and counters when data loads
function initCreativeEffects(data) {
  // Typing animation for name
  setTimeout(() => {
    const nameEl = document.getElementById('name');
    if (nameEl && data.personal_info.name) {
      typeWriter(nameEl, data.personal_info.name, 80);
    }
  }, 1000);
  
  // Counter animations
  setTimeout(() => {
    const counters = document.querySelectorAll('.animated-counter');
    counters.forEach((counter, index) => {
      const target = parseInt(counter.querySelector('span').textContent);
      counter.setAttribute('data-target', target);
      setTimeout(() => {
        animateCounter(counter.querySelector('span'), target, 2000);
      }, index * 200);
    });
  }, 2000);
}

// 5. Easter Egg Terminal
let terminalVisible = false;
const terminal = document.getElementById('easterEggTerminal');
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');

function showEasterEgg() {
  if (!terminalVisible) {
    terminal.classList.add('active');
    terminalVisible = true;
    terminalInput.focus();
    showToast('Terminal activated! 🎉');
  }
}

function hideTerminal() {
  terminal.classList.remove('active');
  terminalVisible = false;
}

// Terminal commands
const terminalCommands = {
  skills: () => 'C#, ASP.NET Core, REST APIs, EF Core, SQL Server, Clean Architecture, SOLID, JWT/RBAC, Docker, CI/CD',
  projects: () => 'Nexus ERP, HR System Backend, Real Estate Platform',
  contact: () => 'Email: abdelrahmanelsepaay07@gmail.com | Phone: 01065564618',
  joke: () => {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
      'How many programmers does it take to change a light bulb? None, that\'s a hardware problem! 💡',
      'Why do Java developers wear glasses? Because they can\'t C# ! 👓',
      'A SQL query goes into a bar, walks up to two tables and asks... "Can I join you?" 🍺'
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  },
  clear: () => {
    terminalBody.innerHTML = `
      <div class="terminal-line">
        <span class="prompt">visitor@portfolio:~$</span>
        <span class="command">clear</span>
      </div>
      <div class="terminal-input-line">
        <span class="prompt">visitor@portfolio:~$</span>
        <input type="text" id="terminalInput" class="terminal-input" placeholder="Type a command..." />
      </div>
    `;
    document.getElementById('terminalInput').focus();
    return '';
  },
  help: () => 'Available commands: skills, projects, contact, joke, clear, exit',
  exit: () => {
    hideTerminal();
    return 'Goodbye! 👋';
  }
};

// Terminal event listeners
document.getElementById('terminalClose')?.addEventListener('click', hideTerminal);
terminal?.addEventListener('click', (e) => {
  if (e.target === terminal) hideTerminal();
});

// Terminal input handler
document.addEventListener('keydown', (e) => {
  if (terminalVisible && e.target.id === 'terminalInput' && e.key === 'Enter') {
    const command = e.target.value.toLowerCase().trim();
    const inputLine = e.target.parentElement;
    
    if (command) {
      const output = terminalCommands[command] || `Command not found: ${command}. Type 'help' for available commands.`;
      
      if (command !== 'clear' && command !== 'exit') {
        const outputEl = el(`<div class="terminal-output">${typeof output === 'function' ? output() : output}</div>`);
        inputLine.parentNode.insertBefore(outputEl, inputLine);
        
        const newInputLine = el(`
          <div class="terminal-input-line">
            <span class="prompt">visitor@portfolio:~$</span>
            <input type="text" class="terminal-input" placeholder="Type a command..." />
          </div>
        `);
        inputLine.parentNode.appendChild(newInputLine);
        inputLine.remove();
        newInputLine.querySelector('input').focus();
      }
    }
  }
});

// 6. Toast Notifications
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }
}

// 7. Enhanced Data Loading with Creative Effects
async function loadDataWithEffects() {
  const loadingScreen = document.getElementById('loadingScreen');
  const mainContent = document.getElementById('mainContent');
  const progressBar = document.getElementById('progressBar');
  const loadingText = document.querySelector('.loading-text');
  
  try {
    // Show loading progress
    updateProgress(10, 'Initializing...');
    
    // Simulate some loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    updateProgress(30, 'Fetching data...');
    
    // Fetch data from JSON
    const res = await fetch('data.json');
    const data = await res.json();
    
    updateProgress(60, 'Processing content...');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Call the original loadData function with the fetched data
    await loadDataWithData(data);
    
    updateProgress(80, 'Initializing features...');
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Then initialize creative effects
    initCreativeEffects(data);
    
    updateProgress(100, 'Ready!');
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Hide loading screen and show main content
    loadingScreen.classList.add('fade-out');
    mainContent.style.opacity = '1';
    mainContent.style.visibility = 'visible';
    
    // Remove loading screen from DOM after animation
    setTimeout(() => {
      if (loadingScreen.parentNode) {
        loadingScreen.parentNode.removeChild(loadingScreen);
      }
    }, 500);
    
    // Show welcome toast
    setTimeout(() => {
      showToast('Welcome to my portfolio! ✨');
    }, 1000);
    
  } catch (error) {
    console.error('Error loading data:', error);
    updateProgress(0, 'Error loading data');
    loadingText.textContent = 'Failed to load portfolio';
    loadingText.style.color = '#ff4757';
  }
  
  function updateProgress(percentage, text) {
    progressBar.style.width = percentage + '%';
    loadingText.textContent = text;
  }
}

// Modified loadData to accept data parameter
async function loadDataWithData(data) {
  // Personal Info
  document.getElementById('name').textContent = data.personal_info.name;
  document.getElementById('title').textContent = data.personal_info.title;
  const profileImg = document.getElementById('profileImg');
  profileImg.src = data.personal_info.profile_image;
  profileImg.alt = `${data.personal_info.name} profile photo`;

  document.getElementById('projectsNum').textContent = data.projects.length;
  document.getElementById('experienceNum').textContent = data.experience_num;
  document.getElementById('customersNum').textContent = data.certifications_num ?? (data.certifications || []).length;

  document.getElementById('aboutMe').textContent = data.personal_info.about_me;
  document.getElementById('location').textContent = data.personal_info.location;

  const phoneHref = `tel:${data.personal_info.contact.phone.replace(/\s+/g, '')}`;
  const emailHref = `mailto:${data.personal_info.contact.email}`;
  const phoneA = document.getElementById('phone');
  const emailA = document.getElementById('email');
  phoneA.href = phoneHref; phoneA.textContent = data.personal_info.contact.phone;
  emailA.href = emailHref; emailA.textContent = data.personal_info.contact.email;

  const emailCTA = document.getElementById('emailCTA');
  const whatsappCTA = document.getElementById('whatsappCTA');
  const whatsappHref = `https://wa.me/${data.personal_info.contact.phone.replace(/[^0-9]/g, '')}`;
  emailCTA.href = emailHref; whatsappCTA.href = whatsappHref;

  const cv = document.getElementById('cvDownload');
  cv.href = data.personal_info.cv_download;
  
  // LinkedIn link in contact section
  const linkedinLink = data.personal_info.social_links.find(link => link.platform === 'LinkedIn');
  const linkedinA = document.getElementById('linkedin');
  
  if (linkedinLink) {
    linkedinA.href = linkedinLink.url;
    linkedinA.textContent = 'Abdelrahman Elsepaay';
  }

  // Social Links
  const socialWrap = document.getElementById('socialLinks');
  data.personal_info.social_links.forEach(s => {
    const item = el(`<a href="${sanitize(s.url)}" target="_blank" rel="noopener">
      <i class="ti ti-brand-${sanitize(s.platform).toLowerCase()}"></i>
      <span>${sanitize(s.platform)}</span></a>`);
    socialWrap.appendChild(item);
  });

  // Enhanced Technical Skills with Categories
  createEnhancedTechnicalSkills(data.skills.technical_skills);

  // Experience timeline
  const timeline = document.getElementById('experienceTimeline');
  (data.experience || []).forEach(exp => {
    const item = el(`
      <div class="timeline-item" data-aos="fade-up" data-aos-delay="50">
        <span class="timeline-dot"></span>
        <div class="timeline-card">
          <h4>${sanitize(exp.title)}</h4>
          <div class="meta">${sanitize(exp.company)} • ${sanitize(exp.location)} • ${sanitize(exp.date_range)}</div>
          ${Array.isArray(exp.description_points) ? `<ul>${exp.description_points.map(d => `<li>${sanitize(d)}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`);
    timeline.appendChild(item);
  });

  // Education
  const eduList = document.getElementById('educationList');
  (data.education || []).forEach(ed => {
    const card = el(`
      <div class="edu-card">
        <h4>${sanitize(ed.degree)}</h4>
        <div class="meta">${sanitize(ed.institution)} • ${sanitize(ed.date_range)}</div>
      </div>`);
    eduList.appendChild(card);
  });

  // Certifications
  const certificationsList = document.getElementById('certificationsList');
  (data.certifications || []).forEach(certification => {
    const card = el(`
      <article class="certification-card">
        <div class="certification-icon"><i class="ti ti-certificate"></i></div>
        <div>
          <h4>${sanitize(certification.split(' — ')[0])}</h4>
          <p>${sanitize(certification.includes(' — ') ? certification.slice(certification.indexOf(' — ') + 3) : 'Professional credential')}</p>
        </div>
      </article>`);
    certificationsList?.appendChild(card);
  });

  // Projects
  const grid = document.getElementById('projectsGrid');
  (data.projects || []).forEach((p, idx) => {
    const techPreview = (p.technologies_used || []).slice(0, 5).map(tech =>
      `<span class="project-tech">${sanitize(tech)}</span>`
    ).join('');

    const githubLink = (p.links || []).find(l => l.type === 'GitHub');
    const projectId = p.id || p.slug || String(idx);

    const card = el(`
      <article class="project" data-project-id="${sanitize(projectId)}" data-aos="fade-up" data-aos-delay="${(idx % 3) * 100}" tabindex="0" role="button" aria-label="View ${sanitize(p.name)} details">
        <div class="project__cover">
          <img src="${sanitize(p.cover_image)}" alt="${sanitize(p.name)} project preview" loading="lazy" decoding="async" />
          <div class="project__cover-overlay"><i class="ti ti-arrow-up-right"></i></div>
        </div>
        <div class="project__body">
          <div class="project__eyebrow">
            <span>${sanitize(p.category || 'Backend Project')}</span>
            <span>${sanitize(p.role || 'Developer')}</span>
          </div>
          <h3 class="project__title">${sanitize(p.name)}</h3>
          <div class="project__meta">${sanitize(p.short_description)}</div>
          <div class="project-techs">${techPreview}</div>
          <div class="project__actions">
            <a class="project__open project-action-link" href="project-details.html?id=${encodeURIComponent(projectId)}">
              <i class="ti ti-arrow-right"></i> View Project
            </a>
            ${githubLink ? `<a class="link project-action-link" href="${sanitize(githubLink.url)}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()"><i class="ti ti-brand-github"></i><span>View on GitHub</span></a>` : ''}
          </div>
        </div>
      </article>`);

    const openProject = () => {
      window.location.href = `project-details.html?id=${encodeURIComponent(projectId)}`;
    };

    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      openProject();
    });
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a')) {
        e.preventDefault();
        openProject();
      }
    });
    grid.appendChild(card);
  });
}

// Initialize everything
loadDataWithEffects();

// ===== ENHANCED SKILLS FUNCTIONS =====

// Skill icons mapping
const skillIcons = {
  'ASP.NET': 'ti ti-code',
  'C#': 'ti ti-code',
  'REST': 'ti ti-api',
  'API': 'ti ti-api',
  'JWT': 'ti ti-key',
  'RBAC': 'ti ti-shield-lock',
  'SQL': 'ti ti-database',
  'MySQL': 'ti ti-database',
  'Entity Framework': 'ti ti-database',
  'EF Core': 'ti ti-database',
  'Clean': 'ti ti-building-arch',
  'SOLID': 'ti ti-shield-check',
  'Dependency': 'ti ti-git-merge',
  'Repository': 'ti ti-stack-2',
  'Unit of Work': 'ti ti-stack',
  'xUnit': 'ti ti-test-pipe',
  'Docker': 'ti ti-brand-docker',
  'Git': 'ti ti-brand-git',
  'GitHub': 'ti ti-brand-github',
  'Swagger': 'ti ti-file-type-json',
  'Postman': 'ti ti-send',
  'Angular': 'ti ti-brand-angular',
  'TypeScript': 'ti ti-brand-typescript',
  'JavaScript': 'ti ti-brand-javascript',
  'HTML': 'ti ti-brand-html5',
  'Bootstrap': 'ti ti-brand-bootstrap',
  'default': 'ti ti-code'
};

// Get skill icon
function getSkillIcon(skill) {
  for (const [key, icon] of Object.entries(skillIcons)) {
    if (skill.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return skillIcons.default;
}

// Get skill level text
function getSkillLevel(proficiency) {
  if (proficiency >= 90) return 'Expert';
  if (proficiency >= 80) return 'Advanced';
  if (proficiency >= 70) return 'Intermediate';
  return 'Beginner';
}

// Categorize skills
function categorizeSkills(skills) {
  const categories = {
    backend: { keywords: ['ASP.NET', 'MVC', 'C#', 'REST', 'SignalR', 'Middleware', 'Microservices', 'JWT', 'RBAC'], skills: [] },
    architecture: { keywords: ['SQL', 'MySQL', 'Entity Framework', 'EF Core', 'LINQ', 'Dapper', 'Eloquent', 'Indexing', 'Clean Architecture', 'SOLID', 'Dependency Injection', 'Design Patterns', 'Repository', 'Unit of Work'], skills: [] },
    testing: { keywords: ['xUnit', 'Docker', 'Git', 'GitHub Actions', 'CI/CD', 'Postman', 'Swagger'], skills: [] },
    frontend: { keywords: ['Laravel', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Bootstrap'], skills: [] }
  };

  skills.forEach(skill => {
    let categorized = false;
    for (const key of Object.keys(categories)) {
      if (!categorized && categories[key].keywords.some(keyword => skill.toLowerCase().includes(keyword.toLowerCase()))) {
        categories[key].skills.push(skill);
        categorized = true;
      }
    }
    if (!categorized) categories.testing.skills.push(skill);
  });

  return categories;
}

// Create Simple Skill Chip
function createSimpleSkillChip(skill) {
  const icon = getSkillIcon(skill);
  
  const skillChip = el(`
    <div class="simple-chip">
      <div class="simple-chip__icon">
        <i class="${icon}"></i>
      </div>
      <span>${sanitize(skill)}</span>
    </div>
  `);
  
  // Add click interaction
  skillChip.addEventListener('click', () => {
    showToast(`${skill} - One of my core technologies! 🚀`);
  });
  
  return skillChip;
}

// Create Simple Technical Skills with Categories
function createEnhancedTechnicalSkills(skills) {
  const categories = categorizeSkills(skills);
  const containers = {
    backend: document.getElementById('backendSkills'),
    architecture: document.getElementById('architectureSkills'),
    testing: document.getElementById('testingSkills'),
    frontend: document.getElementById('frontendSkills')
  };

  Object.entries(containers).forEach(([key, container]) => {
    if (!container) return;
    categories[key].skills.forEach(skill => container.appendChild(createSimpleSkillChip(skill)));
  });
}




// 8. Make showEasterEgg globally available
window.showEasterEgg = showEasterEgg;
