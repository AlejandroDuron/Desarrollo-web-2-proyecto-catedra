export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseClientConfig(): SupabaseClientConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}
