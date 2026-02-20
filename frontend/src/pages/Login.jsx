import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, UserCheck, UserPlus } from 'lucide-react';

const Login = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', email: '', password: '' });
    const [role, setRole] = useState('Operator');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isSignup) {
            if (!credentials.username || !credentials.email || !credentials.password) {
                setError("All fields are required for signup.");
                return;
            }
        } else {
            if (!credentials.email || !credentials.password) {
                setError("Authentication credentials required.");
                return;
            }
        }

        setLoading(true);

        try {
            const url = isSignup
                ? 'http://localhost:5000/api/auth/signup'
                : 'http://localhost:5000/api/auth/login';

            const body = isSignup
                ? { username: credentials.username, email: credentials.email, password: credentials.password }
                : { username: credentials.email, password: credentials.password };

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();

            if (data.error) {
                setError(data.error + (data.details ? ': ' + data.details.join(', ') : ''));
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', role);
            localStorage.setItem('isAuthenticated', 'true');
            if (data.user) {
                localStorage.setItem('username', data.user.username);
            }
            
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError('Failed to connect to the server. Is the backend running?');
            setLoading(false);
        }
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

                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{isSignup ? 'Create Account' : 'Operator Login'}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '30px' }}>
                    {isSignup ? 'Register for HashVault Access' : 'Access HashVault Security Protocols'}
                </p>

                {error && (
                    <div className="error-msg">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {isSignup && (
                        <div className="input-with-icon">
                            <UserPlus className="input-icon" size={18} />
                            <input 
                                type="text" placeholder="Username (min 3 chars)" required
                                value={credentials.username}
                                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            />
                        </div>
                    )}

                    <div className="input-with-icon">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="text" placeholder={isSignup ? "Email Address" : "Username or Email"} required
                            value={credentials.email}
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>

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

                    <div className="input-with-icon">
                        <Lock className="input-icon" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder={isSignup ? "Password (min 6 chars)" : "Secret Access Key"} required
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                        <div onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '10px' }} disabled={loading}>
                        {loading ? 'PROCESSING...' : (isSignup ? 'CREATE ACCOUNT' : 'INITIALIZE SESSION')}
                    </button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {isSignup ? 'Already have an account? ' : "Don't have an account? "}
                    <span 
                        onClick={() => { setIsSignup(!isSignup); setError(''); }}
                        style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '700' }}
                    >
                        {isSignup ? 'Login' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;