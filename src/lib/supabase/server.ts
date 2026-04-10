export interface SupabaseServerConfig {
  url: string;
  anonKey: string;
}

export function getSupabaseServerConfig(): SupabaseServerConfig {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}
