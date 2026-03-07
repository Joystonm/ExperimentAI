import { supabase } from './lib/supabaseClient';

// Test Supabase connection
async function testSupabaseConnection() {
  console.log('=== Testing Supabase Connection ===');
  
  // Check environment variables
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
  
  try {
    // Test connection by checking session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Connection Error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    console.log('Current session:', data.session ? 'Logged in' : 'Not logged in');
    return true;
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    return false;
  }
}

// Run test
testSupabaseConnection();

export default testSupabaseConnection;
