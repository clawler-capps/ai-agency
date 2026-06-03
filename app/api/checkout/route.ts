import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in your environment." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/assessment?payment=success`,
    cancel_url: `${siteUrl}/pricing?payment=cancelled`,
    metadata: { product: "ai_business_assessment" },
    payment_intent_data: {
      description: "Sacramento AI Agency — AI Business Assessment",
    },
  });

  return NextResponse.json({ url: session.url });
}
