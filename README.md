🦕 DinoKingdom - Wellness Challenge Web Application
____________________________________________________


DinoKingdom is a full-stack wellness gamification platform that combines wellness task tracking with a virtual dinosaur progression system. Users earn points by completing wellness challenges, which can be spent on eggs and food items. Eggs can be hatched into dinosaurs, and dinosaurs can be maintained through feeding and progression.


The project features a modern frontend interface integrated with a RESTful backend service using Node.js and MySQL, with secure JWT authentication and Bcrypt password hashing.


---


## 📹 Video Demo


**[Click here to watch the demo video](https://www.youtube.com/watch?v=rx1D9y1dJsM)**


Demo showcases:
- Features available before signup
- User registration and login flow
- Wellness challenge creation and completion
- Dinosaur hatching and feeding system
- Points and inventory management




---


## 🚀 Setup Instructions


### Prerequisites
- **Node.js** (v14.0 or higher)
- **MySQL** (v8.0 or higher)
- **npm** or **yarn** package manager
- Git (for cloning the repository)


### Installation


1. **Clone the repository**
   ```bash
   git clone [your-github-classroom-repo-url]
   cd bed-ca2-JanstonTay
   ```


2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Configure environment variables**  
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=bed_ca1


   JWT_SECRET_KEY=your_secret_key_here
   JWT_EXPIRES_IN=15m
   JWT_ALGORITHM=HS256
   ```
   
   > **Note**: See `.env.example` for a template configuration file.


4. **Initialize the database**
   ```bash
   npm run init
   ```
   This command creates all required tables in your MySQL database.


5. **Seed initial data** (Optional)
   ```bash
   npm run seed
   ```
   This populates the database with sample dinosaurs, egg types, food types, and challenges.


6. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will start on `http://localhost:3000` (or your configured port).


### Quick Start Commands


```bash
# Install dependencies
npm install


# Initialize database tables
npm run init


# Populate sample data
npm run seed


# Start development server
npm run dev
```


---


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




---


## 📁 Project Structure

```text
bed-ca2-JanstonTay/
├── public/                 # Frontend assets
│   ├── css/                # Stylesheets
│   ├── images/             # Static images and dinosaur sprites
│   ├── js/                 # Client-side JavaScript (XHR/Fetch logic)
│   └── *.html              # Application pages (Home, Shop, My Dinos)
├── src/                    # Backend source code
│   ├── configs/            # Configuration and database seeding
│   ├── controllers/        # Business logic and request handling
│   ├── middlewares/        # Security and utility middlewares (JWT, Auth)
│   ├── models/             # Database interactions and schemas
│   ├── routes/             # API route definitions
│   └── services/           # Core infrastructure (Database pooling)
├── index.js                # Main application entry point
├── .env                    # Environment configuration
├── package.json            # Project dependencies and npm scripts
└── README.md               # Project documentation
```






---


🗄️ Database Entities (Key Tables)
____________________________________


    Entity                                        Description
 ______________________________________________________________________________


    User                              Stores user records and point balance
    WellnessChallenge                       Challenges created by users
    UserCompletion                        Records of challenge completions
    EggType                                       Egg definitions
    FoodType                                    Food definitions
    UserEggInventory                   Egg quantities owned by users
    UserFoodInventory                    Food quantities owned by users
    UserPurchase                           Purchase transaction logs
    HatchEvent                             Records of egg hatching
    Dinosaur                                 Dinosaurs owned by users
    inosaurFeed                                  Feeding activity logs








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




---


## 🔮 Things to Add in the Future (Roadmap)


- **Dinosaur Evolution System**: Allow dinosaurs to evolve into more powerful forms as they gain XP.
- **Social Habitats**: Visit other users' habitats and interact with their dinosaurs.
- **Automated Challenge Tracking**: Integration with wellness APIs (like Google Fit or Apple Health) to automatically track challenges.
- **Habitat Customization**: Purchase and place decorations, plants, and terrain for your dinosaur habitats.
- **Daily Login Streaks**: Bonus points and rare items for maintaining a daily wellness streak.
- **Global Leaderboards**: Competitive boards for top collectors and wellness achievers.
- **Mobile Application**: Port the experience to a dedicated mobile app using React Native.
