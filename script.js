// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Redirect to payment checkout
function redirectToPayment(packageType) {
    const amount = packageType === 'basic' ? '10.00' : '14.90';
    
    const params = new URLSearchParams({
        package: packageType,
        amount: amount,
        currency: 'BRL'
    });
    
    const paymentUrl = `https://livrosbiblicos.vercel.app/?${params.toString()}`;
    
    showToast(
        'Redirecionando para pagamento',
        `${packageType === 'basic' ? 'Pacote Básico' : 'Pacote Premium'} - R$ ${amount.replace('.', ',')}`
    );
    
    setTimeout(() => {
        window.location.href = paymentUrl;
    }, 500);
}

// Handle purchase click
function handlePurchaseClick(packageType) {
    if (packageType === 'basic') {
        showUpsellModal();
    } else {
        redirectToPayment(packageType);
    }
}

// Show upsell modal
function showUpsellModal() {
    const modal = document.getElementById('upsellModal');
    modal.classList.add('active');
}

// Hide upsell modal
function hideUpsellModal() {
    const modal = document.getElementById('upsellModal');
    modal.classList.remove('active');
}

// Handle basic purchase (after viewing upsell)
function handleBasicPurchase() {
    hideUpsellModal();
    redirectToPayment('basic');
}

// Handle upgrade to premium
function handleUpgradeToPremium() {
    hideUpsellModal();
    redirectToPayment('premium');
}

// Show toast notification
function showToast(title, description) {
    const toast = document.getElementById('toast');
    const titleEl = toast.querySelector('.toast-title');
    const descEl = toast.querySelector('.toast-description');
    
    titleEl.textContent = title;
    descEl.textContent = description;
    
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// Close modal on background click
document.getElementById('upsellModal').addEventListener('click', function(e) {
    if (e.target === this) {
        hideUpsellModal();
    }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Track events (optional - for analytics)
function trackEvent(eventName, eventData) {
    console.log('Event tracked:', eventName, eventData);
    // You can integrate with Google Analytics or other analytics here
    // Example: gtag('event', eventName, eventData);
}

// Add event listeners for tracking
document.addEventListener('DOMContentLoaded', function() {
    // Track button clicks
    document.querySelectorAll('[data-testid^="button-"]').forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            trackEvent('button_click', { button: testId });
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('[data-testid^="nav-"]').forEach(link => {
        link.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            trackEvent('navigation_click', { link: testId });
        });
    });
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close modal on Escape key
    if (e.key === 'Escape') {
        hideUpsellModal();
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .gallery-card, .price-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
