import { createBrowserClient } from '@supabase/ssr'

export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
<<<<<<< HEAD
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        detectSessionInUrl: false,
      },
    },
  );
}
=======
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}
>>>>>>> 3cb3134 (modulo empleado)
