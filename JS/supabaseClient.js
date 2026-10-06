import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://tfddypdwcbhunmpbrjke.supabase.co";
const supabasePublishableKey = "sb_publishable_Lv3JrpwVYusrQ8HzgJVirw_Me7Quc5Y";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

