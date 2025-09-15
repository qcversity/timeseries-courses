// Form Handler for Registration
class FormHandler {
    constructor() {
        this.initializeForms();
    }

    initializeForms() {
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            registrationForm.addEventListener('submit', this.handleRegistration.bind(this));
        }

        // Add real-time validation
        this.addValidation();
    }

    async handleRegistration(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;

        // Show loading state
        this.showLoadingState(submitBtn);

        try {
            // Get form data
            const formData = new FormData(form);
            const data = this.formatFormData(formData);

            // Validate data
            const validation = this.validateFormData(data);
            if (!validation.isValid) {
                this.showAlert('error', validation.message);
                return;
            }

            // Here you would send to your backend
            // For now, we'll simulate a successful submission
            await this.submitRegistration(data);

            // Show success message
            this.showAlert('success', 'Thank you for registering! We will contact you within 24 hours with payment details.');

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('error', 'Something went wrong. Please try again or contact us directly.');
        } finally {
            // Reset button
            this.resetLoadingState(submitBtn, originalText);
        }
    }

    formatFormData(formData) {
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }

        // Add additional metadata
        data.timestamp = new Date().toISOString();
        data.course = 'Time Series Fundamentals - Part 1';
        data.source = 'website_registration';

        return data;
    }

    validateFormData(data) {
        // Required fields validation
        const requiredFields = ['name', 'email', 'phone', 'country'];
        for (let field of requiredFields) {
            if (!data[field]) {
                return {
                    isValid: false,
                    message: `Please fill in your ${field.replace('_', ' ')}.`
                };
            }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return {
                isValid: false,
                message: 'Please enter a valid email address.'
            };
        }

        // Name validation (at least 2 words)
        if (data.name.split(' ').length < 2) {
            return {
                isValid: false,
                message: 'Please enter your full name (first and last name).'
            };
        }

        return { isValid: true };
    }

    async submitRegistration(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // In a real application, you would send this to your backend
        // Example using fetch:
        /*
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return await response.json();
        */

        // For now, just log the data
        console.log('Registration data:', data);

        // You could also integrate with services like:
        // - EmailJS for sending emails
        // - Google Sheets API
        // - Formspree
        // - Netlify Forms

        return { success: true };
    }

    addValidation() {
        // Real-time email validation
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('blur', this.validateEmail.bind(this));
        }

        // Real-time phone validation
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhone.bind(this));
        }

        // Name validation
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', this.validateName.bind(this));
        }
    }

    validateEmail(e) {
        const input = e.target;
        const email = input.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        this.removeFieldError(input);

        if (email && !emailRegex.test(email)) {
            this.showFieldError(input, 'Please enter a valid email address.');
        }
    }

    validateName(e) {
        const input = e.target;
        const name = input.value.trim();

        this.removeFieldError(input);

        if (name && name.split(' ').length < 2) {
            this.showFieldError(input, 'Please enter your full name.');
        }
    }

    formatPhone(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');

        // Basic international phone formatting
        if (value.length > 0) {
            if (value.startsWith('213')) { // Algeria
                value = value.replace(/(\d{3})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '+$1 $2$3 $4 $5 $6');
            } else if (value.length >= 10) {
                // Generic international format
                value = '+' + value;
            }
        }

        input.value = value;
    }

    showFieldError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.field-error');

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            formGroup.appendChild(errorElement);
        }

        errorElement.textContent = message;
        input.classList.add('error');
    }

    removeFieldError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.field-error');

        if (errorElement) {
            errorElement.remove();
        }

        input.classList.remove('error');
    }

    showLoadingState(button) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Processing...';
    }

    resetLoadingState(button, originalText) {
        button.disabled = false;
        button.textContent = originalText;
    }

    showAlert(type, message) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        // Insert after form container
        const formContainer = document.querySelector('.form-container');
        formContainer.parentNode.insertBefore(alert, formContainer.nextSibling);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);

        // Scroll to alert
        alert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormHandler();
});