import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, UploadCloud, File, Loader2, Sparkles, Download, CheckCircle, AlertCircle } from 'lucide-react';
import './index.css';

// TODO: Replace this with your actual n8n webhook URL
const N8N_WEBHOOK_URL = "http://localhost:5678/webhook-test/resume-upload";

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState('');
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setResumeFile(file);
        setError('');
      } else {
        setError('Please upload a valid PDF file.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }
    if (!resumeFile) {
      setError('Please upload your resume.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResultUrl('');

    try {
      const formData = new FormData();
      formData.append('job_description', jobDescription);
      formData.append('file', resumeFile);

      // We are sending the data to the n8n webhook
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText);
        throw new Error(`Server returned ${response.status}: ${errorText || 'Internal Server Error'}`);
      }

      // Expected response format: { "url": "https://..." }
      // Depending on your actual n8n webhook, adjust how you parse the response.
      // If it returns raw text, use response.text()
      const data = await response.json();

      // Extract pdf_url based on the exact n8n JSON output provided
      if (Array.isArray(data) && data.length > 0 && data[0].pdf_url) {
        setResultUrl(data[0].pdf_url);
      } else if (data && data.pdf_url) {
        setResultUrl(data.pdf_url);
      } else if (data && data.url) {
        setResultUrl(data.url);
      } else {
        setResultUrl(typeof data === 'string' ? data : '#');
      }

    } catch (err) {
      console.error("Fetch error details:", err);
      setError(`Error: ${err.message}. Please check your n8n workflow execution logs.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header>
        <Sparkles size={28} className="text-blue-400" style={{ color: '#60a5fa' }} />
        <h1>Resume Optimizer</h1>
      </header>

      <main className="main-container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
          style={{ marginBottom: '1rem' }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Tailor your resume instantly. Paste the job description, upload your PDF resume, and let our engine generate the perfect match.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!resultUrl ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="grid-layout"
            >
              {/* Left Column: Job Description */}
              <div className="glass-panel">
                <h2>
                  <FileText size={20} color="var(--primary)" />
                  Job Description
                </h2>
                <label htmlFor="job-desc">Paste the job requirements and details here</label>
                <textarea
                  id="job-desc"
                  rows={12}
                  placeholder="e.g. We are looking for a software engineer with 3+ years of experience in React, Node.js..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Right Column: Resume Upload */}
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h2>
                  <UploadCloud size={20} color="var(--accent)" />
                  Upload Resume
                </h2>
                <label>Upload your current resume in PDF format</label>

                <div
                  className={`dropzone ${isDragging ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="application/pdf"
                    style={{ display: 'none' }}
                    disabled={isLoading}
                  />

                  {resumeFile ? (
                    <>
                      <File size={48} color="var(--primary)" />
                      <p style={{ color: 'var(--text-main)', fontWeight: '500', fontSize: '1rem' }}>
                        {resumeFile.name}
                      </p>
                      <p style={{ fontSize: '0.8rem' }}>
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={48} color="var(--text-muted)" />
                      <p>Drag & drop your PDF file here, or click to browse</p>
                    </>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.9rem' }}
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}

                <div style={{ marginTop: '2rem' }}>
                  <button
                    className="btn"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="spinner" size={20} />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Optimized Resume
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel result-card"
              style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}
            >
              <CheckCircle size={64} className="success-icon" />
              <h2 style={{ justifyContent: 'center', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                Resume Optimized!
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
                Your resume has been successfully tailored with the right keywords to match the job description.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{ textDecoration: 'none', width: 'auto' }}
                >
                  <Download size={20} />
                  Download PDF
                </a>

                <button
                  className="btn"
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', width: 'auto' }}
                  onClick={() => {
                    setResultUrl('');
                    setResumeFile(null);
                    setJobDescription('');
                  }}
                >
                  Optimize Another
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </>
  );
}

export default App;
