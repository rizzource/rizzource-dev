import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase-types"; // adjust if your types live elsewhere

// Tell TS what env vars exist (inline instead of env.d.ts)
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Missing Supabase environment variables");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
