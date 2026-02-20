import React, { useState, useEffect } from 'react';
import { Sun, Moon, Database, Zap } from 'lucide-react';

const Settings = () => {
    const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') !== 'light');
    const [blockchainLog, setBlockchainLog] = useState(true);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('vault-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const Toggle = ({ active, toggle, color }) => (
        <div onClick={toggle} style={{
            width: '50px', height: '24px', background: active ? color : '#334155',
            borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: '0.3s'
        }}>
            <div style={{
                width: '18px', height: '18px', background: '#fff', borderRadius: '50%',
                position: 'absolute', top: '3px', left: active ? '29px' : '3px', transition: '0.3s'
            }} />
        </div>
    );

    return (
        <div className="pro-card" style={{ maxWidth: '600px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '25px' }}>Interface & Security</h3>

            <div style={rowStyle}>
                <div style={infoStyle}>
                    <div style={iconBox('var(--primary)')}>{isDark ? <Moon size={20} /> : <Sun size={20} />}</div>
                    <div><div style={labelStyle}>Visual Interface</div><div style={subLabelStyle}>Dark / Bright Mode</div></div>
                </div>
                <Toggle active={isDark} toggle={() => setIsDark(!isDark)} color="var(--primary)" />
            </div>

            <div style={rowStyle}>
                <div style={infoStyle}>
                    <div style={iconBox('#6366f1')}><Database size={20} /></div>
                    <div><div style={labelStyle}>Blockchain Logging</div><div style={subLabelStyle}>Immutable Audit Trail</div></div>
                </div>
                <Toggle active={blockchainLog} toggle={() => setBlockchainLog(!blockchainLog)} color="#6366f1" />
            </div>
        </div>
    );
};

const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' };
const infoStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
const labelStyle = { fontWeight: '600', fontSize: '0.9rem' };
const subLabelStyle = { fontSize: '0.75rem', color: 'var(--text-secondary)' };
const iconBox = (color) => ({ padding: '8px', background: `${color}15`, borderRadius: '10px', color: color, display: 'flex' });

export default Settings;