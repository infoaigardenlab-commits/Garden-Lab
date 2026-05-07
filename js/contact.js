document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        toast.innerHTML = `
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Basic validation
            let isValid = true;
            let errorMessages = [];
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            // Validate name
            if (!nameInput.value.trim()) {
                isValid = false;
                nameInput.closest('.form-group').classList.add('has-error');
                const helpBlock = nameInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = 'Name is required.';
                }
                errorMessages.push('Name is required');
            } else {
                nameInput.closest('.form-group').classList.remove('has-error');
                const helpBlock = nameInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = '';
                }
            }

            // Validate subject
            if (!emailInput.value.trim()) {
                isValid = false;
                emailInput.closest('.form-group').classList.add('has-error');
                const helpBlock = emailInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = 'Email is required.';
                }
                errorMessages.push('Email is required');
            } else if (!isValidEmail(emailInput.value.trim())) {
                isValid = false;
                emailInput.closest('.form-group').classList.add('has-error');
                const helpBlock = emailInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = 'Please enter a valid email address.';
                }
                errorMessages.push('Invalid email');
            } else {
                emailInput.closest('.form-group').classList.remove('has-error');
                const helpBlock = emailInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = '';
                }
            }

            // Validate subject
            if (!subjectInput.value.trim()) {
                isValid = false;
                subjectInput.closest('.form-group').classList.add('has-error');
                const helpBlock = subjectInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = 'Subject is required.';
                }
                errorMessages.push('Subject is required');
            } else {
                subjectInput.closest('.form-group').classList.remove('has-error');
                const helpBlock = subjectInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = '';
                }
            }

            // Validate message
            if (!messageInput.value.trim()) {
                isValid = false;
                messageInput.closest('.form-group').classList.add('has-error');
                const helpBlock = messageInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = 'Message is required.';
                }
                errorMessages.push('Message is required');
            } else {
                messageInput.closest('.form-group').classList.remove('has-error');
                const helpBlock = messageInput.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = '';
                }
            }

            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';

                setTimeout(() => {
                    showToast('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1500);
            } else {
                showToast('Please fill in all required fields.', 'error');
            }
        });

        // Clear errors on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function () {
                this.closest('.form-group').classList.remove('has-error');
                const helpBlock = this.nextElementSibling;
                if (helpBlock && helpBlock.classList.contains('help-block')) {
                    helpBlock.textContent = '';
                }
            });
        });
    }
});
