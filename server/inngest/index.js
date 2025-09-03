import { Inngest } from "inngest";
import User from "../models/User.js";


// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

//inngest function to save user to db
const syncUserToCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event}) => {
        const {id,first_name, last_name, email_address, image_url} = event.data.user;
        const userData = {
            _id: id,
            name: `${first_name} ${last_name}`,
            email: email_address,
            image: image_url
        }
        await User.create(userData);
        } 
    
)
// inggest function to delete user from db
const syncUserToDeletion = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event}) => {
        const {id} = event.data.user;
        const userData = {
            _id: id,
        }
        await User.findByIdAndDelete(userData);
        } 
    
)
// inggest function to update user in db
const syncUserUPdation = inngest.createFunction(
    {id: 'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async ({event}) => {
        const {id,first_name, last_name, email_address, image_url} = event.data;
        const userData = {
            _id: id,
            name: `${first_name} ${last_name}`,
            email: email_address,
            image: image_url
        }
        await User.findByIdAndUpdate(id,userData);
        } 
    
)

export const functions = [syncUserToCreation, syncUserToDeletion, syncUserUPdation];