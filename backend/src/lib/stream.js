import { ENV } from "./env";
import {StreamChat} from "stream-chat";
const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_SECRET_KEY

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_SECRET_KEY is not found in env.");
}


export const chatClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async(userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted successfully:", userData);
    } catch (error) {
        console.error("Error upserting Stream user: ", error);
    }
};

export const deleteStreamUser = async(userId) => {
    try {
        await chatClient.deleteUser({userId})
        console.log("Stream user deleted successfully:", userId);
        
    } catch (error) {
        console.error("Error deleting Stream user: ", error);
    }
};
