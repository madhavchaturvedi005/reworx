
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project's URL and anon key
const supabaseUrl = 'https://bxkgctdtctkndblilbfs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4a2djdGR0Y3RrbmRibGlsYmZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTAyNDgzMzcsImV4cCI6MjAyNTgyNDMzN30.S6F9RX17GNMl1VAnGr0E1RN2K8Uio-gCcvC_5SRju2w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check connection to Supabase
(async () => {
  try {
    // Test the connection with a simple query
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error (profiles table):', error.message);
    } else {
      console.log('Supabase connection successful');
    }
    
    // Check other tables
    const scoreTable = await supabase.from('scores').select('count').limit(1);
    if (scoreTable.error) {
      console.error('Supabase table error (scores table):', scoreTable.error.message);
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
})();
