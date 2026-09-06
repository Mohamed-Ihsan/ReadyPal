// Stripe calls this whenever something happens on a PaymentIntent/Charge.
// This is the ONLY place transactions.status should flip to 'completed' /
// 'failed' / 'refunded' — never set those optimistically from the frontend,
// since the frontend can't know a card actually cleared.
//
// Deploy with --no-verify-jwt (see README) since Stripe won't send a
// Supabase auth token — signature verification below is what authenticates
// the request instead.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import Stripe from 'npm:stripe@17'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
})

// Deno's crypto isn't Node's — Stripe's signature check needs the async
// SubtleCrypto-based provider here, or constructEvent silently fails.
const cryptoProvider = Stripe.createSubtleCryptoProvider()

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!,
      undefined,
      cryptoProvider,
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const chargeId = typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id

      await supabaseAdmin
        .from('transactions')
        .update({ status: 'completed', stripe_charge_id: chargeId })
        .eq('stripe_payment_intent_id', pi.id)

      // Booking moves from 'assigned' to 'confirmed' once payment clears.
      // Guarded by .eq('status','assigned') so this never clobbers a booking
      // that's already progressed further (in_progress/completed/cancelled).
      const bookingId = pi.metadata?.booking_id
      if (bookingId) {
        await supabaseAdmin
          .from('bookings')
          .update({ status: 'confirmed', confirmed: true })
          .eq('id', bookingId)
          .eq('status', 'assigned')
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'failed' })
        .eq('stripe_payment_intent_id', pi.id)
      break
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge
      await supabaseAdmin
        .from('transactions')
        .update({ status: 'refunded' })
        .eq('stripe_charge_id', charge.id)
      break
    }

    default:
      // Unhandled event types are fine to ignore — Stripe sends a lot of them.
      break
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
