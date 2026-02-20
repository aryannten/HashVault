import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { 
  UploadCloud, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  User as UserIcon,
  LogOut,
  Search
} from "lucide-react";

import Login from "./pages/Login.jsx";
import FileUpload from "./components/FileUpload.jsx";
import VerifyHash from "./components/VerifyHash.jsx";
import Settings from "./components/Settings.jsx";
import "./main.css";

const DashboardLayout = ({ children, title, role }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <ShieldCheck size={28} />
          <span>HASHVAULT</span>
        </div>
        
        <nav className="nav-list">
          {/* Sabko dikhega */}
          <NavLink to="/submit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <UploadCloud size={20} /> <span>Upload Files</span>
          </NavLink>
          
          {/* ⭐ Role Logic: Verify sirf Admin ko dikhega */}
          {role === 'Admin' && (
            <NavLink to="/verify" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <Search size={20} /> <span>Verify Hash</span>
            </NavLink>
          )}

          {/* ⭐ Sabko dikhega (Operator & Admin) */}
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <SettingsIcon size={20} /> <span>Settings</span>
          </NavLink>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="nav-item" style={{ color: 'var(--error)', background: 'none', border: 'none', width: '100%', cursor: 'pointer' }}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="header-section">
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{title}</h2>
          <div className="user-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--border-color)', padding: '8px 15px', borderRadius: '12px' }}>
            <UserIcon size={16} /> 
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{localStorage.getItem('username') || 'Operator'}</span>
                <span style={{ fontSize: '0.6rem', color: 'var(--primary)', fontWeight: '800' }}>{role?.toUpperCase()}</span>
            </div>
          </div>
        </header>
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
};

function App() {
  const userRole = localStorage.getItem('userRole') || 'Operator';

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/submit" element={<DashboardLayout title="Secure File Submission" role={userRole}><FileUpload /></DashboardLayout>} />
        
        {/* Verify Hash: Protected (Only Admin) */}
        <Route path="/verify" element={
            userRole === 'Admin' ? (
                <DashboardLayout title="Integrity Audit Engine" role={userRole}><VerifyHash /></DashboardLayout>
            ) : <Navigate to="/submit" replace />
        } />

        {/* Settings: Sabke liye functional */}
        <Route path="/settings" element={<DashboardLayout title="System Configuration" role={userRole}><Settings /></DashboardLayout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;