import React, { useState } from 'react';
import { Shield, Upload, User, CheckCircle, Loader2 } from 'lucide-react';

const FileUpload = () => {
    const [team, setTeam] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hash, setHash] = useState('');

    const handleSubmit = () => {
        if(!team || !file) return alert("All fields are mandatory!");
        setLoading(true);
        setTimeout(() => {
            setHash("SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="pro-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px'}}>
                <h3 style={{margin:0, fontSize:'1.2rem'}}>Vault Submission</h3>
                <span className="status-badge" style={{background:'rgba(0,255,136,0.1)', color:'var(--primary)'}}>Active Node</span>
            </div>

            <div className="input-field-wrapper">
                <label style={{fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:'8px', display:'block'}}>RESEARCHER/TEAM IDENTITY</label>
                <div className="input-with-icon">
                    <User className="input-icon" size={18} />
                    <input type="text" placeholder="e.g. ALPHA_TEAM_01" value={team} onChange={(e)=>setTeam(e.target.value)} />
                </div>
            </div>

            <div className="upload-box" 
                 onClick={() => document.getElementById('f1').click()}
                 style={{height:'150px', border:'2px dashed var(--border)', background:'rgba(0,0,0,0.2)'}}>
                <input id="f1" type="file" hidden onChange={(e)=>setFile(e.target.files[0])} />
                <Upload size={32} color="var(--text-dim)" />
                <p style={{fontSize:'0.85rem'}}>{file ? file.name : "Drop Secure Package Here"}</p>
            </div>

            <button onClick={handleSubmit} className="submit-btn" style={{width:'100%', marginTop:'20px'}}>
                {loading ? <Loader2 className="spinner-icon" /> : <><Shield size={18}/> SEAL & SUBMIT</>}
            </button>

            {hash && (
                <div style={{marginTop:'20px', padding:'15px', background:'#000', borderRadius:'12px', borderLeft:'4px solid var(--primary)'}}>
                    <div style={{fontSize:'0.65rem', color:'var(--primary)', fontWeight:800}}>INTEGRITY HASH GENERATED</div>
                    <code style={{fontSize:'0.75rem', wordBreak:'break-all'}}>{hash}</code>
                </div>
            )}
        </div>
    );
};
export default FileUpload;