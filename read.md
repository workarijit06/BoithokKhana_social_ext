# 📁 Boithok Khana Architecture & Admin Authentication

```
                 YOUR WEBSITE
                       │
            ┌──────────┴──────────┐
            ↓                     ↓
       Customer page          Admin page
        index.html             /admin
            │                     │
            ↓                     ↓
       Public API            🔐 LOGIN
  (POST /api/customers)           │
                                  ↓
                            Authenticated?
                             /         \
                           NO           YES
                           ↓             ↓
                         DENY      Admin dashboard
                                         │
                                         ↓
                                  Protected API
                              (GET /api/customers)
                              (GET /api/stats)
                              (DELETE /api/customers)
                              (GET /api/export)
                                         │
                                         ↓
                                    Database
                              (data/customers.json)
```

---

## 📁 Project Structure

```
📁 boithok-khana (d:/boithak khana website/boithok khana 2/)
│
├── 📁 public
│   ├── index.html        (Customer Data Entry form)
│   └── admin.html        (🔐 Login View & Admin Dashboard)
│
├── 📁 api
│   ├── auth.js           (Handles POST /api/login and authentication checks)
│   ├── customers.js      (Public POST for customer registration & Protected GET)
│   ├── stats.js          (Protected GET analytics)
│   ├── delete-customer.js(Protected DELETE customer by ID)
│   └── export.js         (Protected GET CSV export)
│
├── server.js             (Node.js Server with API & auth routing)
├── package.json
└── .gitignore 
```

---

## 🔐 Credentials & Default Admin Access

- **Username**: `admin`
- **Password**: `boithok123`

*(You can also set custom credentials via environment variables `ADMIN_USER` and `ADMIN_PASS`)*

---

## 🚀 How to Run

1. Run server from `D:\boithak khana website\boithok khana 2`:
   ```bash
   node server.js
   ```

2. URLs:
   - **Customer Data Entry**: `http://localhost:3000/index.html` (Public)
   - **Admin Panel & Login**: `http://localhost:3000/admin` (Password Protected)
