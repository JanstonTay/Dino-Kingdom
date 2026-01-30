const pool = require("../services/db");
const bcrypt = require("bcrypt");

const saltRounds = 10;

bcrypt.hash("1234", saltRounds, (error, hash) => {
  if (error) {
    console.error("Error hashing password:", error);
    process.exit(1);
  }

  console.log("Hashed password:", hash);

  const SQLSTATEMENT = `
DROP TABLE IF EXISTS DinosaurFeed;
DROP TABLE IF EXISTS HatchEvent;
DROP TABLE IF EXISTS UserFoodInventory;
DROP TABLE IF EXISTS UserEggInventory;
DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS UserPurchase;
DROP TABLE IF EXISTS Dinosaur;
DROP TABLE IF EXISTS DinosaurDex;
DROP TABLE IF EXISTS FoodType;
DROP TABLE IF EXISTS EggType;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  points INT DEFAULT 0
);

CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT,
  FOREIGN KEY (challenge_id) REFERENCES WellnessChallenge(challenge_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

CREATE TABLE DinosaurDex (
  number INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  diet ENUM('herbivore','carnivore','omnivore') NOT NULL,
  rarity VARCHAR(255) NOT NULL
);

CREATE TABLE Dinosaur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  dex_num INT NOT NULL,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL,
  FOREIGN KEY (owner_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (dex_num) REFERENCES DinosaurDex(number) ON DELETE CASCADE
);

CREATE TABLE FoodType (
  food_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  diet ENUM('herbivore','carnivore') NOT NULL,
  xp_gain INT NOT NULL,
  price_points INT NOT NULL
);

CREATE TABLE UserFoodInventory (
  user_id INT NOT NULL,
  food_type_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (user_id, food_type_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (food_type_id) REFERENCES FoodType(food_type_id) ON DELETE CASCADE
);

CREATE TABLE DinosaurFeed (
  feed_id INT AUTO_INCREMENT PRIMARY KEY,
  dinosaur_id INT NOT NULL,
  food_type_id INT NOT NULL,
  quantity INT NOT NULL,
  used_on DATETIME NOT NULL,
  FOREIGN KEY (dinosaur_id) REFERENCES Dinosaur(id) ON DELETE CASCADE,
  FOREIGN KEY (food_type_id) REFERENCES FoodType(food_type_id) ON DELETE CASCADE
);

CREATE TABLE EggType (
  egg_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  rarity VARCHAR(255) NOT NULL,
  price_points INT NOT NULL
);

CREATE TABLE UserEggInventory (
  user_id INT NOT NULL,
  egg_type_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (user_id, egg_type_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (egg_type_id) REFERENCES EggType(egg_type_id) ON DELETE CASCADE
);

CREATE TABLE HatchEvent (
  hatch_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  egg_type_id INT NOT NULL,
  dinosaur_id INT NOT NULL,
  hatched_on DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (egg_type_id) REFERENCES EggType(egg_type_id) ON DELETE CASCADE,
  FOREIGN KEY (dinosaur_id) REFERENCES Dinosaur(id) ON DELETE CASCADE
);

CREATE TABLE UserPurchase (
  purchase_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_type ENUM('egg','food') NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  purchased_on DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);
`;

  pool.query(SQLSTATEMENT, (err) => {
    if (err) {
      console.error("Error creating tables:", err);
      process.exit(1);
    }

    console.log("All tables created successfully.");
    process.exit(0);
  });
});
