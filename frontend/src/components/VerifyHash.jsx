import React, { useState, useRef } from 'react';
import { Search, FileCheck, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { verifyFile } from '../api/api';

const VerifyHash = () => {
    const [targetHash, setTargetHash] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setResult(null);
            setError(null);
        }
    };

    const handleVerify = async () => {
        if (!selectedFile) {
            setError('Please select a file to verify.');
            return;
        }
        if (!targetHash.trim()) {
            setError('Please enter the submission ID or hash.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('submission_id', targetHash.trim());

            const data = await verifyFile(formData);

            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError('Failed to connect to the server. Please check if the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pro-card">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'25px'}}>
                <h3 style={{margin:0, fontSize:'1.2rem'}}>Audit Logs</h3>
                <span className="status-badge" style={{background:'rgba(255,255,255,0.05)', color:'var(--text-dim)'}}>Verification Engine</span>
            </div>

            <div className="input-field-wrapper">
                <label style={{fontSize:'0.75rem', color:'var(--text-dim)', marginBottom:'8px', display:'block'}}>SUBMISSION ID</label>
                <div className="input-with-icon">
                    <Search className="input-icon" size={18} />
                    <input type="text" placeholder="Paste submission ID to verify..." value={targetHash} onChange={(e)=>setTargetHash(e.target.value)} />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            <div
                className="upload-box"
                style={{height:'100px', border:'1px solid var(--border)', cursor:'pointer'}}
                onClick={() => fileInputRef.current?.click()}
            >
                <FileCheck size={28} color="var(--primary)" />
                <p style={{fontSize:'0.8rem'}}>
                    {selectedFile ? `📄 ${selectedFile.name}` : 'Click to Select Local File for Cross-Check'}
                </p>
            </div>

            {error && (
                <div style={{marginTop:'15px', padding:'12px', borderRadius:'10px', background:'rgba(255,80,80,0.1)', border:'1px solid rgba(255,80,80,0.3)', color:'#ff5050', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'8px'}}>
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {result && (
                <div style={{marginTop:'15px', padding:'15px', borderRadius:'10px', background: result.verified ? 'rgba(0,255,136,0.08)' : 'rgba(255,80,80,0.08)', border: `1px solid ${result.verified ? 'rgba(0,255,136,0.3)' : 'rgba(255,80,80,0.3)'}` }}>
                    <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px', color: result.verified ? '#00ff88' : '#ff5050', fontWeight:'700', fontSize:'0.95rem'}}>
                        {result.verified ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                        {result.status}
                    </div>
                    <div style={{fontSize:'0.75rem', color:'var(--text-dim)', display:'flex', flexDirection:'column', gap:'6px'}}>
                        <span><strong>Original Hash:</strong> {result.original_hash}</span>
                        <span><strong>Uploaded Hash:</strong> {result.uploaded_hash}</span>
                        <span><strong>Submitted At:</strong> {result.timestamp}</span>
                    </div>
                </div>
            )}

            <button
                className="submit-btn"
                style={{width:'100%', marginTop:'20px', background:'transparent', border:'1px solid var(--primary)', color:'var(--primary)'}}
                onClick={handleVerify}
                disabled={loading}
            >
                <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                {loading ? ' VERIFYING...' : ' RUN AUDIT CHECK'}
            </button>
        </div>
    );
};
export default VerifyHash;