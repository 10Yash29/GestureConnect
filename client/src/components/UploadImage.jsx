import { useState, useRef } from 'react';
import styles from '../styles/UploadImage.module.css';

const UploadImage = ({ id, preview, onFileChange, icon = 'photo_camera', accept = 'image/*' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };
  
  const handleFile = (file) => {
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB');
      return;
    }
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Pass file and preview URL to parent component
    onFileChange(file, previewUrl);
  };
  
  return (
    <div
      className={`${styles.container} ${isDragging ? styles.dragging : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={styles.content}>
        {preview ? (
          <div className={styles.preview}>
            <img src={preview} alt="Preview" className={styles.previewImage} />
          </div>
        ) : (
          <div className={styles.uploadIcon}>
            <span className="material-icons">{icon}</span>
          </div>
        )}
        
        <div className={styles.uploadText}>
          <div className={styles.uploadPrompt}>
            <span className={styles.uploadLink} onClick={handleClick}>Upload a file</span>
            <span className={styles.uploadOr}>or drag and drop</span>
          </div>
          <p className={styles.uploadHint}>
            PNG, JPG up to 5MB
          </p>
        </div>
        
        <input
          id={id}
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept={accept}
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
};

export default UploadImage;
