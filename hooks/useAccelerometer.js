import { useState, useEffect, useCallback } from 'react';

export default function useAccelerometer() {
  const [support, setSupport] = useState('checking');
  const [permission, setPermission] = useState('pending');
  const [acceleration, setAcceleration] = useState(null);
  const [sensitivity, setSensitivity] = useState(2);
  const [isSquatting, setIsSquatting] = useState(false);
  const [squatCount, setSquatCount] = useState(0);
  const [lastCountTime, setLastCountTime] = useState(0);

  const handleMotion = useCallback((event) => {
    setAcceleration(event.accelerationIncludingGravity);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('DeviceMotionEvent' in window) {
        setSupport('supported');
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
          setPermission('prompt');
        } else {
          setPermission('granted');
          window.addEventListener('devicemotion', handleMotion);
        }
      } else {
        setSupport('unsupported');
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
        window.removeEventListener('devicemotion', handleMotion);
      }
    };
  }, [handleMotion]);

  useEffect(() => {
    if (acceleration) {
      const { x, y, z } = acceleration;
      const totalAcceleration = Math.sqrt(x*x + y*y + z*z);
      const now = Date.now();

      if (totalAcceleration > 9.8 + sensitivity && !isSquatting && now - lastCountTime > 1000) {
        setIsSquatting(true);
      } else if (totalAcceleration < 9.8 - sensitivity && isSquatting) {
        setIsSquatting(false);
        setSquatCount(prev => prev + 1);
        setLastCountTime(now);
      }
    }
  }, [acceleration, sensitivity, isSquatting, lastCountTime]);

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        setPermission(permissionState);
        if (permissionState === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
        }
      } catch (error) {
        console.error(error);
        setPermission('denied');
      }
    }
  };

  const changeSensitivity = (newSensitivity) => {
    setSensitivity(newSensitivity);
  };

  return { 
    support, 
    permission, 
    acceleration, 
    requestPermission, 
    sensitivity, 
    changeSensitivity,
    squatCount,
    isSquatting
  };
}