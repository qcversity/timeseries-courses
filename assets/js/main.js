// Main JavaScript for Time Series Course Website
class CourseWebsite {
    constructor() {
        this.initializeApp();
        this.setupEventListeners();
        this.handlePageLoad();
    }

    initializeApp() {
        // Initialize course data
        this.courseData = {
            part1: {
                title: "Time Series Fundamentals",
                duration: "5 days",
                price: { algeria: "15,000 DZD", international: "$99 USD" },
                status: "available",
                dates: "January 20-24, 2025",
                features: [
                    "ARIMA Models & Implementation",
                    "Stationarity Testing (ADF, KPSS)",
                    "Time Series Decomposition",
                    "Forecasting Techniques",
                    "Real Business Applications",
                    "Certificate of Completion"
                ]
            },
            part2: {
                title: "Advanced Time Series",
                duration: "5 days",
                price: { algeria: "18,000 DZD", international: "$119 USD" },
                status: "coming_soon",
                dates: "March 2025",
                features: [
                    "Deep Learning for Time Series",
                    "LSTM & GRU Networks",
                    "Advanced Forecasting Models",
                    "Multivariate Time Series",
                    "Real-time Processing",
                    "Advanced Certificate"
                ]
            },
            part3: {
                title: "Applied Time Series",
                duration: "5 days",
                price: { algeria: "20,000 DZD", international: "$139 USD" },
                status: "coming_soon",
                dates: "May 2025",
                features: [
                    "End-to-End Projects",
                    "Production Deployment",
                    "API Development",
                    "Dashboard Creation",
                    "Performance Optimization",
                    "Professional Certificate"
                ]
            }
        };

        // Initialize user preferences
        this.userPreferences = this.loadUserPreferences();
    }

    setupEventListeners() {
        // Course card interactions
        this.setupCourseCards();

        // Pricing toggle
        this.setupPricingToggle();

        // Scroll animations
        this.setupScrollAnimations();

        // Early bird countdown
        this.setupCountdown();

        // Course comparison
        this.setupCourseComparison();
    }

    setupCourseCards() {
        const courseCards = document.querySelectorAll('.course-card');

        courseCards.forEach((card, index) => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    this.handleCourseCardClick(index + 1);
                }
            });

            // Add hover effects for available courses
            if (!card.classList.contains('coming-soon')) {
                card.addEventListener('mouseenter', () => {
                    this.showCoursePreview(index + 1);
                });

                card.addEventListener('mouseleave', () => {
                    this.hideCoursePreview();
                });
            }
        });
    }

    handleCourseCardClick(courseNumber) {
        const courseKey = `part${courseNumber}`;
        const course = this.courseData[courseKey];

        if (course.status === 'available') {
            // Scroll to registration form
            const registrationSection = document.querySelector('.section:has(#registration-form)');
            if (registrationSection) {
                registrationSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            // Show coming soon modal
            this.showComingSoonModal(course);
        }
    }

    showCoursePreview(courseNumber) {
        const courseKey = `part${courseNumber}`;
        const course = this.courseData[courseKey];

        if (course.status !== 'available') return;

        // Create preview tooltip
        const preview = document.createElement('div');
        preview.className = 'course-preview';
        preview.innerHTML = `
            <h4>${course.title}</h4>
            <p><strong>Duration:</strong> ${course.duration}</p>
            <p><strong>Dates:</strong> ${course.dates}</p>
            <div class="preview-features">
                ${course.features.slice(0, 3).map(feature =>
            `<div class="preview-feature">✓ ${feature}</div>`
        ).join('')}
            </div>
            <p class="preview-action">Click to register →</p>
        `;

        document.body.appendChild(preview);

        // Position the preview
        this.positionPreview(preview);
    }

    hideCoursePreview() {
        const preview = document.querySelector('.course-preview');
        if (preview) {
            preview.remove();
        }
    }

    positionPreview(preview) {
        const rect = event.currentTarget.getBoundingClientRect();
        preview.style.position = 'fixed';
        preview.style.top = rect.top + 'px';
        preview.style.left = (rect.right + 10) + 'px';
        preview.style.zIndex = '1001';

        // Adjust if preview goes off screen
        setTimeout(() => {
            const previewRect = preview.getBoundingClientRect();
            if (previewRect.right > window.innerWidth) {
                preview.style.left = (rect.left - previewRect.width - 10) + 'px';
            }
        }, 0);
    }

    showComingSoonModal(course) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${course.title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="coming-soon-badge">Coming Soon</div>
                    <p><strong>Expected Launch:</strong> ${course.dates}</p>
                    <p><strong>Duration:</strong> ${course.duration}</p>
                    <p><strong>Price:</strong> ${course.price.international} / ${course.price.algeria}</p>
                    
                    <h4>What You'll Learn:</h4>
                    <ul class="modal-features">
                        ${course.features.map(feature =>
            `<li>${feature}</li>`
        ).join('')}
                    </ul>
                    
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="courseWebsite.notifyMe('${course.title}')">
                            Notify Me When Available
                        </button>
                        <button class="btn btn-outline" onclick="courseWebsite.closeModal()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').onclick = () => this.closeModal();
        modal.querySelector('.modal-overlay').onclick = (e) => {
            if (e.target === modal) this.closeModal();
        };

        // Animate in
        setTimeout(() => modal.classList.add('show'), 10);
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    notifyMe(courseTitle) {
        // Simple email collection for course notifications
        const email = prompt(`Enter your email to be notified when "${courseTitle}" becomes available:`);

        if (email && this.validateEmail(email)) {
            // Store notification request
            this.storeNotificationRequest(courseTitle, email);

            // Show success message
            alert('Thank you! We\'ll notify you when this course becomes available.');
            this.closeModal();
        } else if (email) {
            alert('Please enter a valid email address.');
        }
    }

    storeNotificationRequest(courseTitle, email) {
        let notifications = JSON.parse(localStorage.getItem('courseNotifications') || '[]');
        notifications.push({
            course: courseTitle,
            email: email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('courseNotifications', JSON.stringify(notifications));

        // In a real app, you'd send this to your backend
        console.log('Notification request stored:', { courseTitle, email });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    setupPricingToggle() {
        // Create currency toggle if it doesn't exist
        const pricingSection = document.querySelector('.section:has(.pricing-grid)');
        if (pricingSection && !document.querySelector('.currency-toggle')) {
            const toggle = document.createElement('div');
            toggle.className = 'currency-toggle';
            toggle.innerHTML = `
                <div class="toggle-container">
                    <span class="toggle-label ${this.userPreferences.currency === 'dzd' ? 'active' : ''}">DZD</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${this.userPreferences.currency === 'usd' ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <span class="toggle-label ${this.userPreferences.currency === 'usd' ? 'active' : ''}">USD</span>
                </div>
            `;

            pricingSection.querySelector('h2').after(toggle);

            // Event listener
            toggle.querySelector('input').addEventListener('change', (e) => {
                this.toggleCurrency(e.target.checked ? 'usd' : 'dzd');
            });
        }
    }

    toggleCurrency(currency) {
        this.userPreferences.currency = currency;
        this.saveUserPreferences();

        // Update UI
        this.updateCurrencyDisplay();
    }

    updateCurrencyDisplay() {
        const currency = this.userPreferences.currency;

        // Update toggle labels
        document.querySelectorAll('.toggle-label').forEach(label => {
            label.classList.remove('active');
        });

        const activeLabel = document.querySelector(`.toggle-label:${currency === 'usd' ? 'last-child' : 'first-child'}`);
        if (activeLabel) activeLabel.classList.add('active');

        // Update pricing cards (you can enhance this based on your needs)
        if (currency === 'dzd') {
            // Highlight DZD pricing
            document.querySelectorAll('.price-card').forEach((card, index) => {
                if (index === 0) card.classList.add('highlighted');
                else card.classList.remove('highlighted');
            });
        } else {
            // Highlight USD pricing
            document.querySelectorAll('.price-card').forEach((card, index) => {
                if (index === 1) card.classList.add('highlighted');
                else card.classList.remove('highlighted');
            });
        }
    }

    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('animate-ready');
            observer.observe(section);
        });
    }

    setupCountdown() {
        // Early bird countdown
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown-timer';

        const earlyBirdText = document.querySelector('p[style*="color: #dc2626"]');
        if (earlyBirdText) {
            countdownElement.innerHTML = `
                <div class="countdown-container">
                    <div class="countdown-label">Early Bird Ends In:</div>
                    <div class="countdown-display">
                        <div class="countdown-item">
                            <span class="countdown-number" id="days">00</span>
                            <span class="countdown-text">Days</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="hours">00</span>
                            <span class="countdown-text">Hours</span>
                        </div>
                        <div class="countdown-item">
                            <span class="countdown-number" id="minutes">00</span>
                            <span class="countdown-text">Minutes</span>
                        </div>
                    </div>
                </div>
            `;

            earlyBirdText.after(countdownElement);

            // Start countdown
            this.startCountdown(new Date('2024-12-31 23:59:59'));
        }
    }

    startCountdown(endDate) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = endDate.getTime() - now;

            if (distance < 0) {
                document.querySelector('.countdown-timer').style.display = 'none';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        };

        updateCountdown();
        setInterval(updateCountdown, 60000); // Update every minute
    }

    setupCourseComparison() {
        // Add course comparison functionality
        const comparisonButton = document.createElement('button');
        comparisonButton.className = 'btn btn-outline comparison-btn';
        comparisonButton.textContent = 'Compare All Parts';
        comparisonButton.onclick = () => this.showCourseComparison();

        const courseGrid = document.querySelector('.course-grid');
        if (courseGrid) {
            courseGrid.after(comparisonButton);
        }
    }

    showCourseComparison() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay comparison-modal';
        modal.innerHTML = `
            <div class="modal large">
                <div class="modal-header">
                    <h3>Course Comparison</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="comparison-table">
                        <div class="comparison-header">
                            <div class="comparison-cell">Feature</div>
                            <div class="comparison-cell">Part 1</div>
                            <div class="comparison-cell">Part 2</div>
                            <div class="comparison-cell">Part 3</div>
                        </div>
                        ${this.generateComparisonRows()}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.modal-close').onclick = () => this.closeModal();
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal();
        };

        setTimeout(() => modal.classList.add('show'), 10);
    }

    generateComparisonRows() {
        const features = [
            ['Duration', '5 days', '5 days', '5 days'],
            ['Level', 'Beginner', 'Intermediate', 'Advanced'],
            ['Price (USD)', '$99', '$119', '$139'],
            ['Price (DZD)', '15,000', '18,000', '20,000'],
            ['Certificate', '✓', '✓', '✓'],
            ['Live Sessions', '✓', '✓', '✓'],
            ['Projects', '3', '5', '8'],
            ['Status', 'Available', 'Coming Soon', 'Coming Soon']
        ];

        return features.map(row => `
            <div class="comparison-row">
                ${row.map((cell, index) => `
                    <div class="comparison-cell ${index === 0 ? 'feature-name' : ''}">${cell}</div>
                `).join('')}
            </div>
        `).join('');
    }

    handlePageLoad() {
        // Page-specific initializations
        this.detectUserLocation();
        this.updateCurrencyDisplay();
        this.checkForUrlParams();
        this.initializeAnalytics();
    }

    detectUserLocation() {
        // Simple location detection for pricing
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (timezone.includes('Algeria') || timezone.includes('Africa')) {
            this.userPreferences.currency = 'dzd';
        }
    }

    checkForUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);

        // Handle referral codes
        const ref = urlParams.get('ref');
        if (ref) {
            this.handleReferral(ref);
        }

        // Handle direct course links
        const course = urlParams.get('course');
        if (course) {
            this.highlightCourse(course);
        }
    }

    handleReferral(referralCode) {
        // Store referral for analytics
        sessionStorage.setItem('referral', referralCode);
        console.log('Referral tracked:', referralCode);
    }

    highlightCourse(courseNumber) {
        const courseCard = document.querySelector(`.course-card:nth-child(${courseNumber})`);
        if (courseCard) {
            courseCard.scrollIntoView({ behavior: 'smooth' });
            courseCard.classList.add('pulse');
            setTimeout(() => courseCard.classList.remove('pulse'), 2000);
        }
    }

    initializeAnalytics() {
        // Track page view
        this.trackEvent('page_view', {
            page: 'course_landing',
            course: 'part_1'
        });
    }

    trackEvent(eventName, parameters) {
        // Simple event tracking (integrate with Google Analytics, etc.)
        console.log('Event tracked:', eventName, parameters);

        // You can integrate with analytics services here
        // Example: gtag('event', eventName, parameters);
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('userPreferences');
        return saved ? JSON.parse(saved) : {
            currency: 'usd',
            theme: 'light',
            language: 'en'
        };
    }

    saveUserPreferences() {
        localStorage.setItem('userPreferences', JSON.stringify(this.userPreferences));
    }
}

// Initialize the application
let courseWebsite;

document.addEventListener('DOMContentLoaded', () => {
    courseWebsite = new CourseWebsite();
});

// Global utility functions
window.CourseUtils = {
    formatPrice: (amount, currency) => {
        if (currency === 'dzd') {
            return new Intl.NumberFormat('ar-DZ', {
                style: 'currency',
                currency: 'DZD'
            }).format(amount);
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDate: (date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }
};