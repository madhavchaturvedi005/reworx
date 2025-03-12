
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project's URL and anon key
const supabaseUrl = 'https://bxkgctdtctkndblilbfs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4a2djdGR0Y3RrbmRibGlsYmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNDgzMzcsImV4cCI6MjAyNTgyNDMzN30.S6F9RX17GNMl1VAnGr0E1RN2K8Uio-gCcvC_5SRju2w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
