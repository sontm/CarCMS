import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const TeamSchema = new Schema({
    name: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    }
});

TeamSchema.set('toJSON', {
    virtuals: true
});
TeamSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    //delete ret.userId;
}

export default mongoose.model("dbteam", TeamSchema);
