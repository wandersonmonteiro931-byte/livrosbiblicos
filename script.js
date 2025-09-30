// Scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Redirect to payment
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
    lucide.createIcons();
}

// Close upsell modal
function closeUpsellModal() {
    const modal = document.getElementById('upsellModal');
    modal.classList.remove('active');
}

// Handle basic purchase (after viewing upsell)
function handleBasicPurchase() {
    closeUpsellModal();
    redirectToPayment('basic');
}

// Handle upgrade to premium
function handleUpgradeToPremium() {
    closeUpsellModal();
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

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeUpsellModal();
    }
});

// Initialize icons when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Track button clicks for analytics (optional)
    document.querySelectorAll('[data-testid^="button-"]').forEach(button => {
        button.addEventListener('click', function() {
            const testId = this.getAttribute('data-testid');
            console.log('Button clicked:', testId);
        });
    });
});
