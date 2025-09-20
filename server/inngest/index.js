import { Inngest } from "inngest";
import User from "../models/User.js";

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

export const functions = [
  syncUserToCreation,
  syncUserToDeletion,
  syncUserUpdation,
];
