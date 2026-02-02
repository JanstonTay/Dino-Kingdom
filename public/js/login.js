document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = 'Logging in...';
    messageDiv.style.color = 'var(--text-muted)';

    const data = {
        email: email,
        password: password
    };

    fetchMethod('/api/users/login', (status, response) => {
        if (status === 200) {
            messageDiv.textContent = 'Login successful! Redirecting...';
            messageDiv.style.color = 'var(--primary-color)';

            // Save token
            localStorage.setItem('token', response.token);

            // Decode token to get userId
            try {
                const payload = JSON.parse(atob(response.token.split('.')[1]));
                localStorage.setItem('user_id', payload.userId);
            } catch (e) {
                console.error('Token decode error:', e);
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else if (status === 401) {
            messageDiv.textContent = 'Wrong password.';
            messageDiv.style.color = '#ff4d4d';
        } else if (status === 404) {
            messageDiv.textContent = 'User not found.';
            messageDiv.style.color = '#ff4d4d';
        } else {
            messageDiv.textContent = `Error: ${response.message || 'Login failed'}`;
            messageDiv.style.color = '#ff4d4d';
        }
    }, 'POST', data);
});
