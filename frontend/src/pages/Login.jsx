import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [role, setRole] = useState('Operator'); // Default Role
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        if (!credentials.email || !credentials.password) {
            setError("Authentication credentials required.");
            return;
        }

        // --- ASLI JADU YAHA HAI ---
        localStorage.setItem('userRole', role); // Role save karo
        localStorage.setItem('isAuthenticated', 'true'); 
        
        // Dashboard pe bhejo
        navigate('/submit');
        window.location.reload(); // Force reload taaki App.jsx naya role pakad le
    };

    return (
        <div style={{
            height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center',
            background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
        }}>
            <div className="pro-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '15px', background: 'rgba(0, 255, 136, 0.1)', borderRadius: '16px', marginBottom: '20px' }}>
                    <ShieldCheck size={32} color="var(--primary)" />
                </div>

                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Operator Login</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '30px' }}>Access HashVault Security Protocols</p>

                {error && (
                    <div className="error-msg">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* Email Input */}
                    <div className="input-with-icon">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="email" placeholder="Operator Email" required
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>

                    {/* ⭐ ROLE SELECTOR DROPDOWN ⭐ */}
                    <div className="input-with-icon">
                        <UserCheck className="input-icon" size={18} />
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{
                                width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)',
                                padding: '14px 15px 14px 45px', borderRadius: '14px', color: 'var(--text-primary)', outline: 'none', appearance: 'none'
                            }}
                        >
                            <option value="Operator">Operator (Standard)</option>
                            <option value="Admin">Super Admin (Root)</option>
                        </select>
                    </div>

                    {/* Password Input */}
                    <div className="input-with-icon">
                        <Lock className="input-icon" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Secret Access Key" required
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '10px' }}>
                        INITIALIZE SESSION
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;