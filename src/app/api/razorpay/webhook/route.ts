import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "sandbox_webhook_secret";

    if (signature) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature && process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment captured / order paid events
    if (event === "order.paid" || event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      console.log("Razorpay Webhook: Order Paid ->", payment.id, payment.amount);
      // In production, update Supabase public.subscriptions status to 'active'
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
