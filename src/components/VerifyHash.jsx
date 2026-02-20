import React, { useState } from 'react';
import { Search, FileCheck, RefreshCw, AlertCircle } from 'lucide-react';

const VerifyHash = () => {
    const [targetHash, setTargetHash] = useState('');
    const [isOk, setIsOk] = useState(null);

    return (
        <div className="pro-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px'}}>
                <h3 style={{margin:0, fontSize:'1.2rem'}}>Audit Logs</h3>
                <span className="status-badge" style={{background:'rgba(255,255,255,0.05)', color:'var(--text-dim)'}}>Verification Engine</span>
            </div>

            <div className="input-field-wrapper">
                <label style={{fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:'8px', display:'block'}}>TARGET SIGNATURE (SHA-256)</label>
                <div className="input-with-icon">
                    <Search className="input-icon" size={18} />
                    <input type="text" placeholder="Paste hash to compare..." value={targetHash} onChange={(e)=>setTargetHash(e.target.value)} />
                </div>
            </div>

            <div className="upload-box" style={{height:'100px', border:'1px solid var(--border)'}}>
                <FileCheck size={28} color="var(--primary)" />
                <p style={{fontSize:'0.8rem'}}>Select Local File for Cross-Check</p>
            </div>

            <button className="submit-btn" style={{width:'100%', marginTop:'20px', background:'transparent', border:'1px solid var(--primary)', color:'var(--primary)'}}>
                <RefreshCw size={18}/> RUN AUDIT CHECK
            </button>
        </div>
    );
};
export default VerifyHash;