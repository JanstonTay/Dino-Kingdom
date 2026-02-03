
const BASE_URL = 'http://localhost:3000/api';
let token = '';
let userId = null;

async function runTest() {
    try {
        console.log('--- Phase 1: Registration ---');
        const regRes = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'tester' + Date.now(),
                email: 'test' + Date.now() + '@example.com',
                password: 'password123'
            })
        });
        const regData = await regRes.json();
        console.log('Reg Status:', regRes.status);
        console.log('Reg Data:', regData);

        if (regRes.status !== 200 && regRes.status !== 201) {
            console.error('Registration failed, stopping test.');
            return;
        }
        token = regData.token;
        // Decode token to get userId (manual decode)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        userId = payload.userId;
        console.log('User ID:', userId);

        console.log('\n--- Phase 2: Get Initial Points ---');
        const userRes = await fetch(`${BASE_URL}/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const userData = await userRes.json();
        console.log('User Status:', userRes.status);
        console.log('User Data:', userData);

        console.log('\n--- Phase 3: Challenge Completion ---');
        const compRes = await fetch(`${BASE_URL}/challenges/1/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                details: 'Testing points'
            })
        });
        const compData = await compRes.json();
        console.log('Comp Status:', compRes.status);
        console.log('Comp Data:', compData);

        console.log('\n--- Phase 4: Purchase (Egg) ---');
        const purRes = await fetch(`${BASE_URL}/userPurchases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                item_type: 'egg',
                item_id: 1,
                quantity: 1
            })
        });
        const purData = await purRes.json();
        console.log('Purchase Status:', purRes.status);
        console.log('Purchase Data:', purData);

        console.log('\n--- Phase 5: Feeding ---');
        // Need a dino and some food. 
        // Let's assume user has food from purchase? No, item_id 1 is egg.
        // Let's buy food first.
        console.log('Buying Food...');
        await fetch(`${BASE_URL}/userPurchases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                item_type: 'food',
                item_id: 1,
                quantity: 1
            })
        });

        // Hatch egg to get dino
        console.log('Hatching Egg...');
        const hatchRes = await fetch(`${BASE_URL}/hatchEvents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                user_id: userId,
                egg_type_id: 1
            })
        });
        const hatchData = await hatchRes.json();
        console.log('Hatch Data:', hatchData);
        const dinoId = hatchData.id || (hatchData.dinosaur && hatchData.dinosaur.id);

        if (dinoId) {
            console.log('Feeding Dino...');
            const feedRes = await fetch(`${BASE_URL}/dinosaurFeed`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    user_id: userId,
                    dinosaur_id: dinoId,
                    food_type_id: 1,
                    quantity: 1
                })
            });
            const feedData = await feedRes.json();
            console.log('Feed Status:', feedRes.status);
            console.log('Feed Data:', feedData);
        } else {
            console.log('No dino to feed.');
        }

    } catch (err) {
        console.error('Test script error:', err);
    }
}

runTest();
