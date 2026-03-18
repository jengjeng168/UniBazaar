# 🎓 Campus Marketplace

A full-stack student buy-and-sell platform for university communities. Students can list items for sale, browse products by category, review sellers, and more.

---

## 📁 Project Structure

```
campus-marketplace/
├── client/                         # Vue 3 + Vite frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css            # Global styles
│   │   ├── components/
│   │   │   ├── NavBar.vue
│   │   │   ├── ProductCard.vue
│   │   │   └── ReviewCard.vue
│   │   ├── pages/
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   ├── ProductListPage.vue
│   │   │   ├── ProductDetailPage.vue
│   │   │   ├── AddEditProductPage.vue
│   │   │   └── AdminDashboardPage.vue
│   │   ├── router/
│   │   │   └── index.js            # Vue Router + auth guards
│   │   ├── services/
│   │   │   └── api.js              # Axios service layer
│   │   ├── store/
│   │   │   └── index.js            # Pinia auth store
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/                         # Node.js + Express backend
│   ├── config/
│   │   ├── db.js                   # MySQL connection pool
│   │   ├── jwt.js                  # Token helpers
│   │   └── schema.sql              # Database schema
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js       # JWT verify + role guard
│   │   └── uploadMiddleware.js     # Multer config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                    # Uploaded product images
│   ├── .env.example
│   ├── app.js                      # Express entry point
│   └── package.json
│
├── .gitignore
├── package.json                    # Root — runs both concurrently
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MySQL 8.0+
- npm

### 1. Clone & install all dependencies

```bash
git clone https://github.com/your-username/campus-marketplace.git
cd campus-marketplace
npm run install:all
```

### 2. Configure the database

```bash
# Create the database and tables
mysql -u root -p < server/config/schema.sql
```

### 3. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Edit server/.env with your MySQL credentials and JWT secret

# Client (optional — defaults work with the Vite proxy)
cp client/.env.example client/.env
```

### 4. Run both client and server

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vue) | http://localhost:5173 |
| Backend API    | http://localhost:5000  |

---

## 🌐 API Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register a new user |
| POST | `/api/auth/login` | — | Login, receive JWT |
| GET  | `/api/auth/me` | ✅ | Get current user |

### Products
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET    | `/api/products` | — | List products (search, category, pagination) |
| GET    | `/api/products/categories` | — | List all categories |
| GET    | `/api/products/:id` | — | Get single product |
| GET    | `/api/products/seller/:id` | — | Products by seller |
| POST   | `/api/products` | ✅ | Create product (multipart/form-data) |
| PUT    | `/api/products/:id` | ✅ | Update own product |
| DELETE | `/api/products/:id` | ✅ | Delete own product |

### Reviews
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET    | `/api/reviews/seller/:sellerId` | — | Get seller reviews + avg rating |
| POST   | `/api/reviews/seller/:sellerId` | ✅ | Submit a review |

### Admin (role: admin required)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET    | `/api/admin/stats` | 🛡️ | System statistics |
| GET    | `/api/admin/users` | 🛡️ | All users |
| PATCH  | `/api/admin/users/:id/ban` | 🛡️ | Ban a user |
| PATCH  | `/api/admin/users/:id/unban` | 🛡️ | Unban a user |
| GET    | `/api/admin/products` | 🛡️ | All products |
| DELETE | `/api/admin/products/:id` | 🛡️ | Remove any product |

---

## 🗄️ Database Schema

```sql
users       (id, username, email, password, role, is_banned, avatar, created_at)
categories  (id, name)
products    (id, seller_id, category_id, title, description, price, status, image, created_at)
reviews     (id, seller_id, reviewer_id, rating, comment, created_at)
-- VIEW: seller_ratings (seller_id, avg_rating, review_count)
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| JWT authentication (register / login) | ✅ |
| Role-based access (user / admin) | ✅ |
| Product CRUD with image upload | ✅ |
| Ownership enforcement (edit/delete own only) | ✅ |
| Product status (available / sold) | ✅ |
| Seller reviews & auto average rating | ✅ |
| Keyword search + category filter | ✅ |
| Pagination | ✅ |
| Admin: ban/unban users | ✅ |
| Admin: delete any product | ✅ |
| Admin: system statistics dashboard | ✅ |

---

## 🛠 Tech Stack

**Backend:** Node.js · Express.js · MySQL 8 · JWT · bcrypt · Multer  
**Frontend:** Vue 3 · Vite · Vue Router 4 · Pinia · Axios

---

## 📝 Creating an Admin Account

After registering normally, update the role directly in MySQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

---

## 📄 License

MIT
