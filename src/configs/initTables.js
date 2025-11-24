const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS Pokedex;

DROP TABLE IF EXISTS Pokemon;

DROP TABLE IF EXISTS Player;

CREATE TABLE Pokemon (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  dex_num INT NOT NULL,
  hp INT,
  atk INT,
  def INT
);

CREATE TABLE Pokedex (
  number INT PRIMARY KEY,
  name TEXT NOT NULL,
  type1 TEXT NOT NULL,
  type2 TEXT NOT NULL
);

CREATE TABLE Player (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name TEXT NOT NULL,
  level INT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Pokedex (number, name, type1, type2) VALUES
(1, 'Bulbasaur', 'Grass', 'Poison'),
(2, 'Ivysaur', 'Grass', 'Poison'),
(3, 'Venusaur', 'Grass', 'Poison'),
(4, 'Charmander', 'Fire', ''),
(5, 'Charmeleon', 'Fire', ''),
(6, 'Charizard', 'Fire', 'Flying'),
(7, 'Squirtle', 'Water', ''),
(8, 'Wartortle', 'Water', ''),
(9, 'Blastoise', 'Water', '');

INSERT INTO Player (name, level) VALUES
('Ash', 1),
('Misty', 21),
('Brock', 30);

INSERT INTO Pokemon (owner_id, dex_num, hp, atk, def) VALUES
(1, 4, 100, 5, 6),
(2, 1, 100, 5, 6),
(2, 5, 160, 27, 26),
(2, 9, 200, 52, 55);

DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS PlayerUserRel;

CREATE TABLE PlayerUserRel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  player_id INT NOT NULL
);

CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO User (username, email, password) VALUES
('admin', 'a@a.com', '1234'),
('jack99', 'j@j.com', '1234');

INSERT INTO PlayerUserRel (user_id, player_id) VALUES
(1, 1),
(1, 2),
(2, 3);
`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully", results);
  }
  process.exit();
});
