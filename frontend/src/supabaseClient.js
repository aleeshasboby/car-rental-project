import { createClient } from '@supabase/supabase-js';

// Replace these strings with your actual keys from your Supabase Dashboard project settings
const SUPABASE_URL = "https://xtwlxmryxrhsesjhatvp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8I1JCXz-FnBtEb5vceVb7A_0RfU61n1";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);