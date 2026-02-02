import { createClient } from '@supabase/supabase-js'


const projectUrl = "https://inyljflrsphxunzoluuu.supabase.co"
const publishableKey = "sb_publishable_pzRDy4Eh1UUM6muG64O31w_nQKx2nIB"
export const supabase = createClient(projectUrl, publishableKey)