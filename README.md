🍔 Food Delivery Microservices

A microservice-based food delivery system built with modern web technologies.
This project demonstrates scalable architecture using independent services for authentication, orders, cart, foods, and real-time updates.

🏗 Architecture Overview

This project follows a Microservices Architecture pattern:

Client (React Frontend)
        ↓
API Gateway (optional)
        ↓
---------------------------------
Auth Service
Food Service
Cart Service
Order Service
---------------------------------
        ↓
Database (PostgreSQL + Prisma)
        ↓
Socket.io (Real-time updates)

Each service runs independently and communicates via HTTP and WebSockets.

🚀 Features
👤 Authentication Service

JWT-based authentication

Role-based access (CUSTOMER / ADMIN)

User profile fetching

Change password functionality

🍕 Food Service

List foods

Admin CRUD for foods

Public food browsing

🛒 Cart Service

Add to cart

Remove items

View cart

Cart count badge

📦 Order Service

Place orders

Admin order management

Update order status

Real-time order updates (Socket.io)

🧑‍💼 Admin Dashboard

View all orders

Search by customer

Filter by status

Pagination

Revenue analytics

Real-time updates

🛠 Tech Stack
Frontend

React

TypeScript

Tailwind CSS

Zustand (state management)

React Router

Socket.io-client

Backend (Microservices)

Node.js

Express

Prisma ORM

PostgreSQL

JWT Authentication

Socket.io

🔐 Roles
CUSTOMER

Browse foods

Add to cart

Place orders

View order history

ADMIN

Manage foods

View all orders

Update order statuses

Access analytics dashboard

📂 Project Structure (Simplified)
food-delivery-microservices/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── store/
│   └── services/
│
├── auth-service/
├── food-service/
├── cart-service/
├── order-service/
│
└── README.md
⚙️ Environment Variables

Each service requires its own .env file.

Example (Auth Service)
PORT=4001
DATABASE_URL=postgresql://user:password@localhost:5432/auth_db
JWT_SECRET=your_secret_key
Example (Order Service)
PORT=4003
DATABASE_URL=postgresql://user:password@localhost:5432/order_db
JWT_SECRET=your_secret_key
▶️ Running the Project
1️⃣ Install dependencies (per service)
npm install
2️⃣ Run each service
npm run dev
3️⃣ Run frontend
cd frontend
npm install
npm run dev
🔄 Real-Time Updates

The Order Service uses Socket.io to broadcast:

orderUpdated events to admins

Live dashboard updates

📊 Admin Dashboard Features

📈 Revenue analytics

🔍 Search orders

🎛 Status filtering

📄 Pagination

🔄 Real-time updates

🔒 Security

JWT authentication

Role-based authorization

Token verification in protected routes

Secure password hashing (bcrypt)

🧠 Learning Goals

This project demonstrates:

Microservices architecture

Service isolation

JWT authentication across services

Real-time communication

Role-based UI rendering

Clean frontend state management

📌 Future Improvements

API Gateway implementation

Docker containerization

Kubernetes deployment

Server-side pagination

Payment integration (Stripe)

Notification service

Logging & monitoring (Prometheus/Grafana)