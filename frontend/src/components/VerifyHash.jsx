import React, { useState, useRef } from 'react';
import { Search, FileCheck, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const VerifyHash = () => {
    const [targetHash, setTargetHash] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleVerify = async () => {
        if (!targetHash || !selectedFile) {
            setError("Please provide both a submission ID and a file.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('submission_id', targetHash.trim());

            const response = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else {
                setResult(data);
            }
        } catch (err) {
            setError("Connection to security node failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pro-card">
            <h3 style={{ margin: '0 0 25px 0', fontSize: '1.2rem' }}>Quick Hash Verification</h3>

            <div className="input-field-wrapper" style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', display: 'block' }}>SUBMISSION ID</label>
                <div className="input-with-icon">
                    <Search className="input-icon" size={18} />
                    <input 
                        type="text" 
                        placeholder="e.g. HV-20316EF525B9" 
                        value={targetHash} 
                        onChange={(e) => setTargetHash(e.target.value)} 
                    />
                </div>
            </div>

            <div 
                className="upload-box" 
                onClick={() => fileInputRef.current.click()}
                style={{ height: '100px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.1)', cursor: 'pointer' }}
            >
                <input type="file" hidden ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} />
                <FileCheck size={24} color={selectedFile ? 'var(--primary)' : 'var(--text-dim)'} />
                <p style={{ fontSize: '0.85rem', margin: '10px 0 0 0' }}>
                    {selectedFile ? selectedFile.name : "Select File for Comparison"}
                </p>
            </div>

            <button onClick={handleVerify} className="submit-btn" style={{ width: '100%', marginTop: '20px' }} disabled={loading}>
                <RefreshCw size={18} className={loading ? 'spinning' : ''} />
                {loading ? ' VERIFYING...' : ' RUN AUDIT CHECK'}
            </button>

            {error && (
                <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,80,80,0.1)', borderRadius: '12px', borderLeft: '4px solid #ff5050', color: '#ff5050', display: 'flex', gap: '10px' }}>
                    <AlertCircle size={18} />
                    <span style={{ fontSize: '0.85rem' }}>{error}</span>
                </div>
            )}

            {result && (
                <div style={{ 
                    marginTop: '25px', padding: '20px', borderRadius: '15px', 
                    background: result.verified ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 80, 80, 0.05)',
                    border: `1px solid ${result.verified ? 'var(--primary)' : '#ff5050'}`
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                        {result.verified ? <CheckCircle color="var(--primary)" /> : <XCircle color="#ff5050" />}
                        <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{result.status}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <div style={{ fontSize: '0.75rem' }}>
                            <div style={{ color: 'var(--text-dim)' }}>STORED ON LEDGER</div>
                            <code style={{ color: 'var(--primary)', wordBreak: 'break-all' }}>{result.original_hash}</code>
                        </div>
                        <div style={{ fontSize: '0.75rem' }}>
                            <div style={{ color: 'var(--text-dim)' }}>UPLOADED COPY</div>
                            <code style={{ color: result.verified ? 'var(--primary)' : '#ff5050', wordBreak: 'break-all' }}>{result.uploaded_hash}</code>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyHash;