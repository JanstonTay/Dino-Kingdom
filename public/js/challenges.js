document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const challengesGrid = document.getElementById('challengesGrid');

    // Auth Check (Optional for viewing, but required for completing)
    // We allow viewing without login, but prompt on complete

    // Load Data
    function loadChallenges() {
        fetchMethod('/api/challenges', (status, challenges) => {
            if (status === 200) {
                renderChallenges(challenges);
            } else {
                challengesGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Failed to load challenges.</p>';
            }
        });
    }

    loadChallenges();

    // Create Challenge Form Logic
    const createChallengeSection = document.getElementById('createChallengeSection');
    const showCreateFormBtn = document.getElementById('showCreateFormBtn');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const createChallengeForm = document.getElementById('createChallengeForm');

    if (showCreateFormBtn) {
        showCreateFormBtn.addEventListener('click', () => {
            if (!userId || !token) {
                alert('Please login to create challenges.');
                window.location.href = 'login.html';
                return;
            }
            createChallengeSection.classList.remove('hidden');
            showCreateFormBtn.parentElement.classList.add('hidden');
        });
    }

    if (cancelCreateBtn) {
        cancelCreateBtn.addEventListener('click', () => {
            createChallengeSection.classList.add('hidden');
            showCreateFormBtn.parentElement.classList.remove('hidden');
            createChallengeForm.reset();
        });
    }

    if (createChallengeForm) {
        createChallengeForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const description = document.getElementById('challengeDescription').value;
            const points = parseInt(document.getElementById('challengePoints').value);

            if (!description || isNaN(points)) {
                alert('Please provide a valid description and points.');
                return;
            }

            const data = {
                user_id: userId,
                description: description,
                points: points
            };

            const submitBtn = createChallengeForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';

            fetchMethod('/api/challenges', (status, result) => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Challenge';

                if (status === 201) {
                    alert('Challenge created successfully!');
                    createChallengeSection.classList.add('hidden');
                    showCreateFormBtn.parentElement.classList.remove('hidden');
                    createChallengeForm.reset();
                    loadChallenges(); // Refresh the list
                } else {
                    alert(`Failed to create challenge: ${getErrorMessage(result)}`);
                }
            }, 'POST', data);
        });
    }

    function renderChallenges(challenges) {
        challengesGrid.innerHTML = '';

        if (challenges.length === 0) {
            challengesGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">No challenges available.</p>';
            return;
        }

        challenges.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.style.position = 'relative';

            card.innerHTML = `
                <h3>Challenge #${item.challenge_id}</h3>
                <p style="font-size: 1.1rem; margin: 1rem 0;">${item.description}</p>
                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: bold; color: var(--primary-color); white-space: nowrap; flex-shrink: 0; font-size: 1rem;">+${item.points}&nbsp;pts</span>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline complete-btn" data-id="${item.challenge_id}" data-desc="${item.description}">Complete</button>
                        <button class="btn btn-outline delete-btn" data-id="${item.challenge_id}" style="border-color: #ff4444; color: #ff4444;">Delete</button>
                    </div>
                </div>
            `;

            challengesGrid.appendChild(card);
        });

        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', handleComplete);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    function handleDelete(e) {
        const challengeId = e.target.dataset.id;
        if (!confirm('Are you sure you want to delete this challenge?')) return;

        fetchMethod(`/api/challenges/${challengeId}?user_id=${userId}`, (status, result) => {
            if (status === 204) {
                alert('Challenge deleted successfully!');
                loadChallenges(); // Refresh the list
            } else {
                alert(`Failed to delete challenge: ${getErrorMessage(result)}`);
            }
        }, 'DELETE');
    }

    function handleComplete(e) {
        if (!userId || !token) {
            alert('Please login to complete challenges.');
            window.location.href = 'login.html';
            return;
        }

        const btn = e.target;
        const challengeId = btn.dataset.id;
        const challengeDesc = btn.dataset.desc;

        const details = prompt(`How did you complete "${challengeDesc}"? (e.g. "Walked 2km")`);
        if (!details) return;

        btn.disabled = true;
        btn.textContent = 'Submitting...';

        const data = {
            user_id: userId,
            details: details
        };

        fetchMethod(`/api/challenges/${challengeId}/completions`, (status, result) => {
            if (status === 201) {
                alert(`Challenge completed! You earned points.`);
                btn.textContent = 'Completed';
                btn.classList.remove('btn-outline');
                btn.classList.add('btn-primary');
            } else {
                alert(`Submission failed: ${getErrorMessage(result)}`);
                btn.disabled = false;
                btn.textContent = 'Complete';
            }
        }, 'POST', data);
    }
});
