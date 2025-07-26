// utils/paymentService.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Initialize Stripe Payment - creates a Checkout Session
 */
export const initializePayment = async (paymentData) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: paymentData.email,
      line_items: [
        {
          price_data: {
            currency: 'usd', // or your desired currency
            product_data: {
              name: 'Appointment Booking',
              description: `Service ID: ${paymentData.serviceId}`,
            },
            unit_amount: paymentData.amount, // amount in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointment_id: paymentData.reference.split('_')[1],
        service_id: paymentData.serviceId,
        reference: paymentData.reference,
      },
      success_url: `${paymentData.callback_url}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${paymentData.callback_url}?status=cancelled`,
    });

    return {
      authorization_url: session.url,
      reference: session.id,
    };
  } catch (error) {
    throw new Error('Stripe payment initialization failed: ' + error.message);
  }
};

/**
 * Verify Stripe Payment - retrieve Checkout Session
 */
export const verifyPayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

    return {
      status: paymentIntent.status === 'succeeded' ? 'success' : 'failed',
      reference: session.id,
      amount: paymentIntent.amount,
      transaction_date: new Date(paymentIntent.created * 1000).toISOString(),
      customer: {
        email: session.customer_email,
      },
    };
  } catch (error) {
    throw new Error('Stripe payment verification failed: ' + error.message);
  }
};

/**
 * Process Refund with Stripe
 */
export const processRefund = async (paymentIntentId, amount, reason = 'Appointment cancelled') => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // in cents
      reason: 'requested_by_customer',
      metadata: { reason },
    });

    return refund;
  } catch (error) {
    throw new Error('Stripe refund failed: ' + error.message);
  }
};
