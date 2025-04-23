import { useState } from 'react';
import UploadImage from '../components/UploadImage';
import { registerFace } from '../api/client';
import styles from '../styles/RegisterFace.module.css';

const RegisterFace = () => {
  const [username, setUsername] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleFileChange = (uploadedFile, previewUrl) => {
    setFile(uploadedFile);
    setPreview(previewUrl);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    if (!file) {
      setError('Please upload an image');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('file', file);
      
      const response = await registerFace(formData);
      
      setSuccess(true);
      setUsername('');
      setFile(null);
      setPreview('');
      
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
          
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
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
