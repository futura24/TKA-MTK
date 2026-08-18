import { createClient } from '@supabase/supabase-js'

/**
 * Supabase configuration
 *
 * Vite hanya mengekspos environment variable
 * yang diawali dengan VITE_
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Validasi URL
if (!supabaseUrl) {
  throw new Error(
    'VITE_SUPABASE_URL belum dikonfigurasi. Periksa file .env'
  )
}

// Validasi Publishable Key
if (!supabasePublishableKey) {
  throw new Error(
    'VITE_SUPABASE_PUBLISHABLE_KEY belum dikonfigurasi. Periksa file .env'
  )
}

// Debug
console.log('SUPABASE URL:', supabaseUrl)
console.log(
  'SUPABASE KEY:',
  supabasePublishableKey ? 'TERBACA' : 'TIDAK TERBACA'
)

// Buat Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)
