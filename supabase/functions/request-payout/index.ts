// Agent-initiated withdrawal request — matches your payouts table's shape
// (requested_at / paid_at, bank_account_id). This does NOT move money by
// itself: it inserts a 'pending' row that your admin (FinanceDashboard/
// AgentEarnings) processes with a real bank transfer, then marks paid.
//
// Call with an empty body to withdraw the full available balance, or
// { "amount": 5000 } to withdraw a specific amount.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { amount } = await req.json().catch(() => ({ amount: undefined }))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    )
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) throw new Error('Not authenticated')

    // Runs as the caller — get_my_available_balance() uses auth.uid()
    // internally, so there's no way to query anyone else's balance.
    const { data: balance, error: balErr } = await supabase
      .rpc('get_my_available_balance')
      .single()
    if (balErr) throw balErr

    const requestedAmount = amount != null ? Number(amount) : Number(balance.available_balance)
    if (!(requestedAmount > 0)) throw new Error('No available balance to withdraw')
    if (requestedAmount > Number(balance.available_balance)) {
      throw new Error(`Requested amount exceeds available balance (${balance.available_balance})`)
    }

    const { data: bankAccount, error: bankErr } = await supabase
      .from('bank_accounts')
      .select('id, verification_status')
      .eq('agent_id', user.id)
      .eq('is_default', true)
      .maybeSingle()
    if (bankErr || !bankAccount) throw new Error('Add a default bank account before requesting a payout')
    if (bankAccount.verification_status !== 'verified') {
      throw new Error('Your default bank account is still pending verification')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data: payout, error: insertErr } = await supabaseAdmin
      .from('payouts')
      .insert({
        agent_id: user.id,
        amount: requestedAmount,
        status: 'pending',
        bank_account_id: bankAccount.id,
      })
      .select()
      .single()
    if (insertErr) throw insertErr

    return new Response(JSON.stringify({ payout }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
