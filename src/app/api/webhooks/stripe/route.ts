import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Stripe webhook handler for subscription events
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const plan = session.metadata?.plan;
        console.log(`New subscription: ${plan} for session ${session.id}`);
        // TODO: Store subscription in database
        // For now, we use localStorage + Stripe customer portal
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log(`Subscription updated: ${subscription.id}`);
        // TODO: Update user's plan in database
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log(`Subscription cancelled: ${subscription.id}`);
        // TODO: Downgrade user to free plan
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }
}
