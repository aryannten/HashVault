# 🛡️ HashVault — Tamper-Proof Submission Integrity System

HashVault is a secure digital submission platform that ensures the authenticity and integrity of uploaded files using cryptographic hashing and trusted timestamps. Once a file is submitted, any modification becomes immediately detectable.

Designed for hackathons, academic evaluations, and competitive events, HashVault prevents post-deadline changes and disputes over originality by providing verifiable proof of submission.

---

## 🚀 Features

- 🔐 SHA-256 Cryptographic Hashing  
- ⏱️ Trusted Timestamp Generation  
- 📤 Secure File Submission  
- 🔍 Tamper Detection & Verification  
- 🗄️ MySQL Proof Storage  
- ⚛️ React Frontend + Flask Backend  
- 🧾 Unique Submission ID  
- 🛡️ Integrity Assurance  

---

## 🧠 How It Works

### 📤 Submission

1. User uploads a file  
2. Backend generates SHA-256 hash (digital fingerprint)  
3. File stored securely on server  
4. Hash + timestamp saved in database  
5. Submission ID returned as proof  

### 🔍 Verification

1. Judge uploads file for verification  
2. Backend recomputes hash  
3. System compares with stored hash  
4. Result displayed:
   - ✅ Authentic (Unmodified)  
   - ❌ Tampered (Modified)  

---

## 🏗️ System Architecture

```
React Frontend → Flask API → MySQL Database
                    ↓
              File Storage
```

---

## 📁 Project Structure

```
hashvault/
│
├── backend/
│   ├── app.py                  # Main Flask server
│   ├── config.py               # Configuration (DB, paths)
│   ├── requirements.txt        # Python dependencies
│   │
│   ├── uploads/                # Stored submitted files
│   │
│   ├── models/
│   │   └── submission_model.py
│   │
│   ├── routes/
│   │   ├── submit_routes.py    # Submission API
│   │   └── verify_routes.py    # Verification API
│   │
│   ├── utils/
│   │   ├── hash_utils.py       # SHA-256 hashing logic
│   │   ├── db_utils.py         # Database operations
│   │   └── qr_utils.py         # Optional QR generation
│   │
│   └── database/
│       └── schema.sql          # MySQL schema
│
├── frontend/
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── VerifyUpload.jsx
│   │   │   └── ResultCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Submit.jsx
│   │   │   └── Verify.jsx
│   │   │
│   │   ├── api/
│   │   │   └── api.js          # Axios API config
│   │   │
│   │   ├── styles/
│   │   │   └── main.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── database/
│   └── schema.sql              # Database setup
│
└── README.md
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React (Vite), Axios, CSS |
| **Backend** | Python Flask, Flask-CORS |
| **Database** | MySQL |
| **Security** | SHA-256 Cryptographic Hashing |

---

## 🗄️ Database Schema

```sql
CREATE DATABASE hashvault;

CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    submission_id VARCHAR(100),
    filename VARCHAR(255),
    file_hash VARCHAR(256),
    team_name VARCHAR(255),
    timestamp DATETIME
);
```

---

## 🔧 Backend Setup (Flask)

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
pip install flask flask-cors pymysql qrcode reportlab
pip freeze > requirements.txt
```

**Run server:**

```bash
python app.py
```

> Backend runs at: `http://localhost:5000`

---

## 🎨 Frontend Setup (React)

```bash
cd frontend
npm install
npm install axios
npm run dev
```

> Frontend runs at: `http://localhost:5173`

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/submit` | Submit file — returns submission ID, hash, timestamp |
| `POST` | `/api/verify` | Verify file — returns authenticity result |

---

## 🎯 Use Cases

- 🏅 Hackathon submissions
- 🎓 Academic project evaluations
- 🔬 Research integrity verification
- 📄 Secure document handling
- 🔐 Digital evidence validation

---

## 🏆 Demo Workflow

1. **Upload** original file → Receive proof
2. **Modify** file slightly
3. **Verify** modified file
4. **System detects** tampering instantly

---

## 🔮 Future Enhancements

- [ ] QR-based verification
- [ ] Digital submission certificates
- [ ] Blockchain timestamping
- [ ] Role-based authentication
- [ ] Admin dashboard
- [ ] Cloud storage integration

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
