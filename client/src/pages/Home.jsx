import { Link } from 'wouter';
import styles from '../styles/Home.module.css';

const Home = () => {
  return (
    <section className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span>Gesture Recognition</span>
          <span className={styles.highlight}>Intelligent Interface</span>
        </h1>
        <p className={styles.subtitle}>
          Train a personalized system to recognize your face and respond to your hand gestures. Control your computer naturally.
        </p>
        <div className={styles.buttons}>
          <Link href="/register-face">
            <a className={styles.primaryButton}>
              Get Started
            </a>
          </Link>
          <Link href="/live-demo">
            <a className={styles.secondaryButton}>
              Live Demo
            </a>
          </Link>
        </div>
      </div>

      <div className={styles.steps}>
        <h2 className={styles.stepsTitle}>How It Works</h2>
        <div className={styles.stepsGrid}>
          {/* Step 1 */}
          <div className={styles.step}>
            <div className={styles.stepIcon}>
              <span className="material-icons">face</span>
            </div>
            <h3 className={styles.stepTitle}>1. Register Your Face</h3>
            <p className={styles.stepDescription}>
              Upload a photo of your face to allow the system to recognize you.
            </p>
            <Link href="/register-face">
              <a className={styles.stepLink}>Register Now →</a>
            </Link>
          </div>

          {/* Step 2 */}
          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.stepIconSecondary}`}>
              <span className="material-icons">front_hand</span>
            </div>
            <h3 className={styles.stepTitle}>2. Collect Gestures</h3>
            <p className={styles.stepDescription}>
              Upload images of your hand gestures and assign keyboard actions to them.
            </p>
            <Link href="/collect-gesture">
              <a className={styles.stepLink}>Collect Gestures →</a>
            </Link>
          </div>

          {/* Step 3 */}
          <div className={styles.step}>
            <div className={`${styles.stepIcon} ${styles.stepIconAccent}`}>
              <span className="material-icons">model_training</span>
            </div>
            <h3 className={styles.stepTitle}>3. Train the Model</h3>
            <p className={styles.stepDescription}>
              Train the AI model with your collected data to recognize your gestures.
            </p>
            <Link href="/train-model">
              <a className={styles.stepLink}>Train Model →</a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
