import { useState } from 'react';
import UploadImage from '../components/UploadImage';
import WebcamPreview from '../components/WebcamPreview';
import { collectGesture } from '../api/client';
import styles from '../styles/CollectGesture.module.css';

const CollectGesture = () => {
  const [gestureName, setGestureName] = useState('');
  const [keyBinding, setKeyBinding] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [captureMethod, setCaptureMethod] = useState('upload');
  const [captures, setCaptures] = useState([]);
  const [sampleCount, setSampleCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleGestureNameChange = (e) => {
    setGestureName(e.target.value);
  };
  
  const handleKeyBindingChange = (e) => {
    setKeyBinding(e.target.value);
  };
  
  const handleFileChange = (uploadedFile, previewUrl) => {
    setFile(uploadedFile);
    setPreview(previewUrl);
  };
  
  const handleTabChange = (method) => {
    setCaptureMethod(method);
  };
  
  const handleCapture = (capturedFile, capturedPreview) => {
    setCaptures([...captures, { file: capturedFile, preview: capturedPreview }]);
  };
  
  const handleRemoveCapture = (index) => {
    setCaptures(captures.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gestureName.trim()) {
      setError('Gesture name is required');
      return;
    }
    
    if (!keyBinding.trim()) {
      setError('Key binding is required');
      return;
    }
    
    if (captureMethod === 'upload' && !file) {
      setError('Please upload an image');
      return;
    }
    
    if (captureMethod === 'webcam' && captures.length === 0) {
      setError('Please capture at least one image');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      if (captureMethod === 'upload') {
        const formData = new FormData();
        formData.append('gesture_name', gestureName);
        formData.append('binding', keyBinding);
        formData.append('file', file);
        
        await collectGesture(formData);
        setSampleCount(prev => prev + 1);
        setSuccessMessage(`👍 saved ${sampleCount + 1} samples`);
      } else {
        // Process each captured image
        for (let i = 0; i < captures.length; i++) {
          const formData = new FormData();
          formData.append('gesture_name', gestureName);
          formData.append('binding', keyBinding);
          formData.append('file', captures[i].file);
          
          await collectGesture(formData);
          setSampleCount(prev => prev + 1);
        }
        setSuccessMessage(`👍 saved ${sampleCount + captures.length} samples`);
        setCaptures([]);
      }
      
      setSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(err.message || 'Failed to collect gesture');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Collect Gesture</h2>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {success && (
            <div className={styles.success} role="alert">
              <strong className={styles.alertTitle}>Success!</strong>
              <span> {successMessage}</span>
            </div>
          )}
          
          {error && (
            <div className={styles.error} role="alert">
              <strong className={styles.alertTitle}>Error!</strong>
              <span> {error}</span>
            </div>
          )}
          
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="gesture-name" className={styles.label}>Gesture Name</label>
              <div className={styles.inputWrapper}>
                <input
                  id="gesture-name"
                  name="gesture_name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g., thumbs_up, peace, point"
                  value={gestureName}
                  onChange={handleGestureNameChange}
                />
              </div>
            </div>
            
            <div className={styles.field}>
              <label htmlFor="key-binding" className={styles.label}>Key Binding</label>
              <div className={styles.inputWrapper}>
                <input
                  id="key-binding"
                  name="binding"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g., space, enter, a"
                  value={keyBinding}
                  onChange={handleKeyBindingChange}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.tabs}>
            <div className={styles.tabButtons}>
              <button
                type="button"
                className={`${styles.tabButton} ${captureMethod === 'upload' ? styles.tabButtonActive : ''}`}
                onClick={() => handleTabChange('upload')}
                aria-current={captureMethod === 'upload' ? 'page' : undefined}
              >
                Upload Image
              </button>
              <button
                type="button"
                className={`${styles.tabButton} ${captureMethod === 'webcam' ? styles.tabButtonActive : ''}`}
                onClick={() => handleTabChange('webcam')}
                aria-current={captureMethod === 'webcam' ? 'page' : undefined}
              >
                Use Webcam
              </button>
            </div>
            
            {captureMethod === 'upload' ? (
              <div className={styles.tabContent}>
                <UploadImage
                  id="gesture-upload"
                  preview={preview}
                  onFileChange={handleFileChange}
                  icon="front_hand"
                  accept="image/jpeg,image/png"
                />
              </div>
            ) : (
              <div className={styles.tabContent}>
                <WebcamPreview
                  onCapture={handleCapture}
                  captures={captures}
                  onRemoveCapture={handleRemoveCapture}
                />
              </div>
            )}
          </div>
          
          <div className={styles.buttonWrapper}>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Gesture'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CollectGesture;
