// DARK/LIGHT MODE TOGGLE WITH LOCAL STORAGE

// Get DOM elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const mobileMenuBtn = document.querySelector('.navbar-toggler');
const navMenu = document.querySelector('.nav-menu');


// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    
    localStorage.setItem('theme', theme);
    
    showToast(`${theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'} activated!`);
    
    updateMetaThemeColor(theme);
}

// Function to get saved theme
function getSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (!savedTheme) {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemPreference ? 'dark' : 'light';
    }
    
    return savedTheme;
}

// Function to toggle theme
function toggleTheme() {
    const isDarkMode = body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Function to update meta theme-color for mobile browsers
function updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
    }
    
    const color = theme === 'dark' ? '#0f172a' : '#ffffff';
    metaThemeColor.setAttribute('content', color);
}

// Function to show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// RESPONSIVE MOBILE MENU

// Create mobile menu button if exists (for responsive)
function createMobileMenu() {
    const navContainer = document.querySelector('.nav-container');
    const existingMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!existingMenuBtn && window.innerWidth <= 768) {
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.style.cssText = `
            background: rgba(255,255,255,0.2);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        mobileBtn.addEventListener('click', () => {
            const menu = document.querySelector('.nav-menu');
            menu.classList.toggle('active');
        });
        
        navContainer.appendChild(mobileBtn);
    }
}

// SYSTEM THEME CHANGE DETECTION
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if user hasn't manually set a preference
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
    }
});

// INITIALIZE ON PAGE LOAD

// Load saved theme on page load
function initTheme() {
    const savedTheme = getSavedTheme();
    setTheme(savedTheme);
}

// Set up event listeners
function initEventListeners() {
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Handle window resize for mobile menu
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            const menu = document.querySelector('.nav-menu');
            if (menu) menu.classList.remove('active');
        }
    });
}

// Handle page navigation (for demo buttons)
function initDemoButtons() {
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            showToast('Welcome to ThemeSwitcher! Try clicking the theme toggle button ☀️🌙');
        });
    }
}

// ADD SMOOTH SCROLLING

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// START THE APP

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initEventListeners();
    initDemoButtons();
    createMobileMenu();
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and cards
    document.querySelectorAll('.feature-card, .card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// EXPORT FOR MODULE USE (optional)

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setTheme, toggleTheme, getSavedTheme };
}