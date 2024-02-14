export declare global {
  interface Window {
    signIn: ({ clientId: string, credential: string }) => void;
  }
}
