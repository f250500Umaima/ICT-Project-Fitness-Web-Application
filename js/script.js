// Main JavaScript file for PowerFlex Gym website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Testimonials Slider
    const testimonialsSlider = document.querySelector('.testimonials-slider');
    const testimonialSlides = document.querySelectorAll('.testimonial');
    const sliderBtns = document.querySelectorAll('.slider-btn');
    
    if (testimonialsSlider && testimonialSlides.length > 0) {
        let currentSlide = 0;
        
        function showSlide(n) {
            testimonialsSlider.style.transform = `translateX(-${n * 100}%)`;
            
            // Update active button
            sliderBtns.forEach(btn => btn.classList.remove('active'));
            if (sliderBtns[n]) {
                sliderBtns[n].classList.add('active');
            }
            
            currentSlide = n;
        }
        
        // Add click events to slider buttons
        sliderBtns.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto slide testimonials
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        }, 5000);
    }
    
    // Animated Counters
    const counters = document.querySelectorAll('.counter-number');
    
    if (counters.length > 0) {
        const speed = 200;
        
        function animateCounter(counter) {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => animateCounter(counter), 10);
            } else {
                counter.innerText = target;
            }
        }
        
        // Start counter animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => {
            observer.observe(counter);
        });
    }
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.padding = '10px 0';
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            } else {
                header.style.padding = '20px 0';
                header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            }
        }
    });
    
    // Product Filtering System
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (filterButtons.length > 0 && productCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');
                
                const filterValue = button.getAttribute('data-filter');
                
                productCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Shopping Cart Functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = [];
    
    // Initialize cart from localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCart();
    }
    
    // Toggle cart sidebar
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
        
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }
    }
    
    // Add to cart functionality
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = e.target.getAttribute('data-product');
                const price = parseFloat(e.target.getAttribute('data-price'));
                
                addToCart(product, price);
                
                // Show confirmation
                const originalText = e.target.textContent;
                e.target.textContent = 'Added to Cart!';
                e.target.style.backgroundColor = 'var(--accent-secondary)';
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.backgroundColor = '';
                }, 2000);
            });
        });
    }
    
    function addToCart(product, price) {
        const existingItem = cart.find(item => item.product === product);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                product: product,
                price: price,
                quantity: 1
            });
        }
        
        updateCart();
        saveCartToLocalStorage();
    }
    
    function removeFromCart(product) {
        cart = cart.filter(item => item.product !== product);
        updateCart();
        saveCartToLocalStorage();
    }
    
    function updateCart() {
        // Update cart items display
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.product}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</p>
                        </div>
                        <button class="cart-item-remove" data-product="${item.product}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const product = e.target.closest('button').getAttribute('data-product');
                        removeFromCart(product);
                    });
                });
            }
        }
        
        // Update cart total
        if (cartTotal) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = total.toFixed(2);
        }
        
        // Update cart count
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }
    
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            alert('Thank you for your purchase! This is a demo - in a real application, you would be redirected to a checkout page.');
            cart = [];
            updateCart();
            saveCartToLocalStorage();
            if (cartSidebar) {
                cartSidebar.classList.remove('active');
            }
        });
    }
    
    // Form Validation
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const contactForm = document.getElementById('contact-form');
    
    // Registration Form Validation
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateRegistrationForm()) {
                // Form is valid - in a real application, you would submit to a server here
                alert('Registration submitted successfully! Welcome to PowerFlex Gym.');
                registrationForm.reset();
            }
        });
    }
    
    function validateRegistrationForm() {
        let isValid = true;
        const form = registrationForm;
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email
        const email = form.querySelector('#email');
        if (email && email.value && !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate age
        const age = form.querySelector('#age');
        if (age && age.value) {
            const ageValue = parseInt(age.value);
            if (ageValue < 16 || ageValue > 100) {
                showError(age, 'Age must be between 16 and 100');
                isValid = false;
            }
        }
        
        // Validate phone
        const phone = form.querySelector('#phone');
        if (phone && phone.value && !isValidPhone(phone.value)) {
            showError(phone, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Login/Signup Form Tabs
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update active tab
                authTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show corresponding form
                authForms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tabName}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Login Form Validation
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateLoginForm()) {
                // Form is valid - in a real application, you would submit to a server here
                alert('Login successful! Redirecting to your dashboard...');
                loginForm.reset();
            }
        });
    }
    
    function validateLoginForm() {
        let isValid = true;
        const form = loginForm;
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Signup Form Validation
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateSignupForm()) {
                // Form is valid - in a real application, you would submit to a server here
                alert('Account created successfully! Welcome to PowerFlex Gym.');
                signupForm.reset();
            }
        });
        
        // Password strength indicator
        const passwordInput = signupForm.querySelector('#signup-password');
        const strengthBar = signupForm.querySelector('.strength-bar');
        const strengthText = signupForm.querySelector('.strength-text');
        
        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                strengthBar.style.width = `${strength.percentage}%`;
                strengthBar.style.backgroundColor = strength.color;
                strengthText.textContent = strength.text;
            });
        }
    }
    
    function validateSignupForm() {
        let isValid = true;
        const form = signupForm;
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email
        const email = form.querySelector('#signup-email');
        if (email && email.value && !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate password strength
        const password = form.querySelector('#signup-password');
        if (password && password.value) {
            const strength = calculatePasswordStrength(password.value);
            if (strength.percentage < 60) {
                showError(password, 'Please choose a stronger password');
                isValid = false;
            }
        }
        
        // Validate password confirmation
        const passwordConfirm = form.querySelector('#signup-confirm');
        if (password && passwordConfirm && password.value !== passwordConfirm.value) {
            showError(passwordConfirm, 'Passwords do not match');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Contact Form Validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateContactForm()) {
                // Form is valid - in a real application, you would submit to a server here
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            }
        });
    }
    
    function validateContactForm() {
        let isValid = true;
        const form = contactForm;
        
        // Clear previous error messages
        form.querySelectorAll('.error-message').forEach(msg => {
            msg.textContent = '';
        });
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email
        const email = form.querySelector('#contact-email');
        if (email && email.value && !isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }
        
        return isValid;
    }
    
    // Utility Functions
    function showError(field, message) {
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
        field.style.borderColor = 'var(--accent-secondary)';
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        let feedback = '';
        let color = '';
        
        // Length check
        if (password.length >= 8) strength += 25;
        
        // Lowercase check
        if (/[a-z]/.test(password)) strength += 25;
        
        // Uppercase check
        if (/[A-Z]/.test(password)) strength += 25;
        
        // Number/Special character check
        if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) strength += 25;
        
        // Determine feedback and color
        if (strength < 50) {
            feedback = 'Weak';
            color = 'var(--accent-secondary)';
        } else if (strength < 75) {
            feedback = 'Medium';
            color = 'orange';
        } else {
            feedback = 'Strong';
            color = 'var(--accent)';
        }
        
        return {
            percentage: strength,
            text: feedback,
            color: color
        };
    }
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }
    
    // Countdown Timer for Offers Page
    const countdownDays = document.getElementById('days');
    const countdownHours = document.getElementById('hours');
    const countdownMinutes = document.getElementById('minutes');
    const countdownSeconds = document.getElementById('seconds');
    
    if (countdownDays && countdownHours && countdownMinutes && countdownSeconds) {
        // Set the date we're counting down to (3 days from now)
        const countDownDate = new Date();
        countDownDate.setDate(countDownDate.getDate() + 3);
        
        // Update the count down every 1 second
        const countdownFunction = setInterval(function() {
            // Get today's date and time
            const now = new Date().getTime();
            
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            
            // Time calculations for days, hours, minutes and seconds
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Display the result
            countdownDays.textContent = days.toString().padStart(2, '0');
            countdownHours.textContent = hours.toString().padStart(2, '0');
            countdownMinutes.textContent = minutes.toString().padStart(2, '0');
            countdownSeconds.textContent = seconds.toString().padStart(2, '0');
            
            // If the count down is finished, write some text
            if (distance < 0) {
                clearInterval(countdownFunction);
                countdownDays.textContent = '00';
                countdownHours.textContent = '00';
                countdownMinutes.textContent = '00';
                countdownSeconds.textContent = '00';
            }
        }, 1000);
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity to 0 for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});