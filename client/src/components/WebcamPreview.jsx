import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import Webcam from 'react-webcam';
import styles from '../styles/WebcamPreview.module.css';

const WebcamPreview = forwardRef(({
  onCapture,
  captures = [],
  onRemoveCapture,
  mirrored = true,
  screenshotFormat = 'image/jpeg',
  onLoad,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getScreenshot: () => webcamRef.current?.getScreenshot()
  }));
  
  useEffect(() => {
    if (!isLoading && onLoad) {
      onLoad();
    }
  }, [isLoading, onLoad]);
  
  const handleUserMedia = () => {
    setIsLoading(false);
  };
  
  const handleUserMediaError = (error) => {
    console.error('Webcam error:', error);
    setIsLoading(false);
  };
  
  const handleCapture = () => {
    if (!webcamRef.current) return;
    
    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;
    
    // Convert data URL to Blob
    fetch(screenshot)
      .then(res => res.blob())
      .then(blob => {
        // Create file from blob
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        
        // Pass to parent component
        if (onCapture) {
          onCapture(file, screenshot);
        }
      });
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.webcamContainer}>
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={mirrored}
          screenshotFormat={screenshotFormat}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          videoConstraints={{
            facingMode: 'user'
          }}
          className={styles.webcam}
          {...props}
        />
        
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}
        
        {onCapture && (
          <div className={styles.captureButtonContainer}>
            <button
              type="button"
              className={styles.captureButton}
              onClick={handleCapture}
            >
              <span className="material-icons">camera</span>
              Capture
            </button>
          </div>
        )}
      </div>
      
      {captures && captures.length > 0 && (
        <div className={styles.capturesContainer}>
          {captures.map((capture, index) => (
            <div key={index} className={styles.captureItem}>
              <img src={capture.preview} alt={`Capture ${index + 1}`} className={styles.captureImage} />
              
              {onRemoveCapture && (
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => onRemoveCapture(index)}
                >
                  <span className="material-icons">close</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

WebcamPreview.displayName = 'WebcamPreview';

export default WebcamPreview;
