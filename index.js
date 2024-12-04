// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Existing initializations
  initializeNavigation();
  initializeTypewriter();
  initializeProjectFilters();
  initializeAnimations();
  initializeThemeToggle();
  
  // New initializations
  const particleBackground = new ParticleBackground();
  initializeTimelineAnimations();
  initializeSkillAnimations();
  initializeProjectAnimations();
  initializeHoverEffects();
});
// Navigation and Scroll Functions
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  // Smooth scrolling
  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetSection = document.querySelector(targetId);
          targetSection.scrollIntoView({ behavior: 'smooth' });
          
          // Close mobile menu if open
          if (navMenu.classList.contains('active')) {
              navMenu.classList.remove('active');
              hamburger.classList.remove('active');
          }
      });
  });

  // Mobile menu toggle
  if (hamburger) {
      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navMenu.classList.toggle('active');
      });
  }

  // Scroll spy
  window.addEventListener('scroll', () => {
      const sections = document.querySelectorAll('section');
      let current = '';

      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          if (scrollY >= (sectionTop - sectionHeight / 3)) {
              current = section.getAttribute('id');
          }
      });

      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === current) {
              link.classList.add('active');
          }
      });
  });
}

// Typewriter Effect for Hero Section
function initializeTypewriter() {
  const titles = ["Software Developer", "DevOps Engineer", "Master's Student"];
  const typewriterElement = document.querySelector('.typewriter');
  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
      const currentTitle = titles[titleIndex];
      
      if (isDeleting) {
          typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
          charIndex--;
      } else {
          typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
          charIndex++;
      }

      if (!isDeleting && charIndex === currentTitle.length) {
          isDeleting = true;
          setTimeout(type, 2000); // Pause at end
      } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
          setTimeout(type, 500); // Pause before next word
      } else {
          setTimeout(type, isDeleting ? 100 : 200);
      }
  }

  if (typewriterElement) {
      type();
  }
}

// Project Filtering System
function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
      button.addEventListener('click', () => {
          const filter = button.getAttribute('data-filter');
          
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');

          projects.forEach(project => {
              const projectCategories = project.getAttribute('data-categories').split(' ');
              if (filter === 'all' || projectCategories.includes(filter)) {
                  project.style.display = 'block';
                  setTimeout(() => project.classList.add('show'), 10);
              } else {
                  project.classList.remove('show');
                  setTimeout(() => project.style.display = 'none', 300);
              }
          });
      });
  });
}

// Scroll Animations
function initializeAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const observerCallback = (entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animated');
          }
      });
  };

  const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1
  });

  animatedElements.forEach(element => observer.observe(element));
}

// Theme Toggle (Light/Dark)
function initializeThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Set initial theme based on user preference
  if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-theme');
  }

  if (themeToggle) {
      themeToggle.addEventListener('click', () => {
          document.body.classList.toggle('dark-theme');
      });
  }
}

// Skills Progress Animation
function animateSkills() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach(bar => {
      const target = bar.getAttribute('data-progress');
      let width = 0;
      const interval = setInterval(() => {
          if (width >= target) {
              clearInterval(interval);
          } else {
              width++;
              bar.style.width = width + '%';
          }
      }, 10);
  });
}

// Form Validation and Submission
function initializeContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Basic form validation
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      
      if (!name || !email || !message) {
          showFormError('Please fill in all fields');
          return;
      }
      
      if (!isValidEmail(email)) {
          showFormError('Please enter a valid email address');
          return;
      }
      
      // Here you would typically send the form data to a server
      // For now, we'll just show a success message
      showFormSuccess('Message sent successfully!');
      form.reset();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFormError(message) {
  const errorDiv = document.querySelector('.form-error');
  if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
      setTimeout(() => {
          errorDiv.style.display = 'none';
      }, 3000);
  }
}

function showFormSuccess(message) {
  const successDiv = document.querySelector('.form-success');
  if (successDiv) {
      successDiv.textContent = message;
      successDiv.style.display = 'block';
      setTimeout(() => {
          successDiv.style.display = 'none';
      }, 3000);
  }
}

// 1. Interactive Background with three.js
class ParticleBackground {
  constructor() {
      this.container = document.querySelector('.hero');
      this.createScene();
      this.createParticles();
      this.animate();

      // Handle resize
      window.addEventListener('resize', () => this.onWindowResize());
  }

  createScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.container.appendChild(this.renderer.domElement);
      this.camera.position.z = 5;
  }

  createParticles() {
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 1000;
      const positions = new Float32Array(particleCount * 3);
      
      for(let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 10;
          positions[i + 1] = (Math.random() - 0.5) * 10;
          positions[i + 2] = (Math.random() - 0.5) * 10;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
          color: 0x0366d6,
          size: 0.05,
          transparent: true
      });
      
      this.particles = new THREE.Points(particleGeometry, particleMaterial);
      this.scene.add(this.particles);
  }

  animate() {
      requestAnimationFrame(() => this.animate());
      this.particles.rotation.x += 0.001;
      this.particles.rotation.y += 0.001;
      this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

// 2. Animated Timeline with anime.js
function initializeTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  timelineItems.forEach((item, index) => {
      const animation = anime({
          targets: item,
          translateX: [-100, 0],
          opacity: [0, 1],
          duration: 800,
          delay: index * 200,
          easing: 'easeOutExpo',
          autoplay: false
      });

      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting) {
                  animation.play();
              }
          },
          { threshold: 0.2 }
      );

      observer.observe(item);
  });
}

// 3. Skill Bar Animations
function initializeSkillAnimations() {
  const skillBars = document.querySelectorAll('.skill-progress');
  
  skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      
      const animation = anime({
          targets: bar,
          width: `${progress}%`,
          duration: 1500,
          easing: 'easeInOutQuart',
          autoplay: false
      });

      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting) {
                  animation.play();
              }
          },
          { threshold: 0.2 }
      );

      observer.observe(bar);
  });
}

// 4. Animated Project Cards
function initializeProjectAnimations() {
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach((card, index) => {
      card.style.opacity = 0;
      
      const animation = anime({
          targets: card,
          translateY: [50, 0],
          opacity: [0, 1],
          duration: 800,
          delay: index * 100,
          easing: 'easeOutExpo',
          autoplay: false
      });

      const observer = new IntersectionObserver(
          (entries) => {
              if (entries[0].isIntersecting) {
                  animation.play();
              }
          },
          { threshold: 0.2 }
      );

      observer.observe(card);
  });
}

// 5. Interactive Hover Effects
function initializeHoverEffects() {
  const buttons = document.querySelectorAll('.filter-btn, .nav-link');
  
  buttons.forEach(button => {
      button.addEventListener('mouseenter', (e) => {
          anime({
              targets: e.target,
              scale: 1.1,
              duration: 400,
              easing: 'easeOutElastic(1, .8)'
          });
      });

      button.addEventListener('mouseleave', (e) => {
          anime({
              targets: e.target,
              scale: 1,
              duration: 400,
              easing: 'easeOutElastic(1, .8)'
          });
      });
  });
}
