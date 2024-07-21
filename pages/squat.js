import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import useAccelerometer from "../hooks/useAccelerometer";

export default function SquatAccelerometer() {
  const [squatCount, setSquatCount] = useState(0);
  const [isSquatting, setIsSquatting] = useState(false);
  const { support, permission, acceleration, requestPermission } =
    useAccelerometer();

  useEffect(() => {
    if (acceleration) {
      const { z } = acceleration;
      // 假设z轴加速度小于-2表示开始下蹲，大于2表示站起
      // 注意：这里的阈值可能需要根据实际情况调整
      if (z < -2 && !isSquatting) {
        setIsSquatting(true);
      } else if (z > 2 && isSquatting) {
        setIsSquatting(false);
        setSquatCount((prevCount) => prevCount + 1);
      }
    }
  }, [acceleration, isSquatting]);

  const renderContent = () => {
    if (support === "checking") {
      return <p>Checking accelerometer support...</p>;
    }

    if (support === "unsupported") {
      return (
        <div>
          <p>Sorry, your device or browser does not support accelerometer.</p>
          <p>You can still use manual counting:</p>
          <button
            onClick={() => setSquatCount((count) => count + 1)}
            className={styles.button}
          >
            Count Squat
          </button>
          <div className={styles.counter}>Squats: {squatCount}</div>
        </div>
      );
    }

    if (permission === "prompt") {
      return (
        <button onClick={requestPermission} className={styles.button}>
          Grant Permission
        </button>
      );
    }

    if (permission === "granted") {
      return (
        <>
          <h1 className={styles.title}>Squat Counter</h1>
          <div className={styles.counter}>Squats: {squatCount}</div>
          {acceleration && (
            <div className={styles.acceleration}>
              Y acceleration: {acceleration.y?.toFixed(2)} m/s²
            </div>
          )}
          <div className={styles.status}>
            Status: {isSquatting ? "Squatting" : "Standing"}
          </div>
        </>
      );
    }

    if (permission === "denied") {
      return <p>Permission to access accelerometer was denied.</p>;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Squat Counter</title>
        <meta name="description" content="Squat counter using accelerometer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>{renderContent()}</main>
    </div>
  );
}
