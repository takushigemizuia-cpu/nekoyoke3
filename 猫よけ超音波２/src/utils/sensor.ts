/**
 * Sensor Utility for Motion/Vibration Guard Mode
 */

type MotionCallback = (acceleration: number) => void;

let activeCallback: MotionCallback | null = null;
let lastX = 0;
let lastY = 0;
let lastZ = 0;
let isListening = false;

export async function requestMotionPermission(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // iOS Safari 13+ permission request
  if (
    typeof DeviceMotionEvent !== 'undefined' &&
    typeof (DeviceMotionEvent as any).requestPermission === 'function'
  ) {
    try {
      const response = await (DeviceMotionEvent as any).requestPermission();
      return response === 'granted';
    } catch {
      return false;
    }
  }
  return true;
}

export function startMotionDetection(callback: MotionCallback) {
  if (isListening) stopMotionDetection();

  activeCallback = callback;
  isListening = true;

  const handleMotion = (event: DeviceMotionEvent) => {
    if (!isListening || !activeCallback) return;

    const acc = event.accelerationIncludingGravity || event.acceleration;
    if (!acc) return;

    const x = acc.x || 0;
    const y = acc.y || 0;
    const z = acc.z || 0;

    const deltaX = Math.abs(x - lastX);
    const deltaY = Math.abs(y - lastY);
    const deltaZ = Math.abs(z - lastZ);

    lastX = x;
    lastY = y;
    lastZ = z;

    // Calculate overall motion delta magnitude
    const magnitude = deltaX + deltaY + deltaZ;
    activeCallback(magnitude);
  };

  window.addEventListener('devicemotion', handleMotion);
}

export function stopMotionDetection() {
  isListening = false;
  activeCallback = null;
}
