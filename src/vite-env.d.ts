/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /**
   * Solo para desarrollo local: `vite dev` omite el login real de Google
   * automáticamente (no hace falta configurar nada). Si quieres probar el
   * login real de Google en tu máquina, pon esto en 'false' en tu
   * .env.local. Nunca tiene efecto en un build de producción.
   */
  readonly VITE_SKIP_AUTH?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
