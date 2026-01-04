🦕 DinoWell Backend System
____________________________

DinoWell is a backend application that combines wellness task tracking with a virtual dinosaur progression system. Users earn points by completing wellness challenges. These points can be spent on eggs and food items. Eggs can be hatched into dinosaurs, and dinosaurs can be maintained through feeding and progression actions.

The project is implemented as a RESTful backend service using Node.js and MySQL.




🎯 Project Purpose and Scope
_______________________________

This project was created as part of a backend development coursework assignment. The system is designed to demonstrate:

implementation of RESTful API endpoints

handling of multi-step backend processes such as purchasing and inventory updates

integration of Node.js with a relational MySQL database

data validation, ownership rules, and consistent error handling

The focus of the project is on server-side behaviour, data consistency, and backend logic rather than front-end visuals.




🧩 System Modules
____________________

The application is organised into three main functional areas:

1)  User and Challenge Module
    Manages users, wellness challenges, and completion records.

2)  Shop and Inventory Module
    Allows users to spend points on eggs and food. Purchases are logged and inventories are updated.

3)  Dinosaur Lifecycle Module
    Manages egg hatching, dinosaur creation, and feeding records.

Each module is implemented using separate controllers, models, and route files to maintain modularity.




🛠 Technology Stack
_____________________

-->  Node.js
-->  Express.js
-->  MySQL
-->  mysql2
-->  dotenv
-->  Nodemon
-->  Postman (for API testing)




🗄️ Database Entities (Key Tables)
____________________________________

    Entity	                                      Description
 ______________________________________________________________________________

    User	                             Stores user records and point balance
    WellnessChallenge	                    Challenges created by users
    UserCompletion                  	   Records of challenge completions
    EggType	                                      Egg definitions
    FoodType	                                 Food definitions
    UserEggInventory	                  Egg quantities owned by users
    UserFoodInventory	                 Food quantities owned by users
    UserPurchase	                         Purchase transaction logs
    HatchEvent	                            Records of egg hatching
    Dinosaur	                              Dinosaurs owned by users
    inosaurFeed	                               Feeding activity logs




📡 API Overview

___________________

👤 Users (/users)

-->  GET / — Get all users
-->  GET /:user_id — Get user by ID
-->  POST / — Create a user
-->  PUT /:user_id — Update user details or points


🏃 Wellness Challenges (/challenges)

-->  GET / — Get all challenges
-->  POST / — Create a challenge
-->  PUT /:challenge_id — Update a challenge (ownership validated)
-->  DELETE /:challenge_id — Delete a challenge (ownership validated)


🛒 Purchases and Inventory (/userPurchases)

-->  GET / — Get all purchase records
-->  GET /user/:user_id — Get purchases for a specific user
-->  POST / — Perform a purchase
-->  validates user points
-->  deducts cost
-->  updates inventory
-->  logs the transaction


🐣 Hatching (/hatchEvents)

-->  POST / — Hatch an egg and create a dinosaur
-->  GET /user/:user_id — View hatch events for a user


🦕 Dinosaurs (/dinosaurs)

-->  GET /user/:user_id — Get dinosaurs owned by a user
-->  GET /:dinosaur_id — Get dinosaur details


🍎 Feeding (/dinosaurFeed)

-->  POST / — Feed a dinosaur
-->  GET /dinosaur/:dinosaur_id — View feeding history



🧪 System Behaviour Highlights

-->  Purchases require sufficient user points
-->  Inventory quantities are created or incremented safely
-->  Hatch and feed actions are logged for traceability
-->  Ownership rules prevent modification of resources belonging to other users
-->  Errors are handled using appropriate HTTP status codes



👨‍💻 Author
_____________

Janston Tay
Backend Development — CA1 Project