/* script.js */

// ============================================
// DOM ELEMENTS
// ============================================
const header = document.getElementById('header');
const navMenu = document.getElementById('navMenu');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelectorAll('.nav__link');
const scrollTopBtn = document.getElementById('scrollTop');
const darkModeToggle = document.getElementById('darkModeToggle');
const contactForm = document.getElementById('contactForm');
const newsletterForm = document.getElementById('newsletterForm');
const testimonialsTrack = document.getElementById('testimonialsTrack');
const sliderPrev = document.getElementById('sliderPrev');
const sliderNext = document.getElementById('sliderNext');
const sliderDots = document.getElementById('sliderDots');

// ============================================
// AOS ANIMATION INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleHeaderScroll);

// ============================================
// MOBILE MENU TOGGLE
// ============================================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

navToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
        toggleMobileMenu();
    }
});

// ============================================
// ACTIVE NAVIGATION LINK ON SCROLL
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
function toggleScrollTop() {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', toggleScrollTop);

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// DARK MODE TOGGLE
// ============================================
function initDarkMode() {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    }
}

function toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateDarkModeIcon(false);
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateDarkModeIcon(true);
    }
}

function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

darkModeToggle.addEventListener('click', toggleDarkMode);
initDarkMode();

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
const testimonialCards = testimonialsTrack.querySelectorAll('.testimonial-card');
const totalSlides = testimonialCards.length;
let slidesPerView = window.innerWidth > 1024 ? 2 : 1;
let maxSlide = totalSlides - slidesPerView;

function initSlider() {
    // Create dots
    sliderDots.innerHTML = '';
    const dotCount = maxSlide + 1;
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        sliderDots.appendChild(dot);
    }
    
    updateSlider();
}

function updateSlider() {
    const cardWidth = testimonialCards[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = -(currentSlide * (cardWidth + gap));
    testimonialsTrack.style.transform = `translateX(${offset}px)`;
    
    // Update dots
    const dots = sliderDots.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = maxSlide;
    if (currentSlide > maxSlide) currentSlide = 0;
    updateSlider();
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function prevSlide() {
    goToSlide(currentSlide - 1);
}

sliderNext.addEventListener('click', nextSlide);
sliderPrev.addEventListener('click', prevSlide);

// Auto-slide every 5 seconds
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto-slide on hover
testimonialsTrack.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
testimonialsTrack.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 5000);
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

testimonialsTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

testimonialsTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Update slider on window resize
window.addEventListener('resize', () => {
    slidesPerView = window.innerWidth > 1024 ? 2 : 1;
    maxSlide = totalSlides - slidesPerView;
    currentSlide = Math.min(currentSlide, maxSlide);
    initSlider();
});

initSlider();

// ============================================
// FORM VALIDATION
// ============================================
function validateField(field, rules) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove existing error states
    field.classList.remove('error', 'success');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();

    // Required check
    if (rules.required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (isValid && rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Phone validation
    if (isValid && rules.phone && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    // Min length validation
    if (isValid && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = `Must be at least ${rules.minLength} characters`;
    }

    // Apply validation state
    if (!isValid) {
        field.classList.add('error');
        const errorEl = document.createElement('span');
        errorEl.classList.add('error-message');
        errorEl.textContent = errorMessage;
        field.parentElement.appendChild(errorEl);
    } else if (value) {
        field.classList.add('success');
    }

    return isValid;
}

// Contact Form Validation
if (contactForm) {
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');

    // Real-time validation
    nameField.addEventListener('blur', () => validateField(nameField, { required: true, minLength: 2 }));
    emailField.addEventListener('blur', () => validateField(emailField, { required: true, email: true }));
    phoneField.addEventListener('blur', () => validateField(phoneField, { phone: true }));
    subjectField.addEventListener('blur', () => validateField(subjectField, { required: true }));
    messageField.addEventListener('blur', () => validateField(messageField, { required: true, minLength: 10 }));

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(nameField, { required: true, minLength: 2 });
        const isEmailValid = validateField(emailField, { required: true, email: true });
        const isPhoneValid = validateField(phoneField, { phone: true });
        const isSubjectValid = validateField(subjectField, { required: true });
        const isMessageValid = validateField(messageField, { required: true, minLength: 10 });

        if (isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isMessageValid) {
            // Show success message
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#10b981';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                contactForm.reset();
                document.querySelectorAll('.form__input').forEach(input => {
                    input.classList.remove('success');
                });
            }, 3000);
        }
    });
}

// Newsletter Form Validation
if (newsletterForm) {
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isValid = validateField(emailInput, { required: true, email: true });
        
        if (isValid) {
            const btn = newsletterForm.querySelector('button');
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = '#10b981';
            
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.background = '';
                newsletterForm.reset();
                emailInput.classList.remove('success');
            }, 2000);
        }
    });
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.destination-card, .package-card, .service-card').forEach(el => {
    observer.observe(el);
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach(img => imageObserver.observe(img));
}

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.5;
        hero.style.backgroundPositionY = `${rate}px`;
    }
});

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('K') ? 'K+' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('K') ? 'K+' : '+');
        }
    }
    
    updateCounter();
}

// Trigger counter animation when about section is visible
const aboutSection = document.getElementById('about');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
            countersAnimated = true;
            document.querySelectorAll('.about__stat-number').forEach(counter => {
                const text = counter.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                animateCounter(counter, value);
            });
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    counterObserver.observe(aboutSection);
}

// ============================================
// GALLERY LIGHTBOX (Simple implementation)
// ============================================
document.querySelectorAll('.gallery__item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const overlay = this.querySelector('.gallery__overlay span').textContent;
        
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
            <div class="lightbox__content">
                <img src="${img.src}" alt="${overlay}">
                <span class="lightbox__caption">${overlay}</span>
                <button class="lightbox__close" aria-label="Close lightbox">&times;</button>
            </div>
        `;
        
        // Add lightbox styles
        lightbox.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 2rem;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = lightbox.querySelector('.lightbox__content');
        content.style.cssText = `
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 85vh;
            object-fit: contain;
            border-radius: 8px;
        `;
        
        const caption = lightbox.querySelector('.lightbox__caption');
        caption.style.cssText = `
            display: block;
            text-align: center;
            color: white;
            margin-top: 1rem;
            font-size: 1.2rem;
        `;
        
        const closeBtn = lightbox.querySelector('.lightbox__close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -2rem;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        // Close lightbox
        const closeLightbox = () => {
            lightbox.remove();
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    });
});

// Add fadeIn keyframe for lightbox
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);

console.log('Velora Travels - Website Loaded Successfully!');