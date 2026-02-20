import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { LayoutDashboard, UploadCloud, ShieldCheck, Settings, User as UserIcon } from "lucide-react";
import Login from "./pages/Login.jsx";
import FileUpload from "./components/FileUpload.jsx";
import VerifyHash from "./components/VerifyHash.jsx"; // Yeh check kar
import "./main.css";

const DashboardLayout = ({ children, title }) => (
  <div className="dashboard-container">
    <aside className="sidebar">
      <div className="logo">HASHVAULT</div>
      <nav className="nav-list">
        <NavLink to="/submit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <UploadCloud size={20} /> <span>Upload Files</span>
        </NavLink>
        <NavLink to="/verify" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
          <ShieldCheck size={20} /> <span>Verify Hash</span>
        </NavLink>
        <div className="nav-item"><Settings size={20} /> <span>Settings</span></div>
      </nav>
    </aside>
    <main className="main-content">
      <header className="header-section">
        <h2>{title}</h2>
        <div className="user-badge">
          <UserIcon size={16} /> <span>Atharva_Dev • Operator</span>
        </div>
      </header>
      <div className="content-body">{children}</div>
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="container"><Login /></div>} />
        <Route path="/submit" element={<DashboardLayout title="Project Submission"><div className="upload-card"><FileUpload /></div></DashboardLayout>} />
        <Route path="/verify" element={<DashboardLayout title="Integrity Verification"><div className="upload-card"><VerifyHash /></div></DashboardLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;