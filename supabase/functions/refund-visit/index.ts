// Handles cancellations per your stated policy (free >24h before, 50% fee
// inside 24h, full charge for no-shows). This function does the Stripe side
// only — YOU decide refund_percent based on timing/reason before calling it
// (e.g. compute it in the frontend or a small helper from booking.scheduled_date
// vs now()).
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'
import { corsHeaders } from '../_shared/cors.ts'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { booking_id, refund_percent = 100 } = await req.json()
    if (!booking_id) throw new Error('booking_id is required')
    if (refund_percent < 0 || refund_percent > 100) throw new Error('refund_percent must be 0-100')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    )
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) throw new Error('Not authenticated')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('id, client_id, status')
      .eq('id', booking_id)
      .single()
    if (!booking) throw new Error('Booking not found')
    // Extend this check if admins should also be able to trigger refunds.
    if (booking.client_id !== user.id) throw new Error('This booking does not belong to you')
    if (booking.status === 'completed') throw new Error('Cannot refund a completed visit')
    if (booking.status === 'cancelled') throw new Error('This booking is already cancelled')

    const { data: txn } = await supabaseAdmin
      .from('transactions')
      .select('id, stripe_charge_id, amount, status')
      .eq('booking_id', booking_id)
      .eq('type', 'payment')
      .single()
    if (!txn || !txn.stripe_charge_id) throw new Error('No captured payment found for this booking')
    if (txn.status !== 'completed') throw new Error('Payment was never successfully captured — nothing to refund')

    const refundAmountCents = Math.round(Number(txn.amount) * 100 * (refund_percent / 100))

    const refund = refundAmountCents > 0
      ? await stripe.refunds.create({ charge: txn.stripe_charge_id, amount: refundAmountCents })
      : null

    await supabaseAdmin.from('transactions').insert({
      booking_id,
      client_id: booking.client_id,
      amount: refundAmountCents / 100,
      currency: 'LKR',
      method: 'card',
      type: 'refund',
      status: refund ? (refund.status === 'succeeded' ? 'completed' : 'pending') : 'completed',
    })

    await supabaseAdmin.from('bookings').update({ status: 'cancelled' }).eq('id', booking_id)

    return new Response(JSON.stringify({ refund, refund_percent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
