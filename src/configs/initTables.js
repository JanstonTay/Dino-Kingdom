const pool = require("../services/db");

const SQLSTATEMENT = `
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS UserCompletion;
DROP TABLE IF EXISTS WellnessChallenge;
DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS DinosaurFeed;
DROP TABLE IF EXISTS UserFoodInventory;
DROP TABLE IF EXISTS FoodType;
DROP TABLE IF EXISTS Dinosaur;
DROP TABLE IF EXISTS DinosaurDex;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  points INT DEFAULT 0
);

CREATE TABLE WellnessChallenge (
  challenge_id INT AUTO_INCREMENT PRIMARY KEY,
  creator_id INT NOT NULL,
  description TEXT NOT NULL,
  points INT NOT NULL
);

CREATE TABLE UserCompletion (
  completion_id INT AUTO_INCREMENT PRIMARY KEY,
  challenge_id INT NOT NULL,
  user_id INT NOT NULL,
  details TEXT
);

CREATE TABLE DinosaurDex (
  number INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  diet VARCHAR(255),
  rarity VARCHAR(255)
);

CREATE TABLE Dinosaur (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  dex_num INT NOT NULL,
  level INT DEFAULT 1,
  xp INT DEFAULT 0,
  height FLOAT NOT NULL,
  weight FLOAT NOT NULL
);

CREATE TABLE FoodType (
  food_type_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  diet VARCHAR(255) NOT NULL,
  xp_gain INT NOT NULL,
  price_points INT NOT NULL
);

CREATE TABLE UserFoodInventory (
  user_id INT NOT NULL,
  food_type_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (user_id, food_type_id),
  CONSTRAINT fk_userfood_user
    FOREIGN KEY (user_id)
    REFERENCES User(user_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_userfood_food
    FOREIGN KEY (food_type_id)
    REFERENCES FoodType(food_type_id)
    ON DELETE CASCADE
);

CREATE TABLE DinosaurFeed (
  feed_id INT AUTO_INCREMENT PRIMARY KEY,
  dinosaur_id INT NOT NULL,
  food_type_id INT NOT NULL,
  quantity INT NOT NULL,
  used_on DATETIME NOT NULL
);
`;

pool.query(SQLSTATEMENT, (error, results) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});
