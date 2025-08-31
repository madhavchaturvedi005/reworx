
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the correct project URL and anon key
const supabaseUrl = 'https://wemljbimllqhmdcpbkmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbWxqYmltbGxxaG1kY3Bia216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MzM0NjIsImV4cCI6MjA3MjIwOTQ2Mn0.9qT2wrfHseCAxTpHmEWVx3lVbe83TcUDIrY5s04rOT4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check connection to Supabase
(async () => {
  try {
    // Test the connection with a simple query to profiles table
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error:', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
})();
