import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// ========== Create User ==========
const syncUserToCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      image: image_url || "",
    };

    await User.create(userData);
  }
);

// ========== Delete User ==========
const syncUserToDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    await User.findByIdAndDelete(id);
  }
);

// ========== Update User ==========
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      email: email_addresses?.[0]?.email_address || "",
      image: image_url || "",
    };

    await User.findByIdAndUpdate(id, userData, { new: true });
  }
);

//inngest funtion to cancel booking after 10 min if payment is not done

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-and-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    try {
      console.log("🔔 Inngest function start:", { eventType: event?.type, data: event?.data });

      if (!event || !event.data) {
        console.log("⚠️ No event data, aborting.");
        return;
      }

      const { bookingId } = event.data;
      if (!bookingId) {
        console.log("⚠️ bookingId missing in event.data, aborting.");
        return;
      }

      // انتظر 10 دقائق (sleepUntil يأخذ تاريخ مستقبلي)
      const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
      console.log(`⏳ Sleeping until ${tenMinutesLater.toISOString()} for booking ${bookingId}`);
      await step.sleepUntil("wait-for-10-minutes", tenMinutesLater);

      // هنا استخدم event من الscope الخارجي — لا تستقبل event كـ arg داخل callback
      await step.run("check-payment-status", async () => {
        console.log("🔎 Running check-payment-status for booking:", bookingId);

        const booking = await Booking.findById(bookingId).populate("show");
        if (!booking) {
          console.log(`ℹ️ Booking ${bookingId} not found or already deleted.`);
          return;
        }

        // لو مدفوع خلاص
        if (booking.isPaid) {
          console.log(`✅ Booking ${bookingId} already paid. No action.`);
          return;
        }

        // إطلاق المقاعد في العرض
        const show = await Show.findById(booking.show._id);
        if (show && Array.isArray(booking.bookedSeats) && booking.bookedSeats.length) {
          booking.bookedSeats.forEach((seat) => {
            show.occupiedSeats[seat] = null;
          });
          show.markModified("occupiedSeats");
          await show.save();
          console.log(`🔓 Released seats for booking ${bookingId}:`, booking.bookedSeats);
        } else {
          console.log(`ℹ️ No seats to release for booking ${bookingId}`);
        }

        // احذف الحجز
        await Booking.findByIdAndDelete(bookingId);
        console.log(`🗑️ Booking ${bookingId} deleted.`);
      });

      console.log("✔️ releaseSeatsAndDeleteBooking finished for", bookingId);
    } catch (err) {
      console.error("🔥 Error in releaseSeatsAndDeleteBooking:", err);
      throw err; // لو عايز ال-run يظهر كـ failed في inngest
    }
  }
);


// inngest funtion to send email to user when booking is created

const sentBookingConfirmationEmail = inngest.createFunction(
  { id: "sent-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    console.log("🔥 Inngest function triggered", event);

    const { bookingId } = event.data;

      const booking = await Booking.findById(bookingId)
        .populate({
          path: "show",
          populate: { path: "movie", model: "Movie" },
        })
        .populate("user");

      console.log("✅ Booking found:", booking?._id);

      if (!booking) throw new Error("Booking not found");

      await sendEmail({
        to: booking.user.email,
        subject: `Booking Confirmation: "${booking.show.movie.title}" booked successfully`,
        body: `<div style = "font-family: Arial, sans-serif; line-height:1.5;"> 
        <h2>Hi ${booking.user.name},</h2>
        <p>Thanks for your booking of "${booking.show.movie.title}".</p>
        <p>Booking details:</p>
        <ul>
          <li>Show: ${booking.show.movie.title}</li>
          <li>Date: ${booking.show.date}</li>
          <li>Time: ${booking.show.time}</li>
          <li>Seats: ${booking.bookedSeats.join(", ")}</li>
        </ul>
        <p>Best regards,<br>QuickShow Team</p>
      </div>`,
      });
    });
export const functions = [
  syncUserToCreation,
  syncUserToDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sentBookingConfirmationEmail
];
