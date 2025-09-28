// Global state management
let currentModalState = {
  showUpsellModal: false,
  showPrivacyModal: false,
  showTermsModal: false,
  showRefundModal: false,
  showPurchaseModal: false,
  selectedPackage: 'basic',
  userEmail: '',
  isPurchasePending: false,
  isLeadPending: false
};

// Smooth scrolling functionality
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  }
}

// Modal functionality
function showModal(modalType) {
  let modalId = '';
  
  switch(modalType) {
    case 'privacy':
      modalId = 'privacyModal';
      currentModalState.showPrivacyModal = true;
      break;
    case 'terms':
      modalId = 'termsModal';
      currentModalState.showTermsModal = true;
      break;
    case 'refund':
      modalId = 'refundModal';
      currentModalState.showRefundModal = true;
      break;
    case 'upsell':
      modalId = 'upsellModal';
      currentModalState.showUpsellModal = true;
      break;
    case 'purchase':
      modalId = 'purchaseModal';
      currentModalState.showPurchaseModal = true;
      break;
  }
  
  if (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      // Use setTimeout to ensure display is set before adding show class
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
      
      // Track modal open event
      trackEvent('modal_opened', { modal_type: modalType });
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
    
    // Update state
    switch(modalId) {
      case 'privacyModal':
        currentModalState.showPrivacyModal = false;
        break;
      case 'termsModal':
        currentModalState.showTermsModal = false;
        break;
      case 'refundModal':
        currentModalState.showRefundModal = false;
        break;
      case 'upsellModal':
        currentModalState.showUpsellModal = false;
        break;
      case 'purchaseModal':
        currentModalState.showPurchaseModal = false;
        break;
    }
    
    // Track modal close event
    trackEvent('modal_closed', { modal_id: modalId });
  }
}

// Purchase handling
function handlePurchase(packageType) {
  trackPurchaseIntent(packageType);
  
  if (packageType === 'basic') {
    showModal('upsell');
  } else if (packageType === 'premium') {
    currentModalState.selectedPackage = packageType;
    updatePurchaseModal();
    showModal('purchase');
  }
}

function handleBasicPurchase() {
  closeModal('upsellModal');
  currentModalState.selectedPackage = 'basic';
  updatePurchaseModal();
  showModal('purchase');
}

function handleUpgradeToPremium() {
  closeModal('upsellModal');
  currentModalState.selectedPackage = 'premium';
  updatePurchaseModal();
  showModal('purchase');
}

// Update purchase modal content based on selected package
function updatePurchaseModal() {
  const titleElement = document.getElementById('purchaseTitle');
  const priceElement = document.getElementById('purchasePrice');
  const savingsElement = document.getElementById('purchaseSavings');
  
  if (currentModalState.selectedPackage === 'basic') {
    if (titleElement) titleElement.textContent = 'Pacote Básico';
    if (priceElement) {
      priceElement.textContent = 'R$ 10,00';
      priceElement.className = 'current-price primary';
    }
    if (savingsElement) savingsElement.innerHTML = '<span class="old-price">R$ 47,00</span> - Economia de 79%';
  } else {
    if (titleElement) titleElement.textContent = 'Pacote Premium';
    if (priceElement) {
      priceElement.textContent = 'R$ 14,90';
      priceElement.className = 'current-price accent';
    }
    if (savingsElement) savingsElement.innerHTML = '<span class="old-price">R$ 97,00</span> - Economia de 85%';
  }
}

// Process purchase
function processPurchase() {
  const emailInput = document.getElementById('email');
  const email = emailInput ? emailInput.value.trim() : '';
  
  if (!email || !validateEmail(email)) {
    showToast('Email obrigatório', 'Por favor, informe um email válido para continuar.', 'error');
    return;
  }
  
  currentModalState.userEmail = email;
  currentModalState.isPurchasePending = true;
  
  // Update button state
  const purchaseButton = document.querySelector('[data-testid="button-confirm-purchase"]');
  if (purchaseButton) {
    purchaseButton.disabled = true;
    purchaseButton.innerHTML = `
      <svg class="animate-spin mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processando...
    `;
  }
  
  // Simulate API call
  setTimeout(() => {
    createPurchase(email, currentModalState.selectedPackage);
  }, 1000);
}

// Mock purchase function
function createPurchase(email, packageType) {
  const amount = packageType === 'basic' ? '10.00' : '14.90';
  
  // Create lead first
  createLead(email, `purchase_${packageType}`);
  
  // Simulate successful purchase
  const orderId = 'order_' + Date.now();
  
  showToast('Pedido criado com sucesso!', `Sua compra foi processada. Você receberá os materiais em breve no email ${email}.`);
  
  // Track purchase
  trackEvent('purchase_completed', {
    package_type: packageType,
    amount: amount,
    email: email,
    order_id: orderId
  });
  
  closeModal('purchaseModal');
  
  // Reset form
  const emailInput = document.getElementById('email');
  if (emailInput) emailInput.value = '';
  
  // Reset button state
  const purchaseButton = document.querySelector('[data-testid="button-confirm-purchase"]');
  if (purchaseButton) {
    purchaseButton.disabled = false;
    purchaseButton.innerHTML = `
      <i data-lucide="shopping-cart"></i>
      Finalizar Compra
    `;
    // Re-initialize icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  currentModalState.isPurchasePending = false;
  
  // Redirect to payment
  setTimeout(() => {
    alert(`Redirecionando para o pagamento... ID do pedido: ${orderId}`);
  }, 500);
}

// Mock lead capture function
function createLead(email, source) {
  currentModalState.isLeadPending = true;
  
  // Simulate API delay
  setTimeout(() => {
    console.log('Lead captured:', { email, source });
    trackEmailCapture(source);
    currentModalState.isLeadPending = false;
  }, 500);
}

// Enhanced FAQ Toggle functionality
function toggleFAQ(faqItem) {
  // If faqItem is a string (ID), find the element
  let item = faqItem;
  if (typeof faqItem === 'string') {
    const answer = document.getElementById(faqItem);
    if (answer) {
      item = answer.closest('.faq-item');
    }
  } else if (faqItem.classList && faqItem.classList.contains('faq-question')) {
    // If it's a question element, get the parent item
    item = faqItem.closest('.faq-item');
  }
  
  if (!item || !item.classList.contains('faq-item')) {
    return;
  }
  
  const isActive = item.classList.contains('active');
  
  // Close all FAQ items
  const allFaqItems = document.querySelectorAll('.faq-item');
  allFaqItems.forEach(faqItem => {
    faqItem.classList.remove('active');
  });
  
  // Open the clicked FAQ item if it wasn't already active
  if (!isActive) {
    item.classList.add('active');
    
    // Track FAQ interaction
    const questionText = item.querySelector('.faq-question span')?.textContent || 'unknown';
    trackEvent('faq_opened', { question: questionText });
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const nav = document.querySelector('.nav');
  const mobileButton = document.querySelector('.mobile-menu-button');
  
  if (!nav || !mobileButton) return;
  
  if (nav.style.display === 'flex') {
    nav.style.display = 'none';
    mobileButton.classList.remove('active');
  } else {
    nav.style.display = 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '100%';
    nav.style.left = '0';
    nav.style.right = '0';
    nav.style.backgroundColor = 'var(--card)';
    nav.style.padding = '1rem';
    nav.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    nav.style.zIndex = '100';
    mobileButton.classList.add('active');
  }
}

// Email capture functionality
function captureEmail(email, source = 'cta') {
  if (!email || !validateEmail(email)) {
    showToast('Email inválido', 'Por favor, digite um email válido.', 'error');
    return false;
  }
  
  createLead(email, source);
  showToast('Email cadastrado!', 'Você receberá novidades e ofertas especiais.');
  return true;
}

// Toast notification system
function showToast(title, description, type = 'success') {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <h4 class="toast-title">${title}</h4>
      <p class="toast-description">${description}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  
  // Add toast styles if not already added
  if (!document.querySelector('#toast-styles')) {
    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
      .toast {
        position: fixed;
        top: 1rem;
        right: 1rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        max-width: 24rem;
        animation: slideIn 0.3s ease;
      }
      
      .toast-success {
        border-left: 4px solid var(--primary);
      }
      
      .toast-error {
        border-left: 4px solid hsl(0, 84%, 60%);
      }
      
      .toast-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      
      .toast-title {
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--foreground);
        margin: 0;
      }
      
      .toast-description {
        font-size: 0.875rem;
        color: var(--muted-foreground);
        margin: 0;
      }
      
      .toast-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: none;
        border: none;
        font-size: 1.25rem;
        cursor: pointer;
        color: var(--muted-foreground);
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .toast-close:hover {
        color: var(--foreground);
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styles);
  }
  
  // Add toast to page
  document.body.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 5000);
}

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateForm(formData) {
  const errors = [];
  
  if (!formData.email || !validateEmail(formData.email)) {
    errors.push('Email é obrigatório e deve ser válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

// Load performance optimization
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (images.length === 0) return;
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Analytics helper functions
function trackEvent(eventName, eventData = {}) {
  // Add timestamp to all events
  eventData.timestamp = new Date().toISOString();
  
  console.log('Event tracked:', eventName, eventData);
  
  // Example: Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventData);
  }
  
  // Example: Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventData);
  }
  
  // Example: LinkedIn Insight Tag
  if (typeof lintrk !== 'undefined') {
    lintrk('track', { conversion_id: eventName });
  }
}

function trackPurchaseIntent(packageType) {
  trackEvent('purchase_intent', {
    package_type: packageType,
    value: packageType === 'basic' ? 10.00 : 14.90,
    currency: 'BRL'
  });
}

function trackEmailCapture(source) {
  trackEvent('email_capture', {
    source: source,
    lead_value: 5.00, // Estimated lead value
    currency: 'BRL'
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

// Scroll effects
function initScrollEffects() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  const scrollThreshold = 10;
  
  const handleScroll = throttle(() => {
    if (window.scrollY > scrollThreshold) {
      header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      header.style.backdropFilter = 'blur(10px)';
    } else {
      header.style.backgroundColor = 'var(--card)';
      header.style.backdropFilter = 'none';
    }
  }, 16);
  
  window.addEventListener('scroll', handleScroll);
}

// Intersection Observer for animations
function initAnimationObserver() {
  const animateElements = document.querySelectorAll('.hover-scale, .feature-card, .gallery-card, .pricing-card');
  
  if (animateElements.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Enhanced FAQ initialization
function initFAQFunctionality() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    // Remove any existing listeners first
    question.removeEventListener('click', handleFAQClick);
    // Add the event listener
    question.addEventListener('click', handleFAQClick);
    
    // Add keyboard support
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFAQClick.call(this, e);
      }
    });
    
    // Make it focusable for keyboard navigation
    if (!question.hasAttribute('tabindex')) {
      question.setAttribute('tabindex', '0');
    }
  });
}

// FAQ click handler
function handleFAQClick(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleFAQ(this);
}

// GitHub Pages path helper
function getAssetPath(path) {
  const currentPath = window.location.pathname;
  const basePath = currentPath.includes('/livros-biblicos') ? '/livros-biblicos' : '';
  return basePath + '/' + path.replace('./', '');
}

// Initialize GitHub Pages specific functionality
function initGitHubPages() {
  // Detect if we're on GitHub Pages and get the base path
  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  let basePath = '';
  
  // GitHub Pages detection
  if (hostname.includes('github.io')) {
    // For user/org pages: username.github.io
    // For project pages: username.github.io/repo-name
    const pathParts = pathname.split('/').filter(part => part);
    if (pathParts.length > 0 && !pathname.endsWith('.html')) {
      basePath = '/' + pathParts[0];
    }
  }
  
  // Update all relative asset paths
  updateAssetPaths(basePath);
}

// Update asset paths for GitHub Pages
function updateAssetPaths(basePath) {
  if (!basePath) return;
  
  // Update image sources
  const images = document.querySelectorAll('img[src^="./"], img[src^="images/"]');
  images.forEach(img => {
    const currentSrc = img.getAttribute('src');
    if (currentSrc.startsWith('./')) {
      img.src = basePath + '/' + currentSrc.substring(2);
    } else if (currentSrc.startsWith('images/')) {
      img.src = basePath + '/' + currentSrc;
    }
  });
  
  // Update CSS background images if any
  const elementsWithBg = document.querySelectorAll('[style*="background-image"]');
  elementsWithBg.forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.includes('url(./')) {
      const updatedStyle = style.replace(/url\(\.\/([^)]+)\)/g, `url(${basePath}/$1)`);
      el.setAttribute('style', updatedStyle);
    }
  });
}

// Close modal when clicking outside
function handleModalBackdropClick(event) {
  // Check if the click is on a modal backdrop
  if (event.target.classList.contains('modal')) {
    const modalId = event.target.id;
    closeModal(modalId);
  }
}

// Close modal with Escape key
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      closeModal(modal.id);
    });
  }
}

// Handle form submissions
function handleFormSubmission(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  const emailInput = form.querySelector('input[type="email"]');
  
  if (emailInput) {
    const email = emailInput.value;
    const source = form.dataset.source || 'form';
    
    if (captureEmail(email, source)) {
      emailInput.value = '';
    }
  }
}

// Add click tracking to buttons
function initButtonTracking() {
  // Add click tracking to purchase buttons
  const purchaseButtons = document.querySelectorAll('[onclick*="handlePurchase"]');
  purchaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const packageType = this.onclick.toString().includes('premium') ? 'premium' : 'basic';
      trackPurchaseIntent(packageType);
    });
  });
  
  // Add loading states to buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      if (!this.disabled) {
        this.style.opacity = '0.8';
        setTimeout(() => {
          this.style.opacity = '1';
        }, 200);
      }
    });
  });
}

// Add hover effects to cards
function initCardHoverEffects() {
  const cards = document.querySelectorAll('.feature-card, .gallery-card, .pricing-card, .faq-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!this.classList.contains('faq-item')) {
        this.style.transform = 'translateY(-4px)';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      if (!this.classList.contains('faq-item')) {
        this.style.transform = 'translateY(0)';
      }
    });
  });
}

// Enhanced pulse animation initialization
function initPulseAnimations() {
  const pulseElements = document.querySelectorAll('.pulse-glow, .pulse-glow-premium, .pulse-price');
  pulseElements.forEach(element => {
    // Ensure animations are properly applied
    element.style.animation = element.style.animation || '';
  });
}

// Contact functions
function openWhatsApp() {
  const whatsappUrl = "https://wa.me/5562995657915?text=Olá! Tenho interesse nos livros para colorir. Pode me ajudar?";
  window.open(whatsappUrl, '_blank');
  trackEvent('contact_whatsapp', { source: 'faq_section' });
}

function openEmail() {
  const emailUrl = "mailto:contato@livrosbiblicos.com?subject=Dúvida sobre os Livros para Colorir";
  window.open(emailUrl, '_blank');
  trackEvent('contact_email', { source: 'faq_section' });
}

// Performance monitoring
function logPerformance() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log('Page load time:', loadTime + 'ms');
    
    // Track performance metrics
    trackEvent('page_performance', {
      load_time: loadTime,
      dom_ready: timing.domContentLoadedEventEnd - timing.navigationStart,
      first_paint: timing.responseEnd - timing.navigationStart
    });
  }
}

// Error handling
function handleJavaScriptError(event) {
  console.error('JavaScript error:', event.error);
  
  // Track errors for debugging
  trackEvent('javascript_error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
}

// Unhandled promise rejection handling
function handleUnhandledRejection(event) {
  console.error('Unhandled promise rejection:', event.reason);
  
  trackEvent('promise_rejection', {
    reason: event.reason.toString()
  });
}

// Initialize all event listeners
function initEventListeners() {
  // Modal event listeners
  document.addEventListener('click', handleModalBackdropClick);
  document.addEventListener('keydown', handleEscapeKey);
  
  // Form submission listeners
  document.addEventListener('submit', handleFormSubmission);
  
  // Window event listeners
  window.addEventListener('load', logPerformance);
  window.addEventListener('error', handleJavaScriptError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // Contact button listeners
  const whatsappButtons = document.querySelectorAll('button:contains("WhatsApp")');
  whatsappButtons.forEach(button => {
    button.addEventListener('click', openWhatsApp);
  });
  
  const emailButtons = document.querySelectorAll('button:contains("Email")');
  emailButtons.forEach(button => {
    button.addEventListener('click', openEmail);
  });
}

// Service Worker for PWA (optional)
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('ServiceWorker registration successful');
        })
        .catch(function(err) {
          console.log('ServiceWorker registration failed');
        });
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('🎨 Livros Bíblicos - Initializing...');
  
  // Initialize GitHub Pages functionality
  initGitHubPages();
  
  // Initialize scroll effects
  initScrollEffects();
  
  // Initialize animation observer
  initAnimationObserver();
  
  // Initialize lazy loading
  lazyLoadImages();
  
  // Initialize FAQ functionality with improved handling
  initFAQFunctionality();
  
  // Initialize button tracking
  initButtonTracking();
  
  // Initialize card hover effects
  initCardHoverEffects();
  
  // Initialize pulse animations
  initPulseAnimations();
  
  // Initialize all event listeners
  initEventListeners();
  
  // Initialize service worker
  initServiceWorker();
  
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Show success message after page load
  setTimeout(() => {
    console.log('🎨 Livros Bíblicos - Website carregado com sucesso!');
    console.log('✅ FAQ funcionalidade ativada');
    console.log('✨ Animações pulsantes ativadas');
    console.log('🚀 Todas as funcionalidades inicializadas');
  }, 1000);
  
  // Track page view
  trackEvent('page_view', {
    page: window.location.pathname,
    referrer: document.referrer,
    user_agent: navigator.userAgent
  });
});

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showModal = showModal;
window.closeModal = closeModal;
window.handlePurchase = handlePurchase;
window.handleBasicPurchase = handleBasicPurchase;
window.handleUpgradeToPremium = handleUpgradeToPremium;
window.toggleFAQ = toggleFAQ;
window.toggleMobileMenu = toggleMobileMenu;
window.captureEmail = captureEmail;
window.showToast = showToast;
window.processPurchase = processPurchase;
window.validateEmail = validateEmail;
window.trackEvent = trackEvent;
window.trackPurchaseIntent = trackPurchaseIntent;
window.trackEmailCapture = trackEmailCapture;
window.openWhatsApp = openWhatsApp;
window.openEmail = openEmail;

console.log('🎨 Livros Bíblicos - JavaScript carregado com sucesso!');