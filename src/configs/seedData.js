const pool = require("../services/db");
const fs = require("fs");
const path = require("path");

// Parse a single CSV line, handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Parse consolidated CSV file with table sections
function parseConsolidatedCSV(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split(/\r?\n/);

    const tables = {};
    let currentTable = null;
    let headers = null;

    for (const line of lines) {
        const trimmed = line.trim();

        // Skip empty lines
        if (!trimmed) continue;

        // Check for table marker
        if (trimmed.startsWith("# TABLE:")) {
            currentTable = trimmed.replace("# TABLE:", "").trim();
            tables[currentTable] = [];
            headers = null;
            continue;
        }

        // Skip comment lines
        if (trimmed.startsWith("#")) continue;

        // Parse data lines
        if (currentTable) {
            if (!headers) {
                // First line after table marker is headers
                headers = parseCSVLine(trimmed);
            } else {
                // Data rows
                const values = parseCSVLine(trimmed);
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || "";
                });
                tables[currentTable].push(row);
            }
        }
    }

    return tables;
}

// Helper to escape and quote SQL values
function sqlValue(value) {
    // Check if it's a number
    if (value && /^\d+(\.\d+)?$/.test(value.trim())) {
        return value.trim();
    }
    // String - escape single quotes and wrap in quotes
    return `'${String(value).replace(/'/g, "''")}'`;
}

// Generate INSERT SQL from CSV data
function generateInsertSQL(tableName, data) {
    if (data.length === 0) return "";

    const columns = Object.keys(data[0]);
    const valueRows = [];

    for (const row of data) {
        const values = columns.map(col => sqlValue(row[col]));
        valueRows.push(`(${values.join(", ")})`);
    }

    return `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES ${valueRows.join(", ")};`;
}

// Load consolidated CSV file
const seedDataPath = path.join(__dirname, "seedData.csv");
const allTables = parseConsolidatedCSV(seedDataPath);

// Generate SQL for each table
const userData = generateInsertSQL("User", allTables.User || []);
const dinosaurDexData = generateInsertSQL("DinosaurDex", allTables.DinosaurDex || []);
const eggTypeData = generateInsertSQL("EggType", allTables.EggType || []);
const foodTypeData = generateInsertSQL("FoodType", allTables.FoodType || []);
const sampleChallenges = generateInsertSQL("WellnessChallenge", allTables.WellnessChallenge || []);

// Execute seeds using callbacks (no async/await)
function runSeeds() {
    if (!userData) {
        console.log("No User data to seed, skipping...");
        seedDinosaurDex();
        return;
    }
    console.log("Seeding User...");

    pool.query(userData, (error, results) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log("User already exists, skipping...");
                seedDinosaurDex();
            } else {
                console.error("User seeding error:", error);
                process.exit(1);
            }
        } else {
            console.log("User seeded successfully!");
            seedDinosaurDex();
        }
    });
}

function seedDinosaurDex() {
    if (!dinosaurDexData) {
        console.log("No DinosaurDex data to seed, skipping...");
        seedEggTypes();
        return;
    }
    console.log("\nSeeding DinosaurDex...");

    pool.query(dinosaurDexData, (error, results) => {
        if (error) {
            console.error("DinosaurDex seeding error:", error);
            process.exit(1);
        } else {
            console.log("DinosaurDex seeded successfully!");
            seedEggTypes();
        }
    });
}

function seedEggTypes() {
    if (!eggTypeData) {
        console.log("No EggType data to seed, skipping...");
        seedFoodTypes();
        return;
    }
    console.log("\nSeeding EggTypes...");

    pool.query(eggTypeData, (error, results) => {
        if (error) {
            console.error("EggTypes seeding error:", error);
            process.exit(1);
        } else {
            console.log("EggTypes seeded successfully!");
            seedFoodTypes();
        }
    });
}

function seedFoodTypes() {
    if (!foodTypeData) {
        console.log("No FoodType data to seed, skipping...");
        seedChallenges();
        return;
    }
    console.log("\nSeeding FoodTypes...");

    pool.query(foodTypeData, (error, results) => {
        if (error) {
            console.error("FoodTypes seeding error:", error);
            process.exit(1);
        } else {
            console.log("FoodTypes seeded successfully!");
            seedChallenges();
        }
    });
}

function seedChallenges() {
    if (!sampleChallenges) {
        console.log("\nNo Challenges data to seed, skipping...");
        console.log("\nAll seeds completed successfully!");
        process.exit(0);
        return;
    }
    console.log("\nSeeding Challenges...");

    pool.query(sampleChallenges, (error, results) => {
        if (error) {
            console.error("Challenges seeding error:", error);
            process.exit(1);
        } else {
            console.log("Challenges seeded successfully!");
            console.log("\nAll seeds completed successfully!");
            process.exit(0);
        }
    });
}

runSeeds();
