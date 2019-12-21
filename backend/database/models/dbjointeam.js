import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const JoinTeamSchema = new Schema({
    userId: {
        type: String,
        required: false
    },
    teamCode: {
        type: String,
        required: false
    },
    teamName: {
        type: String,
        required: false
    },
    status: {
        type: String, // requested/approved/rejected/blocked/cancelByUser
        required: false
    },
    fullName: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    updatedOn: {
        type: Date,
        required: false
    },
});

JoinTeamSchema.set('toJSON', {
    virtuals: true
});
JoinTeamSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    //delete ret.userId;
}

export default mongoose.model("dbjointeam", JoinTeamSchema);
