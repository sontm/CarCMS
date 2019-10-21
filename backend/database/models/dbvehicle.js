import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const VehicleSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    userId: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: false
    },
    licensePlate: {
        type: String,
        required: false
    },
    checkedDate: {
        type: Date,
        required: false
    },
    type: {
        type: String, // car|bike
        required: false
    },
    isDefault: {
        type: Boolean,
        required: false
    },
    remark: {
        type: String,
        required: false
    }
});

VehicleSchema.set('toJSON', {
    virtuals: true
});
VehicleSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    //ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}

export default mongoose.model("dbvehicle", VehicleSchema);
