import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const SUPABASE_URL = 'https://dsdlvlgvazyizcttiurr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzZGx2bGd2YXp5aXpjdHRpdXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTA1NzEsImV4cCI6MjA3OTc2NjU3MX0.TQ9Xm93A8y4ainKK5ksyDJTOFpgW6rtAW1AqkpYM-hw';

export const supabaseExternal = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
