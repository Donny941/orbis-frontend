/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Aggiungi qui altre variabili d'ambiente se necessario
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
