import React, { useState } from 'react';
import axios from 'axios';

const VerifyUpload = () => {
  const [file, setFile] = useState(null);
  const [submissionId, setSubmissionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    if (!submissionId.trim()) {
      alert("Please enter the Submission ID!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('submission_id', submissionId.trim());

    try {
      const response = await axios.post('http://localhost:5000/api/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error("Verification failed:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.error || "Verification failed.");
      } else {
        alert("Error uploading file. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Verify File Integrity</h2>
      
      <div style={styles.uploadBox}>
        <input 
          type="text"
          placeholder="Enter Submission ID..."
          value={submissionId}
          onChange={(e) => setSubmissionId(e.target.value)}
          style={styles.fileInput}
        />

        <input 
          type="file" 
          onChange={handleFileChange} 
          style={styles.fileInput}
        />
        {file && <p style={{color: '#00ffcc', fontSize: '0.85rem'}}>📄 {file.name}</p>}
        
        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={loading ? {...styles.btn, opacity: 0.6} : styles.btn}
        >
          {loading ? "Verifying..." : "Verify & Generate Hash"}
        </button>
      </div>

      {result && (
        <div style={styles.resultBox}>
          <p><strong>Status:</strong> <span style={{color: result.verified ? '#00ffcc' : '#ff5050', fontWeight: 'bold'}}>{result.status}</span></p>
          <p style={styles.hashText}><strong>Original Hash:</strong> {result.original_hash}</p>
          <p style={styles.hashText}><strong>Uploaded Hash:</strong> {result.uploaded_hash}</p>
          <p><strong>Submitted At:</strong> {result.timestamp}</p>
          <p><strong>Submission ID:</strong> {result.submission_id}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', color: '#fff', backgroundColor: '#0a0a0a', borderRadius: '10px' },
  title: { color: '#00ffcc', marginBottom: '20px' },
  uploadBox: { display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px' },
  fileInput: { padding: '10px', backgroundColor: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '5px' },
  btn: { 
    padding: '12px', 
    backgroundColor: '#00ffcc', 
    color: '#000', 
    fontWeight: 'bold', 
    border: 'none', 
    cursor: 'pointer',
    borderRadius: '5px' 
  },
  resultBox: { 
    marginTop: '20px', 
    padding: '15px', 
    border: '1px solid #00ffcc', 
    borderRadius: '5px',
    wordBreak: 'break-all'
  },
  hashText: { fontSize: '0.9rem', color: '#ffcc00' }
};

export default VerifyUpload;