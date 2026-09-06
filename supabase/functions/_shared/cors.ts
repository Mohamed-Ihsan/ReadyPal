// Adjust Access-Control-Allow-Origin to your actual frontend domain(s)
// before going to production — '*' is fine for local dev only.
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
