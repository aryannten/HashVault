import React, { useState, useEffect } from 'react';
import { Shield, Zap, Database, Activity, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="pro-card" style={{ flex: 1, minWidth: '200px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ padding: '12px', background: `${color}15`, borderRadius: '12px', color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: '700', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{value}</div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ title, desc, icon: Icon, path, color }) => {
  const navigate = useNavigate();
  return (
    <div className="pro-card" onClick={() => navigate(path)} style={{ 
      flex: 1, cursor: 'pointer', border: '1px solid var(--border-color)', transition: '0.3s'
    }}>
      <div style={{ color: color, marginBottom: '20px' }}>
        <Icon size={32} />
      </div>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '20px' }}>{desc}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '700' }}>
        INITIALIZE PROTOCOL <ArrowRight size={16} />
      </div>
    </div>
  );
};

const Home = () => {
    const [stats, setStats] = useState({
        total_hashes: 0,
        active_nodes: 0,
        system_health: '0%',
        network_status: 'Connecting...'
    });

    useEffect(() => {
        fetch('http://localhost:5000/api/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(() => console.error("Stats fetch failed"));
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <StatCard icon={Database} label="Anchored Hashes" value={stats.total_hashes} color="var(--primary)" />
                <StatCard icon={Globe} label="Active Nodes" value={stats.active_nodes} color="#6366f1" />
                <StatCard icon={Activity} label="System Health" value={stats.system_health} color="#fbbf24" />
                <StatCard icon={ShieldCheck} label="Status" value={stats.network_status} color="#10b981" />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <FeatureCard 
                    title="Anchor New Assets" 
                    desc="Generate cryptographic proof of integrity for any digital asset and anchor it to the immutable ledger."
                    icon={Zap}
                    path="/submit"
                    color="var(--primary)"
                />
                <FeatureCard 
                    title="Audit Files" 
                    desc="Verify the authenticity of a file by comparing its live signature against the anchored blockchain record."
                    icon={Shield}
                    path="/verify"
                    color="#6366f1"
                />
            </div>

            <div className="pro-card" style={{ background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(99,102,241,0.05) 100%)' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Global Security Feed</h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>All cryptographic proofs are being processed via SHA-256 standard protocols.</p>
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--primary)' }}>
                    {">"} Initializing peer-to-peer verification checks...<br/>
                    {">"} System synchronized with main ledger node.<br/>
                    {">"} All anchor points validated successfully.
                </div>
            </div>
        </div>
    );
};

export default Home;
