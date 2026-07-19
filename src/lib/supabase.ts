import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cnxhngklpqlnkxghcfxr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNueGhuZ2tscHFsbmt4Z2hjZnhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5Mjg2MjIsImV4cCI6MjA5OTUwNDYyMn0.tPKiMDMNnjMm1Qt5viZsDBS3EmSuwRaT6aKmsdQ36rg';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error(
    '❌ MISSING SUPABASE ENVIRONMENT VARIABLES!\n' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.\n' +
    'Local: Add to .env file\n' +
    'Vercel: Add in Project Settings > Environment Variables'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

