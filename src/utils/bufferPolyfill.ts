import { Buffer } from 'buffer';

// Ensure Buffer is defined in browser and global environments for @react-pdf/layout image resolution
if (typeof window !== 'undefined' && !window.Buffer) {
  (window as any).Buffer = Buffer;
}
if (typeof globalThis !== 'undefined' && !globalThis.Buffer) {
  (globalThis as any).Buffer = Buffer;
}

export { Buffer };
