import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Squat.module.css';
import useDeviceOrientation from '../hooks/useDeviceOrientation';

export default function Squat() {
    const [squatCount, setSquatCount] = useState(0);
    const [isSquatting, setIsSquatting] = useState(false);
    const { support, permission, orientation, requestPermission } = useDeviceOrientation();
  
    useEffect(() => {
      if (orientation) {
        const beta = orientation.beta;
        if (beta > 45 && !isSquatting) {
          setIsSquatting(true);
        } else if (beta < 10 && isSquatting) {
          setIsSquatting(false);
          setSquatCount(prevCount => prevCount + 1);
        }
      }
    }, [orientation, isSquatting]);
  
    const renderContent = () => {
      if (support === 'checking') {
        return <p>Checking device orientation support...</p>;
      }
  
      if (support === 'unsupported') {
        return (
          <div>
            <p>Sorry, your device or browser does not support orientation detection.</p>
            <p>You can still use manual counting:</p>
            <button onClick={() => setSquatCount(count => count + 1)} className={styles.button}>
              Count Squat
            </button>
            <div className={styles.counter}>Squats: {squatCount}</div>
          </div>
        );
      }
  
      if (permission === 'prompt') {
        return (
          <button onClick={requestPermission} className={styles.button}>
            Grant Permission
          </button>
        );
      }
  
      if (permission === 'granted') {
        return (
          <>
            <h1 className={styles.title}>Squat Counter</h1>
            <div className={styles.counter}>
              Squats: {squatCount}
            </div>
            {orientation && (
              <div className={styles.beta}>
                Beta: {orientation.beta?.toFixed(2)}°
              </div>
            )}
            <div className={styles.status}>
              Status: {isSquatting ? 'Squatting' : 'Standing'}
            </div>
          </>
        );
      }
  
      if (permission === 'denied') {
        return <p>Permission to access device orientation was denied.</p>;
      }
    };
  
    return (
      <div className={styles.container}>
        <Head>
          <title>Squat Counter</title>
          <meta name="description" content="Squat counter using device orientation" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <main className={styles.main}>
          {renderContent()}
        </main>
      </div>
    );
  }