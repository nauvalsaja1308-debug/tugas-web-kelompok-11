/**
 * =====================================================
 * MAIN.JS - Sejarah Kota Pekanbaru
 * Website Interaktif Kota Bertuah
 * =====================================================
 */

'use strict';

// ===== CONFIGURATION =====
const CONFIG = {
    videoId: 'BeCNA-cvtE0',
    navHeight: 80,
    scrollOffset: 20,
    animationDuration: 300,
    observerThreshold: 0.1,
    paralaxSpeed: 0.5
};

// ===== UTILITY FUNCTIONS =====
const Utils = {
    /**
     * Get element by selector
     */
    $(selector) {
        return document.querySelector(selector);
    },

    /**
     * Get all elements by selector
     */
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    /**
     * Add event listener to element(s)
     */
    on(element, event, handler) {
        if (typeof element === 'string') {
            element = this.$$(element);
        }
        if (NodeList.prototype.isPrototypeOf(element)) {
            element.forEach(el => el.addEventListener(event, handler));
        } else {
            element.addEventListener(event, handler);
        }
    },

    /**
     * Toggle class on element
     */
    toggleClass(element, className) {
        element.classList.toggle(className);
    },

    /**
     * Add class to element
     */
    addClass(element, className) {
        element.classList.add(className);
    },

    /**
     * Remove class from element
     */
    removeClass(element, className) {
        element.classList.remove(className);
    },

    /**
     * Smooth scroll to element
     */
    smoothScrollTo(target, offset = CONFIG.scrollOffset) {
        const element = typeof target === 'string' ? this.$(target) : target;
        if (!element) return;

        const navHeight = this.$('nav').offsetHeight;
        const targetPosition = element.offsetTop - navHeight - offset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ===== NAVIGATION MODULE =====
const Navigation = {
    init() {
        this.nav = Utils.$('nav');
        this.navLinks = Utils.$('#navLinks');
        this.menuToggle = Utils.$('.menu-toggle');
        this.logo = Utils.$('.logo');
        
        this.bindEvents();
        this.setupActiveLink();
    },

    bindEvents() {
        // Toggle mobile menu
        if (this.menuToggle) {
            Utils.on(this.menuToggle, 'click', (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        // Close menu when clicking outside
        Utils.on(document, 'click', (e) => {
            if (!this.nav.contains(e.target) && this.navLinks.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Smooth scroll for nav links
        Utils.on('a[href^="#"]', 'click', (e) => {
            e.preventDefault();
            const target = e.target.getAttribute('href');
            Utils.smoothScrollTo(target);
            this.closeMenu();
        });

        // Logo click to scroll top
        if (this.logo) {
            Utils.on(this.logo, 'click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Scroll effects
        Utils.on(window, 'scroll', Utils.throttle(() => {
            this.handleScroll();
        }, 100));
    },

    toggleMenu() {
        Utils.toggleClass(this.navLinks, 'active');
        Utils.toggleClass(this.menuToggle, 'active');
    },

    closeMenu() {
        Utils.removeClass(this.navLinks, 'active');
        Utils.removeClass(this.menuToggle, 'active');
    },

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Add shadow effect
        if (scrollY > 100) {
            Utils.addClass(this.nav, 'scrolled');
        } else {
            Utils.removeClass(this.nav, 'scrolled');
        }
    },

    setupActiveLink() {
        const sections = Utils.$$('section[id]');
        const navLinks = Utils.$$('.nav-links a');

        Utils.on(window, 'scroll', Utils.throttle(() => {
            let current = '';
            const navHeight = this.nav.offsetHeight;

            sections.forEach(section => {
                const sectionTop = section.offsetTop - navHeight - 100;
                const sectionHeight = section.offsetHeight;

                if (window.pageYOffset >= sectionTop && 
                    window.pageYOffset < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                Utils.removeClass(link, 'active');
                if (link.getAttribute('href') === `#${current}`) {
                    Utils.addClass(link, 'active');
                }
            });
        }, 100));
    }
};

// ===== HERO MODULE =====
const Hero = {
    init() {
        this.hero = Utils.$('.hero');
        this.scrollIndicator = Utils.$('.scroll-indicator');
        
        this.setupParallax();
        this.setupScrollIndicator();
    },

    setupParallax() {
        if (!this.hero) return;

        Utils.on(window, 'scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            if (scrolled < this.hero.offsetHeight) {
                this.hero.style.transform = `translateY(${scrolled * CONFIG.paralaxSpeed}px)`;
            }
        }, 16)); // ~60fps
    },

    setupScrollIndicator() {
        if (!this.scrollIndicator) return;

        Utils.on(this.scrollIndicator, 'click', () => {
            const firstSection = Utils.$('#sejarah');
            if (firstSection) {
                Utils.smoothScrollTo(firstSection);
            }
        });
    }
};

// ===== ANIMATIONS MODULE =====
const Animations = {
    init() {
        this.setupIntersectionObserver();
        this.setupCardAnimations();
        this.setupContentSections();
    },

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: CONFIG.observerThreshold,
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

        // Observe cards
        Utils.$$('.card').forEach(card => observer.observe(card));

        // Observe vision and mission boxes
        Utils.$$('.vision-box, .mission-box').forEach(box => {
            observer.observe(box);
        });
    },

    setupCardAnimations() {
        Utils.on('.card', 'mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    },

    setupContentSections() {
        const contentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.2 });

        Utils.$$('.content-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateX(-20px)';
            section.style.transition = 'all 0.6s ease';
            contentObserver.observe(section);
        });
    }
};

// ===== TIMELINE MODULE =====
const Timeline = {
    init() {
        this.setupTimelineItems();
    },

    setupTimelineItems() {
        Utils.on('.timeline-item', 'click', function() {
            // Ripple effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, CONFIG.animationDuration);
        });
    }
};

// ===== INFO BOXES MODULE =====
const InfoBoxes = {
    init() {
        this.setupInfoBoxes();
    },

    setupInfoBoxes() {
        Utils.$$('.info-box').forEach((box, index) => {
            // Staggered entrance
            setTimeout(() => {
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }, index * 100);

            // Icon animation on hover
            Utils.on(box, 'mouseenter', function() {
                const icon = this.querySelector('.info-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });

            Utils.on(box, 'mouseleave', function() {
                const icon = this.querySelector('.info-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }
};

// ===== MISSION MODULE =====
const Mission = {
    init() {
        this.setupMissionList();
    },

    setupMissionList() {
        Utils.on('.mission-list li', 'click', function() {
            // Scale animation
            this.style.transform = 'scale(0.95) translateX(10px)';
            setTimeout(() => {
                this.style.transform = 'scale(1) translateX(10px)';
            }, 150);

            // Completed effect
            this.style.background = 'rgba(16, 185, 129, 0.2)';
            setTimeout(() => {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            }, 500);
        });
    }
};

// ===== ORGANIZATION MODULE =====
const Organization = {
    init() {
        this.setupOrgChart();
    },

    setupOrgChart() {
        Utils.$$('.org-box').forEach((box, index) => {
            // Staggered animation
            box.style.animationDelay = `${index * 0.1}s`;

            // Hover effects
            Utils.on(box, 'mouseenter', function() {
                this.style.transform = 'scale(1.05) rotate(2deg)';
            });

            Utils.on(box, 'mouseleave', function() {
                this.style.transform = 'scale(1) rotate(0deg)';
            });

            // Click pulse effect
            Utils.on(box, 'click', function() {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = '';
                }, 10);
            });
        });
    }
};

// ===== VIDEO MODULE =====
const Video = {
    init() {
        this.setupVideo();
    },

    setupVideo() {
        const videoContainer = Utils.$('.video-container iframe');
        if (!videoContainer) return;

        // Set video URL
        videoContainer.src = `https://www.youtube.com/embed/${CONFIG.videoId}`;

        // Lazy loading observer
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('✅ Video section is now visible');
                    videoObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        videoObserver.observe(videoContainer.parentElement);
    }
};

// ===== PERFORMANCE MODULE =====
const Performance = {
    init() {
        this.setupScrollRestoration();
        this.setupLoadingAnimation();
        this.logPerformance();
    },

    setupScrollRestoration() {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    },

    setupLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.style.opacity = '0';
            setTimeout(() => {
                document.body.style.transition = 'opacity 0.5s ease';
                document.body.style.opacity = '1';
            }, 100);
        });
    },

    logPerformance() {
        if (window.performance) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }
    }
};

// ===== ANALYTICS MODULE (Optional) =====
const Analytics = {
    init() {
        this.trackPageView();
        this.trackClicks();
        this.trackScrollDepth();
    },

    trackPageView() {
        console.log('📊 Page view tracked');
    },

    trackClicks() {
        Utils.on('.card', 'click', function() {
            const cardTitle = this.querySelector('h2')?.textContent;
            console.log(`🖱️ Card clicked: ${cardTitle}`);
        });
    },

    trackScrollDepth() {
        let maxScroll = 0;
        Utils.on(window, 'scroll', Utils.throttle(() => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            if (scrollPercent > maxScroll) {
                maxScroll = Math.floor(scrollPercent);
                if (maxScroll % 25 === 0) {
                    console.log(`📈 Scroll depth: ${maxScroll}%`);
                }
            }
        }, 1000));
    }
};

// ===== ACCESSIBILITY MODULE =====
const Accessibility = {
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
    },

    setupKeyboardNavigation() {
        // ESC key to close mobile menu
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Escape') {
                const navLinks = Utils.$('#navLinks');
                const menuToggle = Utils.$('.menu-toggle');
                if (navLinks.classList.contains('active')) {
                    Utils.removeClass(navLinks, 'active');
                    Utils.removeClass(menuToggle, 'active');
                }
            }
        });
    },

    setupFocusManagement() {
        // Add focus visible for keyboard users
        Utils.on(document, 'keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
            }
        });

        Utils.on(document, 'mousedown', () => {
            document.body.classList.remove('keyboard-user');
        });
    }
};

// ===== APP INITIALIZATION =====
const App = {
    init() {
        console.log('🚀 Initializing Pekanbaru Website...');

        // Initialize all modules
        Navigation.init();
        Hero.init();
        Animations.init();
        Timeline.init();
        InfoBoxes.init();
        Mission.init();
        Organization.init();
        Video.init();
        Performance.init();
        Accessibility.init();
        
        // Optional: Initialize analytics
        // Analytics.init();

        console.log('✅ Pekanbaru website initialized successfully!');
        console.log('🏛️ Kota Bertuah - Bersih, Tertib, Usaha Bersama, Aman, dan Harmonis');
    }
};

// ===== START APPLICATION =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// ===== EXPORT FOR TESTING (Optional) =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        Utils,
        Navigation,
        Hero,
        Animations,
        Timeline,
        InfoBoxes,
        Mission,
        Organization,
        Video,
        Performance,
        Analytics,
        Accessibility
    };
}