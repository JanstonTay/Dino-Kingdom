document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const authLink = document.getElementById('authLink');

    if (token && userId) {
        // User is logged in - update nav
        if (authLink) {
            authLink.innerHTML = `<a href="#" id="logoutBtn" class="btn btn-outline">Logout</a>`;

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user_id');
                localStorage.removeItem('username');
                localStorage.removeItem('token');
                window.location.href = 'index.html';
            });
        }
    }

    // Hamburger Menu Toggle
    const navbarToggle = document.getElementById('navbarToggle');
    const navLinks = document.getElementById('navLinks');

    if (navbarToggle && navLinks) {
        navbarToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
    }
});

/**
 * Standardized helper to extract error messages from API responses
 */
function getErrorMessage(data) {
    if (!data) return "Unknown error";
    // Check various common error keys
    return data.message || data.error || data.err || (typeof data === 'string' ? data : "Unknown failure");
}

// Helper function to get auth token for API calls
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to check if user is authenticated
function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

// Helper function to require auth (redirect to login if not authenticated)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}
