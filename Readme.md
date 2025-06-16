# 🧠 Bitespeed Identity Reconciliation - Backend Task

This project implements the [Bitespeed Identity Reconciliation challenge](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-1fb21bb2a930802eb896d4409460375c) using:

* ⚡ **Node.js** with **Fastify** web framework
* 🐘 **PostgreSQL** for data storage
* 🔁 **Contact identity resolution** based on email/phone linking rules

---

## 🚀 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost:5432/bitespeed
PORT=3000
```

You can also modify `db/index.js` to use this connection string.

### 4. Create Database & Table

Connect to your Postgres DB and run the file: src/sql/schema.sql

---

## 🥪 Run the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

---

## 🔍 API Reference

### `POST /identify`

Finds or creates linked contacts based on `email` and `phoneNumber`.

#### Request Body:

```json
{
  "email": "example@email.com",
  "phoneNumber": "1234567890"
}
```

#### Response:

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@email.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```

---

## ⚙️ Project Structure

```
.
├── db/
│   └── index.js          # Postgres pool setup
├── routes/
│   └── identify.js       # POST /identify route
├── services/
│   └── contact.service.js # Core logic for identity reconciliation
├── index.js              # Fastify app entry point
├── package.json
└── README.md
```

---

## ✅ Identity Resolution Rules

* If **no existing contact** matches, create a new **primary** contact.
* If **one or more contacts** match:

  * Identify the **oldest primary**.
  * Insert any **new data** as a **secondary** contact.
  * Return a unified view of the identity group.

---

## 🥪 Test Cases

You can test all 5 cases mentioned in the Notion doc using **Postman** or **cURL**.
---

## 📄 License

This is a take-home challenge solution. All rights to original problem © Bitespeed.
