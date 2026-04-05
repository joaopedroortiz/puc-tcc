import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Teste de diagnóstico:
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERRO: O Vite não encontrou o arquivo .env ou as variáveis VITE_");
  console.log("Caminho tentado:", window.location.origin);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)