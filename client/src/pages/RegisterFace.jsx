import { useState, useRef } from 'react';
import UploadImage from '../components/UploadImage';
import WebcamPreview from '../components/WebcamPreview';
import { registerFace } from '../api/client';
import styles from '../styles/RegisterFace.module.css';

const RegisterFace = () => {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'webcam'
  const [captures, setCaptures] = useState([]);
  const webcamRef = useRef(null);
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleFileChange = (uploadedFile, previewUrl) => {
    setFile(uploadedFile);
    setPreview(previewUrl);
    
    // If we upload a file, switch to upload mode
    setInputMethod('upload');
    // Clear any webcam captures
    setCaptures([]);
  };
  
  const handleCaptureFromWebcam = (capturedFile, previewUrl) => {
    // Store both the file and preview URL
    const captureData = { file: capturedFile, preview: previewUrl };
    
    // Set as current file and add to captures array
    setFile(capturedFile);
    setCaptures(prevCaptures => [...prevCaptures, captureData]);
    
    // Ensure we're in webcam mode
    setInputMethod('webcam');
    
    // Clear any uploaded file preview
    setPreview('');
    
    console.log('Captured webcam image:', 
      capturedFile.name, 
      capturedFile.type, 
      capturedFile.size, 
      'bytes');
  };
  
  const handleRemoveCapture = (index) => {
    const newCaptures = [...captures];
    newCaptures.splice(index, 1);
    setCaptures(newCaptures);
    
    // Update the current file to the last capture, or null if none left
    if (newCaptures.length > 0) {
      setFile(newCaptures[newCaptures.length - 1].file);
    } else {
      setFile(null);
    }
  };
  
  const handleSwitchInputMethod = (method) => {
    setInputMethod(method);
    
    // Reset state for the other method
    if (method === 'upload') {
      setCaptures([]);
    } else {
      setPreview('');
      setFile(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (inputMethod === 'upload' && !file) {
      setError('Please upload an image');
      return;
    }
    
    if (inputMethod === 'webcam' && captures.length === 0) {
      setError('Please capture a photo with your webcam');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Ensure the file is properly named with an extension
      // This is important for the server to identify the file type
      let fileToSend = file;
      
      // For webcam captures, we already have a properly formatted file from WebcamPreview
      if (inputMethod === 'webcam' && captures.length > 0) {
        try {
          // Use the latest capture
          const latestCapture = captures[captures.length - 1];
          
          if (latestCapture.file instanceof File) {
            // The file from WebcamPreview component should already be correctly formatted
            fileToSend = latestCapture.file;
            console.log("Using webcam file:", fileToSend.name, fileToSend.type, fileToSend.size);
          } else {
            throw new Error("Invalid webcam capture data");
          }
        } catch (error) {
          console.error("Error preparing webcam image:", error);
          throw new Error("Failed to prepare webcam image. Please try again or use the upload option.");
        }
      }
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('file', fileToSend);
      
      const response = await registerFace(formData);
      
      setSuccess(true);
      setUsername('');
      setFile(null);
      setPreview('');
      setCaptures([]);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to register face');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register Your Face</h2>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {success && (
            <div className={styles.success} role="alert">
              <strong className={styles.alertTitle}>Success!</strong>
              <span> Your face has been registered successfully.</span>
            </div>
          )}
          
          {error && (
            <div className={styles.error} role="alert">
              <strong className={styles.alertTitle}>Error!</strong>
              <span> {error}</span>
            </div>
          )}
          
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <div className={styles.inputWrapper}>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={styles.input}
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
          </div>
          
          <div className={styles.inputMethodToggle}>
            <button 
              type="button"
              className={`${styles.methodButton} ${inputMethod === 'upload' ? styles.active : ''}`}
              onClick={() => handleSwitchInputMethod('upload')}
            >
              <span className="material-icons">upload</span>
              Upload Photo
            </button>
            <button 
              type="button"
              className={`${styles.methodButton} ${inputMethod === 'webcam' ? styles.active : ''}`}
              onClick={() => handleSwitchInputMethod('webcam')}
            >
              <span className="material-icons">videocam</span>
              Use Webcam
            </button>
          </div>
          
          {inputMethod === 'upload' ? (
            <div className={styles.field}>
              <label className={styles.label}>Upload your photo</label>
              <UploadImage
                id="face-upload"
                preview={preview}
                onFileChange={handleFileChange}
                icon="photo_camera"
                accept="image/jpeg,image/png"
              />
            </div>
          ) : (
            <div className={styles.field}>
              <label className={styles.label}>Take a photo with your webcam</label>
              <WebcamPreview
                ref={webcamRef}
                onCapture={handleCaptureFromWebcam}
                captures={captures}
                onRemoveCapture={handleRemoveCapture}
              />
              {captures.length === 0 && (
                <p className={styles.hint}>
                  Click the capture button to take a photo
                </p>
              )}
            </div>
          )}
          
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting || 
                       (inputMethod === 'upload' && !file) || 
                       (inputMethod === 'webcam' && captures.length === 0)}
            >
              {isSubmitting ? 'Registering...' : 'Register Face'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RegisterFace;
