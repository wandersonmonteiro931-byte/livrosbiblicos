// Global state
let showUpsellModal = false;

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// Handle purchase click
function handlePurchaseClick(packageType) {
  if (packageType === 'basic') {
    showModal();
  } else if (packageType === 'premium') {
    console.log(`Purchase clicked: ${packageType}`);
    // TODO: Implementar lógica de compra premium
    // Aqui você pode redirecionar para seu sistema de pagamento
    // window.location.href = 'https://seu-link-de-pagamento-premium.com';
    alert('Redirecionando para pagamento do Pacote Premium...');
  }
}

// Handle basic purchase (from modal)
function handleBasicPurchase() {
  hideModal();
  console.log('Purchase clicked: basic');
  // TODO: Implementar lógica de compra básica
  // Aqui você pode redirecionar para seu sistema de pagamento
  // window.location.href = 'https://seu-link-de-pagamento-basico.com';
  alert('Redirecionando para pagamento do Pacote Básico...');
}

// Handle upgrade to premium (from modal)
function handleUpgradeToPremium() {
  hideModal();
  console.log('Purchase clicked: premium (upgraded)');
  // TODO: Implementar lógica de compra premium
  // Aqui você pode redirecionar para seu sistema de pagamento
  // window.location.href = 'https://seu-link-de-pagamento-premium.com';
  alert('Redirecionando para pagamento do Pacote Premium...');
}

// Show upsell modal
function showModal() {
  const modal = document.getElementById('upsellModal');
  if (modal) {
    modal.classList.add('show');
    showUpsellModal = true;
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }
}

// Hide upsell modal
function hideModal() {
  const modal = document.getElementById('upsellModal');
  if (modal) {
    modal.classList.remove('show');
    showUpsellModal = false;
    // Restore body scroll
    document.body.style.overflow = 'auto';
  }
}

// Close modal when clicking outside
function setupModalCloseOnOutsideClick() {
  const modal = document.getElementById('upsellModal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideModal();
      }
    });
  }
}

// Close modal on escape key
function setupModalCloseOnEscape() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && showUpsellModal) {
      hideModal();
    }
  });
}

// Add hover effects to cards
function setupHoverEffects() {
  const hoverElements = document.querySelectorAll('.hover-scale');
  
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
      this.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '';
    });
  });
}

// Animate elements on scroll
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements that should animate on scroll
  const animateElements = document.querySelectorAll('.feature-card, .gallery-card, .pricing-card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Add pulse animation to CTA buttons
function setupPulseAnimation() {
  const pulseElements = document.querySelectorAll('.pulse-glow');
  
  pulseElements.forEach(element => {
    // Add a subtle pulse effect
    setInterval(() => {
      element.style.transform = 'scale(1.05)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 200);
    }, 3000);
  });
}

// Mobile menu toggle (if needed for future expansion)
function setupMobileMenu() {
  // This function can be expanded if you want to add a mobile hamburger menu
  // For now, the navigation is hidden on mobile as per the original design
}

// Form validation (if you add contact forms later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Smooth scroll for anchor links
function setupSmoothScrollForAnchors() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
}

// Add loading state to buttons
function addLoadingToButton(button, isLoading = true) {
  if (isLoading) {
    button.disabled = true;
    button.style.opacity = '0.7';
    button.innerHTML = '<svg class="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Processando...';
  } else {
    button.disabled = false;
    button.style.opacity = '1';
    // Restore original button content
  }
}

// Track user interactions for analytics (optional)
function trackEvent(eventName, eventData = {}) {
  // This function can be used to integrate with analytics services
  // like Google Analytics, Facebook Pixel, etc.
  console.log(`Event: ${eventName}`, eventData);
  
  // Example Google Analytics 4 event tracking:
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', eventName, eventData);
  // }
}

// Add click tracking to important buttons
function setupAnalyticsTracking() {
  // Track hero button clicks
  const heroButtons = document.querySelectorAll('[data-testid^="button-hero"]');
  heroButtons.forEach(button => {
    button.addEventListener('click', () => {
      trackEvent('hero_button_click', {
        button_type: button.textContent.includes('Baixar') ? 'download' : 'preview'
      });
    });
  });

  // Track package selection
  const packageButtons = document.querySelectorAll('[data-testid^="button-"], .pricing-card button');
  packageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const packageType = button.textContent.includes('Premium') ? 'premium' : 'basic';
      trackEvent('package_selected', {
        package_type: packageType,
        button_location: button.closest('.pricing-card') ? 'pricing_section' : 'other'
      });
    });
  });
}

// Lazy load images for better performance
function setupLazyLoading() {
  const images = document.querySelectorAll('img[src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Setup all interactive features
  setupModalCloseOnOutsideClick();
  setupModalCloseOnEscape();
  setupHoverEffects();
  setupScrollAnimations();
  setupSmoothScrollForAnchors();
  setupAnalyticsTracking();
  setupLazyLoading();
  
  // Add a subtle entrance animation to the page
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('🎨 Livros Bíblicos - Site carregado com sucesso!');
});

// Handle page visibility changes (pause animations when tab is not active)
document.addEventListener('visibilitychange', function() {
  const pulseElements = document.querySelectorAll('.pulse-glow');
  
  if (document.hidden) {
    // Pause animations when tab is not visible
    pulseElements.forEach(el => el.style.animationPlayState = 'paused');
  } else {
    // Resume animations when tab becomes visible
    pulseElements.forEach(el => el.style.animationPlayState = 'running');
  }
});

// Error handling for failed image loads
window.addEventListener('error', function(e) {
  if (e.target.tagName === 'IMG') {
    console.warn('Falha ao carregar imagem:', e.target.src);
    // Optionally replace with a placeholder image
    // e.target.src = '/path/to/placeholder-image.jpg';
  }
}, true);

// Export functions for global use (if needed)
window.scrollToSection = scrollToSection;
window.handlePurchaseClick = handlePurchaseClick;
window.handleBasicPurchase = handleBasicPurchase;
window.handleUpgradeToPremium = handleUpgradeToPremium;