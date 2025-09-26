import Stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhook = async (req, res) => {
  console.log("✅ Webhook triggered!");
  console.log("Headers:", req.headers);
  console.log("Body:", req.body.toString());
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  try{
    console.log("👉 Stripe Event:", event.type);
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        const sessionList = await stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
        })
        const session = sessionList.data[0];
        const {bookingId} = session.metadata;
        await Booking.findByIdAndUpdate(bookingId, {isPaid: true, paymentLink: ""}); 
        //send Confirmation Email
        await inngest.send("app/show.booked", {bookingId});
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({received: true});
  } catch(error){
    console.log(error);
    res.json({success: false, message: error.message});
  }
};
