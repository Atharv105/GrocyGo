# GrocyGo 🛒
[![Node.js Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)](https://nodejs.org/)
[![Vite React Frontend](https://img.shields.io/badge/Frontend-Vite%20%7C%20React%20%7C%20Tailwind-blue)](https://vite.dev/)
[![Sequelize ORM](https://img.shields.io/badge/Database-Sequelize%20%7C%20MySQL-orange)](https://sequelize.org/)

GrocyGo is a modern, full-stack, and highly secure online grocery shopping and pick-up slot reservation management system. Customers can browse products, manage their shopping carts, and select a convenient pickup slot during checkout. Admins can manage inventory, generate time slots, track orders, and monitor metrics through an analytics dashboard.

---

## 🌟 Key Features

### 👤 Customer App
- **Secure OTP Authentication**: Indian mobile number formats (`^[6-9]\d{9}$`) with strict SMS-resend cooldown parameters.
- **Interactive Shopping Catalog**: Browse through food categories, search and filter products, and add items to a persistent cart.
- **Pickup Slot Scheduling**: Reserve dates and specific hourly windows during checkout to avoid checkout queues.
- **My Orders**: Track personal order history, order statuses (PENDING, CONFIRMED, DELIVERED, CANCELLED), and payment receipts.

### 👑 Admin Dashboard Portal
- **Dashboard Analytics**: Visualize high-level shop performance (total orders, customer counts, and product analytics).
- **Categories & Products Manager**: Add, edit, or toggle items/categories with automated Cloudinary asset integrations.
- **Pickup Slots Planner**: Manage individual slots or use a scheduling tool to bulk-generate time slots for specific date ranges.
- **Order Fulfilment**: Update order and payment states (e.g. mark as PENDING, CONFIRMED, or DELIVERED).

### 🛡️ Production & Security Operations
- **API Request Validation**: Strict validations via `express-validator` on all POST/PUT/PATCH request payloads.
- **DDoS and Brute-Force Rate Limiting**: Global rate-limits for general API traffic alongside strict limits on OTP requests.
- **Structured Winston & Morgan Logs**: Colorized dev console logs and persistent production log files (`error.log`, `combined.log`).
- **Flexible DB Connection**: Automatic compatibility with standard cloud hosting database connection strings (`DATABASE_URL`).

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Lucide Icons |
| **Backend** | Node.js, Express.js, Sequelize ORM (MySQL / MariaDB dialect) |
| **Security & Utilities** | Helmet, CORS, Cookie-Parser, express-rate-limit, express-validator |
| **Logging & Monitoring** | Winston (Structured JSON logger), Morgan (HTTP Traffic logger) |
| **Assets Management** | Cloudinary Media Library (Cloud CDN integration) |

---

## 📂 Project Structure

```
GrocyGo/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI Components (Product/Category cards, Modals)
│   │   ├── pages/          # Pages (Shop, Cart, Login, Admin Dashboard)
│   │   ├── services/       # Axios API client modules
│   │   └── data/           # Mock placeholder data
│   └── package.json
│
└── server/                 # Express Backend API
    ├── config/             # DB connection and Migration configs
    ├── controllers/        # Express route controller handlers
    ├── middleware/         # Auth, Admin, Validation & Rate Limiter middlewares
    ├── migrations/         # Sequelize database migrations
    ├── models/             # Sequelize database model definitions
    ├── routes/             # Express API endpoints routing definitions
    ├── seeders/            # Database seed data files (Admin, Categories)
    ├── services/           # Business logic & SMS controllers
    ├── utils/              # Winston loggers, token generators, OTP helpers
    ├── logs/               # Local write logs (combined.log, error.log)
    └── package.json
```

---

## ⚙️ Environment Variables

Before running, create your configurations inside `.env` files in both directories:

### Backend Configuration (`server/.env`)
Create a `.env` in the `server` directory using `server/example.env` as a reference:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=grocery_store
DB_USER=root
DB_PASSWORD=your_mysql_password
DATABASE_URL=mysql://user:pass@host:port/dbname     # (Optional: overrides individual DB params)

JWT_SECRET=YourAccessTokenSecretKey
JWT_REFRESH_SECRET=YourRefreshTokenSecretKey

CLOUDINARY_CLOUD_NAME=YourCloudinaryCloudName
CLOUDINARY_API_KEY=YourCloudinaryApiKey
CLOUDINARY_API_SECRET=YourCloudinaryApiSecret

CLIENT_URL=http://localhost:5173

# OTP Configuration
OTP_EXPIRY_MINS=5
OTP_RESEND_COOLDOWN_SECS=60
```

### Frontend Configuration (`client/.env`)
Create a `.env` in the `client` directory using `client/.env.example` as a reference:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Installation & Local Development

### 1. Database Setup
Ensure you have MySQL/MariaDB server running locally, and create a new schema:
```sql
CREATE DATABASE grocery_store;
```

### 2. Backend Installation & Migrations
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Run database migrations to construct tables
npx sequelize-cli db:migrate

# Seed default admin account and initial categories
npx sequelize-cli db:seed:all

# Start local server (Runs on port 5000 by default)
npm start
```

### 3. Frontend Installation & Build
```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Run client locally (Runs on port 5173 by default)
npm run dev
```

---

## 🔗 Core API Endpoints

### 🔑 Authentication (`/api/auth`)
* `POST /api/auth/send-otp`: Sends validation OTP to mobile.
* `POST /api/auth/verify-otp`: Validates OTP and sets HTTPOnly cookie credentials.
* `POST /api/auth/refresh`: Renews expired access tokens.
* `POST /api/auth/logout`: Clears session token and revokes JWT credentials.

### 🛍️ Categories & Products (`/api/categories`, `/api/products`)
* `GET /api/categories`: Fetches all active product categories.
* `POST /api/categories` [Admin]: Creates a new category.
* `GET /api/products`: Lists products with pagination support.
* `POST /api/products` [Admin]: Creates new product items.

### 📅 Pickup Slots (`/api/slots`)
* `GET /api/slots/available`: Retrieves future slots with remaining checkout capacities.
* `POST /api/slots/generate` [Admin]: Bulks generate time slots for a specified date range.

### 🛒 Cart & Orders (`/api/cart`, `/api/orders`)
* `POST /api/cart`: Adds product item to the user's shopping cart.
* `POST /api/orders/checkout`: Validates order details, checks slot capacity, and locks slot choice.
