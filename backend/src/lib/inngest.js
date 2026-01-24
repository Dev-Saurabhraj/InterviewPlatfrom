import {Inngest } from "inngest"
import {connectDB} from "./db.js"
import { User } from "../models/User.js"
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({id:'project-inngest'});
const syncUser = inngest.createFunction(
{
    id: "sysnc-user"
},
{ 
    event:"clerk/user.created",
},

async ({event})=>{
    await connectDB()

    //  geting the data from clerk
    const {id, email_addresses, first_name, last_name, image_url} = event.data

    const newUser = {
        clerkId:id,
        email:email_addresses[0]?.email_address,
        name: `${first_name || " "} ${last_name||" "}`,
        profileImage: image_url
    }

    // createing new user in mongo data base
    await User.create(newUser)

    // createing new user in stream app;
    await upsertStreamUser({
        id: newUser.clerkId.toString(),
        name: newUser.name,
        image: newUser.profileImage
    })
}

)

const deleteUser = inngest.createFunction(
    {id:'delete-user-from-db'},
    {event : "clerk/user.deleted"},
    async ({event}) =>{
        await connectDB();
        const {id} = event.data
        await User.deleteOne({clerkId: id});
        await deleteStreamUser(id.toString());
    }

)


export const functions = [syncUser, deleteUser]