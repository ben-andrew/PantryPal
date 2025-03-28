// supabase conneciton

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ggmvutgkilclpyifbxfx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnbXZ1dGdraWxjbHB5aWZieGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDg0NzMsImV4cCI6MjA1MzkyNDQ3M30.s3t9Ossr3aruv_fLKvxXyf5Rl_e3x-oEpGq1mA_Ij8k';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;