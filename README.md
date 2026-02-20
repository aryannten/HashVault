# 🛡️ HashVault — Tamper-Proof Submission Integrity System

HashVault is a secure digital submission platform that ensures the authenticity and integrity of uploaded files using cryptographic hashing, blockchain-style anchoring, and trusted timestamps. Once a file is submitted, any modification becomes immediately detectable.

Designed for hackathons, academic evaluations, and competitive events, HashVault prevents post-deadline changes and disputes over originality by providing verifiable proof of submission.

---

## 🚀 Features

- 🔐 **SHA-256 Cryptographic Hashing** — unique digital fingerprint for every file
- ⛓️ **Blockchain-Style Anchoring** — submissions chained together for integrity
- 🔑 **JWT Authentication** — secure signup/login with bcrypt password hashing
- 📤 **Secure File Submission** — files stored as BLOBs directly in MySQL
- 🔍 **Tamper Detection & Verification** — re-hash and compare to detect changes
- 🗄️ **MySQL Persistent Storage** — submissions, anchors, and users
- 🧾 **Unique Submission IDs** — `HV-` prefixed identifiers for every submission
- 🛡️ **Centralized Error Handling** — clean JSON responses for all error types

---

## 🧠 How It Works

### 📤 Submission

1. User uploads a file
2. Backend streams file and computes SHA-256 hash (digital fingerprint)
3. File stored as BLOB in MySQL database
4. Blockchain anchor hash generated (links to previous submission's anchor)
5. Hash + timestamp + anchor saved in database
6. Submission ID returned as proof

### 🔍 Verification

1. User uploads file for verification along with submission ID
2. Backend recomputes SHA-256 hash from uploaded file
3. System compares with stored hash in database
4. Result returned:
   - ✅ **Authentic** — file is unmodified since submission
   - ❌ **Tampered** — file has been modified

### ⛓️ Blockchain Anchoring

Each submission is chained to the previous one using a hash that includes:

- Block index, submission ID, file hash, timestamp, and previous anchor hash

This creates an immutable chain — tampering with any earlier submission breaks the entire chain.

---

## 🏗️ System Architecture

```
React Frontend (Vite) → Flask API → MySQL Database
                              ↓
                    File BLOB Storage (in DB)
                              ↓
                    Blockchain Anchor Chain
```

---

## 📁 Project Structure

```
hashvault/
│
├── backend/
│   ├── app.py                     # Flask server + error handlers
│   ├── config.py                  # Configuration (DB, JWT, CORS)
│   ├── requirements.txt           # Pinned Python dependencies
│   ├── .env.example               # Environment variable template
│   │
│   ├── routes/
│   │   ├── auth_routes.py         # Signup, Login, Me endpoints
│   │   ├── submit_routes.py       # File submission API
│   │   └── verify_routes.py       # File verification API
│   │
│   ├── utils/
│   │   ├── hash_utils.py          # SHA-256 stream hashing
│   │   ├── db_utils.py            # MySQL operations + schema init
│   │   ├── auth_middleware.py     # @auth_required JWT decorator
│   │   └── storage.py             # Storage abstraction layer
│   │
│   └── database/
│       └── schema.sql             # Reference MySQL schema
│
├── frontend/
│   ├── package.json               # Dependencies & scripts
│   ├── vite.config.js             # Vite dev server config
│   ├── index.html                 # HTML entry point
│   │
│   └── src/
│       ├── main.jsx               # React entry point
│       ├── main.css               # Global styles & theme engine
│       ├── App.jsx                # Routing, layout & sidebar
│       │
│       ├── pages/
│       │   ├── Login.jsx          # Login & Signup (JWT auth)
│       │   └── Home.jsx           # Dashboard (placeholder)
│       │
│       └── components/
│           ├── FileUpload.jsx     # File submission with hash result
│           ├── VerifyHash.jsx     # File verification (Admin only)
│           ├── VerifyUpload.jsx   # Audit trail viewer
│           └── Settings.jsx       # Theme toggle (dark/light)
│
├── .gitignore
└── README.md
```

---

## ⚙️ Tech Stack

| Layer        | Technology                                  |
| ------------ | ------------------------------------------- |
| **Backend**  | Python Flask, Flask-CORS                    |
| **Database** | MySQL 8.x                                   |
| **Auth**     | JWT (PyJWT) + bcrypt                        |
| **Security** | SHA-256 hashing, blockchain-style anchoring |
| **Frontend** | React (Vite)                                |

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id VARCHAR(100) NOT NULL UNIQUE,
    filename VARCHAR(255) NULL,
    content_type VARCHAR(255) NULL,
    file_size BIGINT NULL,
    file_blob LONGBLOB NULL,
    file_hash CHAR(64) NOT NULL,
    timestamp DATETIME(6) NOT NULL,
    anchored_at DATETIME(6) NOT NULL,
    anchor_hash CHAR(64) NOT NULL UNIQUE,
    prev_anchor_hash CHAR(64) NULL
);

CREATE TABLE anchors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    block_index BIGINT NOT NULL UNIQUE,
    submission_id VARCHAR(100) NOT NULL UNIQUE,
    file_hash CHAR(64) NOT NULL,
    anchored_at DATETIME(6) NOT NULL,
    prev_anchor_hash CHAR(64) NULL,
    anchor_hash CHAR(64) NOT NULL UNIQUE
);
```

> Tables are auto-created on server startup by `db_utils.init_database()`.

---

## 🔧 Backend Setup

```bash
cd backend
python -m venv venv
```

**Activate virtual environment:**

```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Configure environment:** Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Run server:**

```bash
python app.py
```

> Backend runs at: `http://localhost:5000`

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint           | Auth   | Description                                        |
| ------ | ------------------ | ------ | -------------------------------------------------- |
| `POST` | `/api/auth/signup` | No     | Register — `{username, email, password}`           |
| `POST` | `/api/auth/login`  | No     | Login — `{username, password}` (username or email) |
| `GET`  | `/api/auth/me`     | Bearer | Get current authenticated user                     |

### File Operations

| Method | Endpoint      | Auth | Description                                       |
| ------ | ------------- | ---- | ------------------------------------------------- |
| `POST` | `/api/submit` | No   | Submit file — returns submission ID, hash, anchor |
| `POST` | `/api/verify` | No   | Verify file — returns authenticity result         |
| `GET`  | `/api/health` | No   | Health check                                      |

---

## 🎯 Use Cases

- 🏅 Hackathon submissions
- 🎓 Academic project evaluations
- 🔬 Research integrity verification
- 📄 Secure document handling
- 🔐 Digital evidence validation

---

## 🏆 Demo Workflow

1. **Sign up** for an account
2. **Upload** original file → receive submission ID + blockchain anchor proof
3. **Modify** the file slightly
4. **Verify** the modified file with the submission ID
5. **System detects** tampering instantly ❌

---

## 🔮 Future Enhancements

- [x] React frontend (Submit, Verify, Dashboard pages)
- [x] Role-based access control
- [ ] QR-based verification
- [ ] Digital submission certificates
- [ ] Admin dashboard
- [ ] Cloud storage integration

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
