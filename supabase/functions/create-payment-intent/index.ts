// Family pays for a booking. Charges the platform's Stripe balance directly
// (no transfer_data) — this is the "separate charges and transfers" model.
// The 10% platform commission is calculated and stored here for reference,
// but nothing is transferred to the agent yet: money only becomes claimable
// once visit_logs.status = 'completed' (see migration.sql's balance function).
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'
import { corsHeaders } from '../_shared/cors.ts'

const PLATFORM_FEE_RATE = 0.10

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { booking_id } = await req.json()
    if (!booking_id) throw new Error('booking_id is required')

    // Tied to the caller's own JWT — respects RLS, proves who's actually asking.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    )
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) throw new Error('Not authenticated')

    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('id, client_id, agent_id, payment_amount')
      .eq('id', booking_id)
      .single()
    if (bookingErr || !booking) throw new Error('Booking not found')
    if (booking.client_id !== user.id) throw new Error('This booking does not belong to you')
    if (!booking.payment_amount) throw new Error('Booking has no payment amount set yet')

    // Service-role client for writes that need to bypass RLS (updating another
    // table's row, e.g. stamping stripe_customer_id onto profiles).
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Reuse an existing PaymentIntent for this booking rather than creating a
    // duplicate charge if the family re-opens the checkout screen.
    const { data: existingTxn } = await supabaseAdmin
      .from('transactions')
      .select('id, status, stripe_payment_intent_id')
      .eq('booking_id', booking_id)
      .eq('type', 'payment')
      .maybeSingle()

    if (existingTxn?.stripe_payment_intent_id) {
      const existingPi = await stripe.paymentIntents.retrieve(existingTxn.stripe_payment_intent_id)
      if (['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing'].includes(existingPi.status)) {
        return new Response(JSON.stringify({ client_secret: existingPi.client_secret }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, full_name, email')
      .eq('id', user.id)
      .single()

    let stripeCustomerId = profile?.stripe_customer_id as string | null
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      stripeCustomerId = customer.id
      await supabaseAdmin.from('profiles').update({ stripe_customer_id: stripeCustomerId }).eq('id', user.id)
    }

    const amountCents = Math.round(Number(booking.payment_amount) * 100)
    const platformFeeAmount = Math.round(amountCents * PLATFORM_FEE_RATE) / 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'lkr',
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      metadata: {
        booking_id,
        client_id: booking.client_id,
        agent_id: booking.agent_id ?? '',
      },
    })

    const txnPayload = {
      booking_id,
      client_id: booking.client_id,
      agent_id: booking.agent_id,
      amount: booking.payment_amount,
      currency: 'LKR',
      method: 'card',
      type: 'payment',
      status: 'pending',
      stripe_payment_intent_id: paymentIntent.id,
      platform_fee_amount: platformFeeAmount,
    }

    if (existingTxn) {
      await supabaseAdmin.from('transactions').update(txnPayload).eq('id', existingTxn.id)
    } else {
      await supabaseAdmin.from('transactions').insert(txnPayload)
    }

    return new Response(JSON.stringify({ client_secret: paymentIntent.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})




