import { useState, useEffect } from 'react';

export default function useAccelerometer() {
  const [support, setSupport] = useState('checking');
  const [permission, setPermission] = useState('pending');
  const [acceleration, setAcceleration] = useState(null);

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
  }, []);

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

  const handleMotion = (event) => {
    setAcceleration(event.accelerationIncludingGravity);
  };

  return { support, permission, acceleration, requestPermission };
}