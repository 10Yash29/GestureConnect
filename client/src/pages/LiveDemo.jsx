import { useState, useEffect, useRef } from 'react';
import { predictGesture } from '../api/client';
import WebcamPreview from '../components/WebcamPreview';
import styles from '../styles/LiveDemo.module.css';

const LiveDemo = () => {
  const [isCapturing, setIsCapturing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [captureInterval, setCaptureInterval] = useState(2);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [prediction, setPrediction] = useState({
    gesture: '',
    binding: '',
    user: ''
  });
  const [predictions, setPredictions] = useState([]);
  const webcamRef = useRef(null);
  const captureTimerRef = useRef(null);
  
  useEffect(() => {
    // Start capturing when component mounts
    startCapturing();
    
    // Clean up when component unmounts
    return () => {
      if (captureTimerRef.current) {
        clearInterval(captureTimerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Restart capturing when interval changes
    if (isCapturing) {
      startCapturing();
    }
  }, [captureInterval]);
  
  const startCapturing = () => {
    // Clear any existing interval
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
    }
    
    // Set up new interval
    captureTimerRef.current = setInterval(() => {
      captureAndPredict();
    }, captureInterval * 1000);
  };
  
  const stopCapturing = () => {
    if (captureTimerRef.current) {
      clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }
  };
  
  const toggleCapturing = () => {
    if (isCapturing) {
      stopCapturing();
    } else {
      startCapturing();
    }
    setIsCapturing(!isCapturing);
  };
  
  const captureAndPredict = async () => {
    if (!webcamRef.current || !webcamRef.current.getScreenshot) {
      return;
    }
    
    try {
      // Capture image from webcam
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;
      
      // Convert data URL to Blob
      const res = await fetch(screenshot);
      const blob = await res.blob();
      
      // Create file from blob
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      
      // Make prediction request
      const result = await predictGesture(formData);
      
      // Update prediction and prediction history
      setPrediction({
        gesture: result.gesture || 'unknown',
        binding: result.binding || 'none',
        user: result.user || 'unknown'
      });
      
      // Add to prediction history with timestamp
      const newPrediction = {
        gesture: result.gesture || 'unknown',
        timestamp: new Date()
      };
      
      setPredictions(prev => [newPrediction, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };
  
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    return `${seconds}s ago`;
  };
  
  const handleIntervalChange = (e) => {
    setCaptureInterval(Number(e.target.value));
  };
  
  const handleConfidenceChange = (e) => {
    setConfidenceThreshold(Number(e.target.value));
  };
  
  const handleResetConfig = () => {
    setCaptureInterval(2);
    setConfidenceThreshold(70);
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Live Demo</h2>
        
        <div className={styles.content}>
          <div className={styles.webcamContainer}>
            <div className={styles.webcamWrapper}>
              <WebcamPreview
                ref={webcamRef}
                onLoad={() => setLoading(false)}
                mirrored={true}
                screenshotFormat="image/jpeg"
                width={800}
                height={600}
                className={styles.webcam}
              />
              
              {loading && (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                </div>
              )}
              
              <div className={styles.overlay}>
                <div className={styles.predictionContainer}>
                  <div className={styles.predictionItem}>
                    <div className={styles.predictionLabel}>Recognized Gesture</div>
                    <div className={styles.predictionValue}>{prediction.gesture}</div>
                  </div>
                  <div className={styles.predictionItem}>
                    <div className={styles.predictionLabel}>Key Binding</div>
                    <div className={styles.predictionBinding}>{prediction.binding}</div>
                  </div>
                  <div className={styles.predictionItem}>
                    <div className={styles.predictionLabel}>User</div>
                    <div className={styles.predictionValue}>{prediction.user}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.controls}>
            <div className={styles.captureInfo}>
              <div className={styles.captureInfoText}>
                <span className="material-icons">timer</span>
                <span>Capturing every {captureInterval} seconds</span>
              </div>
              <button
                type="button"
                className={`${styles.captureToggle} ${!isCapturing ? styles.captureTogglePaused : ''}`}
                onClick={toggleCapturing}
              >
                {isCapturing ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>
          
          <div className={styles.grid}>
            <div className={styles.predictions}>
              <h3 className={styles.sectionTitle}>Recent Predictions</h3>
              <div className={styles.predictionsList}>
                {predictions.length === 0 ? (
                  <div className={styles.emptyState}>No predictions yet</div>
                ) : (
                  predictions.map((pred, index) => (
                    <div key={index} className={styles.predictionHistoryItem}>
                      <div className={styles.predictionHistoryGesture}>
                        <span className="material-icons">front_hand</span>
                        <span>{pred.gesture}</span>
                      </div>
                      <span className={styles.predictionHistoryTime}>
                        {getTimeAgo(pred.timestamp)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className={styles.configuration}>
              <h3 className={styles.sectionTitle}>System Configuration</h3>
              <div className={styles.configOptions}>
                <div className={styles.configOption}>
                  <label htmlFor="capture-interval" className={styles.configLabel}>
                    Capture Interval (seconds)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={captureInterval}
                    className={styles.rangeInput}
                    id="capture-interval"
                    onChange={handleIntervalChange}
                  />
                  <div className={styles.rangeLabels}>
                    <span>1s</span>
                    <span>3s</span>
                    <span>5s</span>
                  </div>
                </div>
                
                <div className={styles.configOption}>
                  <label htmlFor="prediction-confidence" className={styles.configLabel}>
                    Prediction Confidence Threshold
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={confidenceThreshold}
                    className={styles.rangeInput}
                    id="prediction-confidence"
                    onChange={handleConfidenceChange}
                  />
                  <div className={styles.rangeLabels}>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                
                <div className={styles.resetConfig}>
                  <button
                    type="button"
                    className={styles.resetButton}
                    onClick={handleResetConfig}
                  >
                    <span className="material-icons">refresh</span>
                    Reset Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
