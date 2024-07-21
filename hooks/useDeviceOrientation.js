import { useState, useEffect } from 'react';

export default function useDeviceOrientation() {
  const [support, setSupport] = useState('checking');
  const [permission, setPermission] = useState('pending');
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('DeviceOrientationEvent' in window) {
        setSupport('supported');
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
          setPermission('prompt');
        } else {
          setPermission('granted');
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } else {
        setSupport('unsupported');
      }
    }

    return () => {
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  const requestPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        setPermission(permissionState);
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (error) {
        console.error(error);
        setPermission('denied');
      }
    }
  };

  const handleOrientation = (event) => {
    setOrientation(event);
  };

  return { support, permission, orientation, requestPermission };
}