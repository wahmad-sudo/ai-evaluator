import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_EVALUATOR_SUPABASE_URL ?? "https://qigupqtkxfiwssegvrsk.supabase.co";
const key = process.env.NEXT_PUBLIC_EVALUATOR_SUPABASE_ANON_KEY ?? "sb_publishable_KOxnEw8OnXYUjj1rjj4igw_tzc-3Vzl";

export const supabase = createClient(url, key);
