import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const CustomerVoiceSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false // new,run,done,skip
    },
    receiveDate: {
        type:Date,
        required: false
    },
});

CustomerVoiceSchema.set('toJSON', {
    virtuals: true
});
CustomerVoiceSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    //delete ret.userId;
}

export default mongoose.model("dbcustomervoice", CustomerVoiceSchema);
