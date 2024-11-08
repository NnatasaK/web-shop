// global.d.ts
export {};

declare global {
  interface Window {
    inactivityTimer?: NodeJS.Timeout;
  }
}
