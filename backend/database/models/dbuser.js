import mongoose from "mongoose";
import { ObjectID } from "mongodb";

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
  return this.toString();
};

const UserSchema = new Schema({
    email: {
        type: String,
        required: false
    },
    password: { // Hashed
        type: String,
        required: false
    },
    passwordR: { // Raw
        type: String,
        required: false
    },
    userServiceId: { // ID in Google, FB, empty in Local
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    fullName: {
        type: String,
        required: false
    },
    pictureUrl: {
        type: String,
        required: false
    },
    accessToken: {
        type: String,
        required: false
    },
    type: {// local, facebook, google
        type: String,
        required: false
    },
    class: {//freeUser, smallTeam, bigTeam 
        type: String,
        required: false
    },
    teamId: {
        type: String,
        required: false
    },
    teamCode: {
        type: String,
        required: false
    },
    roleInTeam: {
        type: String, // manager, member
        required: false
    },
    vehicleList: [],
    //     {
    //         id: {
    //             type: String,
    //             required: false
    //         },
    //         userId: {
    //             type: String,
    //             required: false
    //         },
    //         brand: {
    //             type: String,
    //             required: false
    //         },
    //         model: {
    //             type: String,
    //             required: false
    //         },
    //         licensePlate: {
    //             type: String,
    //             required: false
    //         },
    //         checkedDate: {
    //             type: Date,
    //             required: false
    //         },
    //         type: {
    //             type: String, // car|bike
    //             required: false
    //         },
    //         isDefault: {
    //             type: Boolean,
    //             required: false
    //         },
    //         remark: {
    //             type: String,
    //             required: false
    //         },
    //         fillGasList: [],
    //         authorizeCarList: [],
    //         expenseList: [],
    //         serviceList: []
    //     }
    // ],
    customServiceModules: [],
    customServiceModulesBike: [],
    settings: {},
    settingService: {}
});

UserSchema.set('toJSON', {
    virtuals: true
});
UserSchema.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}

export default mongoose.model("dbuser", UserSchema);
