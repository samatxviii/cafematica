import { createClient } from '@supabase/supabase-js';
import config from '../../config/site.json';
let client;
export function getClient(){
 if(!config.authEnabled||!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl)||!config.supabasePublishableKey)return null;
 client ||= createClient(config.supabaseUrl,config.supabasePublishableKey,{auth:{flowType:'pkce',detectSessionInUrl:true,persistSession:true,autoRefreshToken:true}});
 return client;
}
export {config};
