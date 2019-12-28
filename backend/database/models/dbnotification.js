import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const NotificationSchema = new Schema({
    title: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    teamId: {
        type: String,
        required: false
    },
    userId: {
        type:String,
        required: false
    },
    forAll: {
        type:Boolean,
        required: false
    },
    url: {
        type:String,
        required: false
    },
    enable: {
        type:Boolean,
        required: false
    },
    issueDate: {
        type: Date,
        required: false
    },
});

NotificationSchema.set('toJSON', {
    virtuals: true
});
NotificationSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    //delete ret.userId;
}

export default mongoose.model("dbnotification", NotificationSchema);
