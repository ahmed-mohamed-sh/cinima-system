import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

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
    const tenMinutesAgo = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil('wait-for-10-minutes',tenMinutesAgo);

    await step.run('check-payment-status',
      async ({ event }) => {
        const { bookingId } = event.data;
        await Booking.findByIdAndDelete(bookingId);

        // if payment is not done then release the seats
        if(!bookingId.isPaid){
          const { showId, bookedSeats } = await Booking.findById(bookingId);
          const show = await Show.findById(showId);
          bookedSeats.forEach((seat) => {
            show.occupiedSeats[seat] = null;
          });
          show.markModified('occupiedSeats');
          await show.save();
          await Booking.findByIdAndDelete(bookingId);
          await Show.findByIdAndUpdate(showId, show);
        }
      }
    )
  }
)

export const functions = [
  syncUserToCreation,
  syncUserToDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking
];
