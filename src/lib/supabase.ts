
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the correct project URL and anon key
const supabaseUrl = 'https://indwosuuyjfhwvovmpdc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluZHdvc3V1eWpmaHd2b3ZtcGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODAwMjgsImV4cCI6MjA1NzM1NjAyOH0.s6CDFyA-7KZLWDqgj4ePXwxCUaJYldFM6AcoxZ8rYL4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check connection to Supabase
(async () => {
  try {
    // Test the connection with a simple query
    const { data, error } = await supabase.from('login').select('count').limit(1);
    if (error) {
      console.error('Supabase connection error (login table):', error.message);
    } else {
      console.log('Supabase connection successful');
    }
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
  }
})();
