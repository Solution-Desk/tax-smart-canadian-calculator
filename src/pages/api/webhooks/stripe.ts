import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { env } from '../../../lib/env';

// Initialize Stripe with TypeScript types
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Enable body parsing for webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Type for the Stripe event data
type StripeEvent = Stripe.Event & {
  data: {
    object: any;
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to read the raw body from the request
async function buffer(readable: any) {
  const chunks: Buffer[] = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: StripeEvent;

  try {
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not set');
    }

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      webhookSecret
    ) as StripeEvent;
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).end('Internal Server Error');
  }
}

// Webhook handlers
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  // Get the subscription ID from the session
  const subscriptionId = session.subscription as string;
  const customerId = session.customer as string;
  const userId = session.client_reference_id;

  // Here you would typically:
  // 1. Get or create the user in your database
  // 2. Update their subscription status
  // 3. Store the Stripe customer ID and subscription ID
  
  console.log(`Checkout completed for customer ${customerId}, subscription ${subscriptionId}`);
  
  // In a real app, you would update your database here
  // await db.updateUserSubscription(userId, {
  //   customerId,
  //   subscriptionId,
  //   status: 'active',
  //   currentPeriodEnd: new Date(session.subscription.current_period_end * 1000),
  // });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  
  // Update the subscription in your database
  console.log(`Subscription ${subscriptionId} updated for customer ${customerId}`);
  
  // In a real app:
  // await db.updateSubscription(subscriptionId, {
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  //   cancelAtPeriodEnd: subscription.cancel_at_period_end,
  // });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  
  // Handle subscription cancellation in your database
  console.log(`Subscription ${subscriptionId} canceled for customer ${customerId}`);
  
  // In a real app:
  // await db.cancelSubscription(subscriptionId);
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;
  const amountPaid = invoice.amount_paid;
  
  console.log(`Payment of ${amountPaid} succeeded for ${customerId} (${subscriptionId})`);
  
  // In a real app, you would update your database to reflect the successful payment
  // await db.recordPayment(subscriptionId, {
  //   amount: amountPaid,
  //   invoiceId: invoice.id,
  //   paidAt: new Date(),
  // });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string;
  
  console.error(`Payment failed for ${customerId} (${subscriptionId})`);
  
  // In a real app, you would notify the user that their payment failed
  // and update your database accordingly
  // await db.updateSubscriptionStatus(subscriptionId, 'past_due');
  // await sendPaymentFailedEmail(customerId, invoice.hosted_invoice_url);
}
