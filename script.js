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
        // Find any open modal and close it
        const openModal = document.querySelector('.modal.show');
        if (openModal) {
            closeModal(openModal.id);
        }
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Livros Bíblicos - Página carregada');
    
    // Add click handlers for navigation buttons
    const navButtons = document.querySelectorAll('.nav button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the section ID from the onclick attribute or data attribute
            const onClick = this.getAttribute('onclick');
            if (onClick) {
                const match = onClick.match(/scrollToSection\('([^']+)'\)/);
                if (match) {
                    scrollToSection(match[1]);
                }
            }
        });
    });
    
    // Add click handlers for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    heroButtons.forEach(button => {
        button.addEventListener('click', function() {
            const onClick = this.getAttribute('onclick');
            if (onClick) {
                if (onClick.includes('scrollToSection')) {
                    const match = onClick.match(/scrollToSection\('([^']+)'\)/);
                    if (match) {
                        scrollToSection(match[1]);
                    }
                }
            }
        });
    });
    
    // Add click handlers for pricing buttons
    const pricingButtons = document.querySelectorAll('[data-testid^="button-"][data-testid$="-package"]');
    pricingButtons.forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            if (testId.includes('basic')) {
                handlePurchase('basic');
            } else if (testId.includes('premium')) {
                handlePurchase('premium');
            }
        });
    });
    
    // Add click handlers for CTA buttons
    const ctaButtons = document.querySelectorAll('[data-testid^="button-final-"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            if (testId.includes('basic')) {
                handlePurchase('basic');
            } else if (testId.includes('premium')) {
                handlePurchase('premium');
            } else {
                // Default to scrolling to pricing section
                scrollToSection('precos');
            }
        });
    });
    
    // Add click handlers for footer policy buttons
    const policyButtons = document.querySelectorAll('[data-testid^="button-"][data-testid$="-policy"]');
    policyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            if (testId.includes('privacy')) {
                showModal('privacy');
            } else if (testId.includes('terms')) {
                showModal('terms');
            } else if (testId.includes('refund')) {
                showModal('refund');
            }
        });
    });
    
    // Add smooth scrolling to all internal links
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Add animation on scroll (optional enhancement)
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
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .gallery-card, .pricing-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.addEventListener('error', function() {
            console.warn('Failed to load image:', this.src);
            // You could set a placeholder image here
            // this.src = 'path/to/placeholder.png';
        });
        
        // Set initial opacity for fade-in effect
        if (!img.complete) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
        }
    });
});

// Utility functions
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Add scroll effect to header
window.addEventListener('scroll', debounce(function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = 'var(--card)';
        header.style.backdropFilter = 'none';
    }
}, 10));

// Add pulse animation to CTA buttons periodically
setInterval(function() {
    const ctaButtons = document.querySelectorAll('.pulse-glow');
    ctaButtons.forEach(button => {
        button.style.animation = 'none';
        setTimeout(() => {
            button.style.animation = 'pulse-glow 2s infinite';
        }, 100);
    });
}, 10000); // Every 10 seconds

// Performance optimization: Lazy load images
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

// Initialize lazy loading if there are data-src images
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add mobile menu functionality (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('mobile-open');
}

// Export functions for global access
window.scrollToSection = scrollToSection;
window.showModal = showModal;
window.closeModal = closeModal;
window.handlePurchase = handlePurchase;
window.handleBasicPurchase = handleBasicPurchase;
window.handleUpgradeToPremium = handleUpgradeToPremium;
window.toggleMobileMenu = toggleMobileMenu;