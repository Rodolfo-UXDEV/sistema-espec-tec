import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sudnsprgtvooscpsjanq.supabase.co';
const supabaseAnonKey = 'sb_publishable_ufEo0v4d-RJAWY1EtjgNkg_VghJdZKb';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
