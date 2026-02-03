const pool = require("../services/db");

// Seed data for DinosaurDex (12 dinosaurs based on the user's image)
const dinosaurDexData = `
INSERT INTO DinosaurDex (number, name, diet, rarity) VALUES
(1, 'Tyrannosaurus Rex', 'omnivore', 'Legendary'),
(2, 'Brachiosaurus', 'carnivore', 'Legendary'),
(3, 'Mosasaurus', 'carnivore', 'Epic'),
(4, 'Stegosaurus', 'carnivore', 'Rare'),
(5, 'Elasmosaurus', 'carnivore', 'Epic'),
(6, 'Pterodactyl', 'omnivore', 'Rare'),
(7, 'Triceratops', 'herbivore', 'Common'),
(8, 'Spinosaurus', 'omnivore', 'Common'),
(9, 'Diplodocus', 'herbivore', 'Common'),
(10, 'Velociraptor', 'omnivore', 'Common'),
(11, 'Acanthopholis', 'herbivore', 'Epic'),
(12, 'Parasaurolophus', 'herbivore', 'Rare');
`;

// Seed data for EggTypes (4 egg types based on user's image)
const eggTypeData = `
INSERT INTO EggType (name, rarity, price_points) VALUES
('Common Egg', 'Common', 100),
('Rare Egg', 'Rare', 150),
('Epic Egg', 'Epic', 250),
('Legendary Egg', 'Legendary', 400);
`;

// Seed data for FoodTypes (6 food types based on user's image)
const foodTypeData = `
INSERT INTO FoodType (name, diet, xp_gain, price_points) VALUES
('Raw Meat', 'carnivore', 35, 30),
('Fresh Fish', 'carnivore', 60, 45),
('Prime Steak', 'carnivore', 120, 80),
('Leafy Green', 'herbivore', 35, 30),
('Ancient Fern', 'herbivore', 60, 45),
('Fruit Mix', 'herbivore', 120, 80);
`;

// Seed data for User (Admin/System user)
const userData = `
INSERT INTO User (username, email, password, points) VALUES
('SystemAdmin', 'admin@dino.com', 'hashed_pass_placeholder', 1000);
`;

// Seed data for WellnessChallenges (sample challenges - linked to user 1)
const sampleChallenges = `
INSERT INTO WellnessChallenge (creator_id, description, points) VALUES
(1, 'Walk 10,000 steps today', 50),
(1, 'Drink 8 glasses of water', 30),
(1, 'Get 8 hours of sleep', 40),
(1, 'Do 30 minutes of exercise', 60),
(1, 'Eat 5 servings of fruits/vegetables', 35);
`;

// Execute seeds
async function runSeeds() {
    try {
        // Create user first to satisfy foreign key constraints
        console.log("Seeding User...");
        try {
            await executeQuery(userData);
            console.log("User seeded successfully!");
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') {
                console.log("User already exists, skipping...");
            } else {
                throw e;
            }
        }

        console.log("Seeding DinosaurDex...");
        await executeQuery(dinosaurDexData);
        console.log("DinosaurDex seeded successfully!");

        console.log("Seeding EggTypes...");
        await executeQuery(eggTypeData);
        console.log("EggTypes seeded successfully!");

        console.log("Seeding FoodTypes...");
        await executeQuery(foodTypeData);
        console.log("FoodTypes seeded successfully!");

        console.log("Seeding Challenges...");
        await executeQuery(sampleChallenges);
        console.log("Challenges seeded successfully!");

        console.log("\nAll seeds completed successfully!");

        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

function executeQuery(sql) {
    return new Promise((resolve, reject) => {
        pool.query(sql, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

runSeeds();
