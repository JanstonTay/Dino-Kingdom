const axios = require('axios');

async function test() {
    try {
        const response = await axios.get('http://localhost:3000/api/challenges?user_id=3');
        console.log('Challenges for User 3:');
        response.data.forEach(c => {
            console.log(`- ID: ${c.challenge_id}, Completion: ${c.completion_details}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
