// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeTypewriter();
  initializeProjectFilters();
  initializeAnimations();
  initializeThemeToggle();
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