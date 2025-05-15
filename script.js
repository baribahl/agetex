/**
 * Main JavaScript file for Agetex website
 * Implements clean, modular functionality for all interactive elements
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components - French only version
  initScrollEffects();
  initMobileMenu();
  initBackToTop();
  initPartnerAccordions();
  // initLanguageToggle(); - Removed as we're French-only
  setupImageErrorHandling();
});

/**
 * Handles smooth scrolling for anchor links
 */
function initScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if it's open
      if (document.getElementById('mobile-menu').classList.contains('translate-x-0')) {
        document.getElementById('mobile-menu').classList.replace('translate-x-0', 'translate-x-full');
      }
      
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return; // Empty href, don't scroll
      
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Initializes mobile menu functionality
 */
function initMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMenuButton = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.replace('translate-x-full', 'translate-x-0');
    });
  }
  
  if (closeMenuButton && mobileMenu) {
    closeMenuButton.addEventListener('click', function() {
      mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
    });
  }
  
  // Mobile menu links should also close the menu when clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.replace('translate-x-0', 'translate-x-full');
      });
    });
  }
}

/**
 * Initializes back-to-top button functionality
 */
function initBackToTop() {
  const backToTopButton = document.getElementById('back-to-top');
  
  if (backToTopButton) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add('opacity-100');
        backToTopButton.classList.add('visible');
        backToTopButton.classList.remove('opacity-0');
        backToTopButton.classList.remove('invisible');
      } else {
        backToTopButton.classList.remove('opacity-100');
        backToTopButton.classList.remove('visible');
        backToTopButton.classList.add('opacity-0');
        backToTopButton.classList.add('invisible');
      }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/**
 * Initializes accordion functionality for partner cards
 */
function initPartnerAccordions() {
  // Partner accordions now handled by partners.js to avoid duplication
  // console.log('Partner accordions initialized in partners.js'); // Commented out console.log
}

/**
 * Language toggle functionality removed - French only version
 */

/**
 * Sets up error handling for images
 */
function setupImageErrorHandling() {
  // Add error handling for all images
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('onerror')) {
      img.onerror = function() {
        // Set default fallback behavior based on image type/context
        const alt = img.alt || 'Image';
        const parent = img.parentNode;
        
        // For profile images
        if (alt.includes('Christophe Spies') || (parent && parent.classList.contains('profile-image'))) { // Added null check for parent
          this.src = './images/profile-image-BW-low-res.jpg';
        }
        // For partner logos
        else if ((parent && parent.classList.contains('partner-logo')) || (alt && alt.includes('logo'))) { // Added null check for parent and alt
          this.src = './images/agetex-logo-nav-updated.svg'; // Generic fallback for partner logos
        }
        // For machinery/product images
        else if (alt && alt.includes('machine') || (alt && alt.includes('équipement'))) { // Added null check for alt
          this.src = './images/photo-monti-machine-no-bg.png'; // Using existing machinery image as fallback
        }
        // Default fallback
        else {
          this.src = './images/agetex-logo-nav-updated.svg';
          this.classList.add('p-4', 'bg-light');
        }
      };
    }
  });
}

