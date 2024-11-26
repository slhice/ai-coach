/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_ENCRYPTION_KEY: string
  readonly VITE_SPECIALIZATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}