import { useState } from 'react';
import { Link } from 'wouter';
import { trainModel } from '../api/client';
import styles from '../styles/Train.module.css';

const Train = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const handleStartTraining = async () => {
    setIsTraining(true);
    setError('');
    
    try {
      // Start the progress animation
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 10;
        setProgress(currentProgress);
        
        if (currentProgress >= 100) {
          clearInterval(interval);
        }
      }, 300);
      
      // Make the API request
      await trainModel();
      
      // Ensure progress is completed
      setProgress(100);
      
      // Set complete status after a short delay
      setTimeout(() => {
        setIsComplete(true);
        setSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
      }, 500);
    } catch (err) {
      setError(err.message || 'Failed to train model');
      setIsTraining(false);
      setProgress(0);
    }
  };
  
  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Train Model</h2>
        
        <div className={styles.content}>
          {success && (
            <div className={styles.success} role="alert">
              <strong className={styles.alertTitle}>Success!</strong>
              <span> Model training completed successfully.</span>
            </div>
          )}
          
          {error && (
            <div className={styles.error} role="alert">
              <strong className={styles.alertTitle}>Error!</strong>
              <span> {error}</span>
            </div>
          )}
          
          <div className={styles.infoBox}>
            <h3 className={styles.infoTitle}>About Training</h3>
            <p className={styles.infoText}>
              Training the model will process all registered faces and collected gestures 
              to build a personalized recognition system. This may take a few minutes 
              depending on the amount of data.
            </p>
          </div>
          
          {isTraining && !isComplete && (
            <div className={styles.progressContainer}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Training in progress</span>
                <span className={styles.progressPercentage}>{progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressBarFill} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {!isComplete ? (
            <div className={styles.buttonWrapper}>
              <button
                type="button"
                className={styles.button}
                onClick={handleStartTraining}
                disabled={isTraining}
              >
                <span className="material-icons">model_training</span>
                {isTraining ? 'Training...' : 'Start Training'}
              </button>
            </div>
          ) : (
            <div className={styles.complete}>
              <div className={styles.completeIcon}>
                <span className="material-icons">check_circle</span>
              </div>
              <p className={styles.completeTitle}>Training Complete!</p>
              <p className={styles.completeText}>
                Your model has been successfully trained and is ready to use.
              </p>
              <Link href="/live-demo">
                <a className={styles.completeLink}>
                  Try it out in the Live Demo
                  <span className="material-icons">arrow_forward</span>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Train;
