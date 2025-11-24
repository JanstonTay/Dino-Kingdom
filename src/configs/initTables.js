const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS WellnessChallenge;

DROP TABLE IF EXISTS UserCompletion;

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
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully", results);
  }
  process.exit();
});
