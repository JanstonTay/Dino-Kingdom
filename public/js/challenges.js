document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const challengesGrid = document.getElementById('challengesGrid');

    // Auth Check (Optional for viewing, but required for completing)
    // We allow viewing without login, but prompt on complete

    // Load Data
    fetchMethod('/api/challenges', (status, challenges) => {
        if (status === 200) {
            renderChallenges(challenges);
        } else {
            challengesGrid.innerHTML = '<p class="text-center text-muted" style="width: 100%; grid-column: 1/-1;">Failed to load challenges.</p>';
        }
    });

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
                <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--primary-color);">+${item.points} pts</span>
                    <button class="btn btn-outline complete-btn" data-id="${item.challenge_id}" data-desc="${item.description}">Complete</button>
                </div>
            `;

            challengesGrid.appendChild(card);
        });

        document.querySelectorAll('.complete-btn').forEach(btn => {
            btn.addEventListener('click', handleComplete);
        });
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
