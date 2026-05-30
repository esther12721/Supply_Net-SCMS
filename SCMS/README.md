# SupplyNet SCMS — Supply Chain Management System
**SupplyNet Ltd | Musanze District, Northern Province, Rwanda**

A full-stack web application for digitally managing suppliers, shipments, and deliveries.

---

## 📁 Project Structure

```
SCMS/
├── backend-project/         # Node.js + Express + MongoDB
│   ├── models/
│   │   ├── User.js
│   │   ├── Supplier.js
│   │   ├── Shipment.js
│   │   └── Delivery.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── suppliers.js
│   │   ├── shipments.js
│   │   ├── deliveries.js
│   │   └── reports.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend-project/        # React.js + Vite + Tailwind CSS
    ├── src/
    │   ├── components/
    │   │   └── Layout.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Suppliers.jsx
    │   │   ├── Shipments.jsx
    │   │   ├── Deliveries.jsx
    │   │   └── Reports.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally on port 27017, or use MongoDB Atlas)
- npm or yarn

---

### 1. Backend Setup

```bash
cd backend-project
npm install
```

Configure `.env` (already included):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/SCMS
JWT_SECRET=supplynet_scms_jwt_secret_2026
JWT_EXPIRE=7d
```

> For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

Start the backend:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The API runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend-project
npm install
npm run dev
```

The app runs at: `http://localhost:5173`

---

## 🖥️ Features

### Authentication
- User Registration & Login with JWT
- Protected routes (all pages require login)
- Logout

### Dark Mode
- Toggle between light/dark mode (saved in localStorage)
- Auto-detects system preference on first visit

### Supplier Management
- Add, View, Edit, Delete suppliers
- Fields: Supplier Code, Name, Telephone, Address, Email

### Shipment Management
- Add, View, Edit, Delete shipments
- Linked to a supplier
- Status tracking: Pending → In Transit → Delivered / Cancelled

### Delivery Management
- Add, View, Edit, Delete deliveries
- Linked to a shipment
- Status tracking: Pending → Partial → Complete / Failed

### Reports
- **Daily**, **Weekly**, **Monthly**, and **All Time** periods
- Report types: Summary, Suppliers, Shipments, Deliveries
- Charts (Pie + Bar) for status breakdowns
- Printable via browser print

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/suppliers | Get all suppliers |
| POST | /api/suppliers | Create supplier |
| PUT | /api/suppliers/:id | Update supplier |
| DELETE | /api/suppliers/:id | Delete supplier |

### Shipments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/shipments | Get all shipments |
| POST | /api/shipments | Create shipment |
| PUT | /api/shipments/:id | Update shipment |
| DELETE | /api/shipments/:id | Delete shipment |

### Deliveries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/deliveries | Get all deliveries |
| POST | /api/deliveries | Create delivery |
| PUT | /api/deliveries/:id | Update delivery |
| DELETE | /api/deliveries/:id | Delete delivery |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/reports/summary?type= | Summary report |
| GET | /api/reports/suppliers?type= | Suppliers report |
| GET | /api/reports/shipments?type= | Shipments report |
| GET | /api/reports/deliveries?type= | Deliveries report |

`type` = `daily` | `weekly` | `monthly` | `all`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |

---

## 📌 ERD Summary

```
Supplier (1) ──────< Shipment (1) ──────< Delivery
supplierCode PK      shipmentNumber PK    deliveryCode PK
supplierName         shipmentDate         deliveryDate
telephone            shipmentStatus       quantityDelivered
address              destination          deliveryStatus
email                supplier FK          shipment FK
```

**Relationships:**
- One Supplier → Many Shipments (1:N)
- One Shipment → Many Deliveries (1:N)

---

© 2026 SupplyNet Ltd — National Practical Exam Project
