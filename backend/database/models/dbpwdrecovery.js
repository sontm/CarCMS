import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const PwdRecoverySchema = new Schema({
    token: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
    validUntil: {
        type: Date,
        required: false
    },
});

PwdRecoverySchema.set('toJSON', {
    virtuals: true
});
PwdRecoverySchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    //delete ret.userId;
}

export default mongoose.model("dbpwdrecovery", PwdRecoverySchema);
