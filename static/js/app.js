// LibPostal API Interactive Demo

class LibPostalDemo {
    constructor() {
        this.currentMode = 'parse';
        this.baseUrl = window.location.origin;
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.parseBtn = document.getElementById('parseBtn');
        this.normalizeBtn = document.getElementById('normalizeBtn');
        this.addressInput = document.getElementById('addressInput');
        this.languageInput = document.getElementById('languageInput');
        this.countryInput = document.getElementById('countryInput');
        this.levelSelect = document.getElementById('levelSelect');
        this.submitBtn = document.getElementById('submitBtn');
        this.responseOutput = document.getElementById('responseOutput');
        this.copyBtn = document.getElementById('copyBtn');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.parseOptions = document.getElementById('parseOptions');
        this.normalizeOptions = document.getElementById('normalizeOptions');
    }

    bindEvents() {
        this.parseBtn.addEventListener('click', () => this.switchMode('parse'));
        this.normalizeBtn.addEventListener('click', () => this.switchMode('normalize'));
        this.submitBtn.addEventListener('click', () => this.processRequest());
        this.copyBtn.addEventListener('click', () => this.copyResponse());
        
        // Allow Enter key to submit
        this.addressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.processRequest();
            }
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        if (mode === 'parse') {
            this.parseBtn.classList.add('bg-blue-600', 'text-white');
            this.parseBtn.classList.remove('text-gray-600');
            this.normalizeBtn.classList.remove('bg-blue-600', 'text-white');
            this.normalizeBtn.classList.add('text-gray-600');
            
            this.parseOptions.classList.remove('hidden');
            this.normalizeOptions.classList.add('hidden');
            this.submitBtn.textContent = 'Parse Address';
        } else {
            this.normalizeBtn.classList.add('bg-blue-600', 'text-white');
            this.normalizeBtn.classList.remove('text-gray-600');
            this.parseBtn.classList.remove('bg-blue-600', 'text-white');
            this.parseBtn.classList.add('text-gray-600');
            
            this.parseOptions.classList.add('hidden');
            this.normalizeOptions.classList.remove('hidden');
            this.submitBtn.textContent = 'Normalize Address';
        }
    }

    async processRequest() {
        const address = this.addressInput.value.trim();
        
        if (!address) {
            this.showError('Please enter an address');
            return;
        }

        this.showLoading(true);
        
        try {
            let response;
            
            if (this.currentMode === 'parse') {
                response = await this.parseAddress(address);
            } else {
                response = await this.normalizeAddress(address);
            }
            
            this.displayResponse(response);
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.showLoading(false);
        }
    }

    async parseAddress(address) {
        const requestBody = {
            address: address
        };

        const language = this.languageInput.value.trim();
        const country = this.countryInput.value.trim();

        if (language) requestBody.language = language;
        if (country) requestBody.country = country;

        const response = await fetch(`${this.baseUrl}/api/v1/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    async normalizeAddress(address) {
        const requestBody = {
            address: address,
            level: this.levelSelect.value
        };

        const response = await fetch(`${this.baseUrl}/api/v1/normalize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    }

    displayResponse(data) {
        const formattedJson = JSON.stringify(data, null, 2);
        this.responseOutput.innerHTML = `<code class="language-json">${this.escapeHtml(formattedJson)}</code>`;
        
        // Re-highlight syntax
        if (window.Prism) {
            Prism.highlightElement(this.responseOutput.querySelector('code'));
        }
    }

    showError(message) {
        const errorResponse = {
            success: false,
            error: {
                message: message,
                timestamp: new Date().toISOString()
            }
        };
        this.displayResponse(errorResponse);
    }

    showLoading(show) {
        if (show) {
            this.loadingIndicator.classList.remove('hidden');
            this.submitBtn.disabled = true;
            this.submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.loadingIndicator.classList.add('hidden');
            this.submitBtn.disabled = false;
            this.submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    copyResponse() {
        const responseText = this.responseOutput.textContent;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(responseText).then(() => {
                this.showCopyFeedback();
            }).catch(err => {
                console.error('Failed to copy: ', err);
                this.fallbackCopy(responseText);
            });
        } else {
            this.fallbackCopy(responseText);
        }
    }

    fallbackCopy(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyFeedback();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }

    showCopyFeedback() {
        const originalText = this.copyBtn.textContent;
        this.copyBtn.textContent = 'Copied!';
        this.copyBtn.classList.add('bg-green-200');
        
        setTimeout(() => {
            this.copyBtn.textContent = originalText;
            this.copyBtn.classList.remove('bg-green-200');
        }, 2000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LibPostalDemo();
});

// Smooth scrolling for anchor links
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
