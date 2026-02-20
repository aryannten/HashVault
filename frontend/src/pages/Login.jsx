import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (!credentials.email || !credentials.password) {
            setError("Authentication credentials required.");
            return;
        }
        // Success logic
        navigate('/submit');
    };

    return (
        <div style={{
            height: '100vh', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
        }}>
            <div style={{
                background: 'var(--side-nav)',
                padding: '40px',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ 
                    display: 'inline-flex', 
                    padding: '15px', 
                    background: 'rgba(0, 255, 136, 0.1)', 
                    borderRadius: '16px', 
                    marginBottom: '20px' 
                }}>
                    <ShieldCheck size={32} color="var(--primary)" />
                </div>

                <h2 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>Operator Login</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '30px' }}>
                    Access HashVault Security Protocols
                </p>

                {error && (
                    <div style={{ 
                        background: 'rgba(255, 71, 71, 0.1)', 
                        color: '#ff4747', 
                        padding: '12px', 
                        borderRadius: '10px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px', 
                        marginBottom: '20px', 
                        fontSize: '0.8rem',
                        border: '1px solid rgba(255, 71, 71, 0.2)'
                    }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="input-with-icon">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="email" 
                            placeholder="Operator Email" 
                            required
                            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                        />
                    </div>

                    <div className="input-with-icon">
                        <Lock className="input-icon" size={18} />
                        <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Secret Access Key" 
                            required
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        />
                        <div 
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '15px', cursor: 'pointer', color: 'var(--text-dim)' }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </div>
                    </div>

                    <button type="submit" className="submit-btn" style={{ marginTop: '10px', width: '100%' }}>
                        INITIALIZE SESSION
                    </button>
                </form>
                
                <p style={{ marginTop: '25px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Unauthorized access is logged and monitored.
                </p>
            </div>
        </div>
    );
};

export default Login;