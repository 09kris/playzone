import { Timestamp } from "mongodb";
import mongoose,{Schema} from "mongoose";

const tweetSchema = new Schema({
    contene:{
        type:String,
        required:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{Timestamp:true})


export const Tweet = mongoose.model("Tweet", tweetSchema);