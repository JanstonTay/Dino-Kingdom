document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message');

    // Validation
    if (password !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match!';
        messageDiv.style.color = '#ff4d4d';
        return;
    }

    if (password.length < 6) {
        messageDiv.textContent = 'Password must be at least 6 characters.';
        messageDiv.style.color = '#ff4d4d';
        return;
    }

    messageDiv.textContent = 'Registering...';
    messageDiv.style.color = 'var(--text-muted)';

    const data = {
        username: username,
        email: email,
        password: password
    };

    fetchMethod('/api/users/register', (status, response) => {
        if (status === 200) {
            messageDiv.textContent = 'Registration successful! Redirecting...';
            messageDiv.style.color = 'var(--primary-color)';

            // Save token and redirect
            localStorage.setItem('token', response.token);

            // Decode token to get userId (simple base64 decode of payload)
            try {
                const payload = JSON.parse(atob(response.token.split('.')[1]));
                localStorage.setItem('user_id', payload.userId);
            } catch (e) {
                console.error('Token decode error:', e);
            }

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else if (status === 409) {
            messageDiv.textContent = response.message || 'Email or username already taken.';
            messageDiv.style.color = '#ff4d4d';
        } else {
            messageDiv.textContent = `Error: ${response.message || 'Registration failed'}`;
            messageDiv.style.color = '#ff4d4d';
        }
    }, 'POST', data);
});
