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
            break;
        case 'terms':
            modalId = 'termsModal';
            break;
        case 'refund':
            modalId = 'refundModal';
            break;
        case 'upsell':
            modalId = 'upsellModal';
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
    }
}

// Purchase handling
function handlePurchase(packageType) {
    if (packageType === 'basic') {
        showModal('upsell');
    } else if (packageType === 'premium') {
        console.log('Purchase clicked: premium');
        // TODO: Implement actual purchase logic for premium
        alert('Redirecionando para o pagamento do Pacote Premium...');
    }
}

function handleBasicPurchase() {
    closeModal('upsellModal');
    console.log('Purchase clicked: basic');
    // TODO: Implement actual purchase logic for basic
    alert('Redirecionando para o pagamento do Pacote Básico...');
}

function handleUpgradeToPremium() {
    closeModal('upsellModal');
    console.log('Purchase clicked: premium (upgraded)');
    // TODO: Implement actual purchase logic for premium
    alert('Redirecionando para o pagamento do Pacote Premium...');
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
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    const mobileButton = document.querySelector('.mobile-menu-button');
    
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
        mobileButton.classList.add('active');
    }
}

// Email capture functionality
function captureEmail(email, source = 'cta') {
    if (!email || !email.includes('@')) {
        alert('Por favor, digite um email válido.');
        return false;
    }
    
    // TODO: Implement actual email capture logic
    console.log('Email captured:', email, 'Source:', source);
    alert('Email cadastrado com sucesso! Você receberá novidades e ofertas especiais.');
    return true;
}

// Toast notification system
function showToast(title, description, type = 'success') {
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
    // TODO: Implement analytics tracking (Google Analytics, Facebook Pixel, etc.)
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, eventData);
    }
}

function trackPurchaseIntent(packageType) {
    trackEvent('purchase_intent', {
        package_type: packageType,
        timestamp: new Date().toISOString()
    });
}

function trackEmailCapture(source) {
    trackEvent('email_capture', {
        source: source,
        timestamp: new Date().toISOString()
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

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    // Check if the click is on a modal backdrop
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Handle form submissions
document.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const emailInput = form.querySelector('input[type="email"]');
    
    if (emailInput) {
        const email = emailInput.value;
        const source = form.dataset.source || 'form';
        
        if (captureEmail(email, source)) {
            trackEmailCapture(source);
            emailInput.value = '';
        }
    }
});

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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Add hover effects to cards
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
    
    // Enhanced pulse animation initialization
    const pulseElements = document.querySelectorAll('.pulse-glow, .pulse-glow-premium, .pulse-price');
    pulseElements.forEach(element => {
        // Ensure animations are properly applied
        element.style.animation = element.style.animation || '';
    });
    
    // Show success message after page load
    setTimeout(() => {
        console.log('🎨 Livros Bíblicos - Website carregado com sucesso!');
        console.log('✅ FAQ funcionalidade ativada');
        console.log('✨ Animações pulsantes ativadas');
    }, 1000);
});

// Service Worker for PWA (optional)
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

// Log performance after page load
window.addEventListener('load', logPerformance);

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    
    // Track errors for debugging
    trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
    });
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    trackEvent('promise_rejection', {
        reason: event.reason.toString()
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

console.log('🎨 Livros Bíblicos - JavaScript carregado com sucesso!');