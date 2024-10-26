import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dskpbfjsbdyxdolqscjc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRza3BiZmpzYmR5eGRvbHFzY2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk4NDUyNDcsImV4cCI6MjA0NTQyMTI0N30.rYxUoxh1KxajM-MP6kesE3N3KLKNII1t-gnEAOWWvE0';

export const supabase = createClient(supabaseUrl, supabaseKey);