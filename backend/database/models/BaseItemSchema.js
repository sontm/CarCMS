import mongoose from "mongoose";
import { ObjectID } from "mongodb";
var util = require('util');  

const Schema = mongoose.Schema;

ObjectID.prototype.valueOf = function() {
    return this.toString();
};
function BaseItemSchema() {
    Schema.apply(this, arguments);
  
    this.add({
        userId: {
            type: String,
            required: false
        },
        vehicleId: {
            type: String,
            required: false
        },
        fillDate: {
            type: Date,
            required: false
        },
        amount: {
            type: Number,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        currentKm: {
            type: Number,
            required: false
        },
        type: {
            type: String,
            required: false
        },
        subType: {
            type: String,
            required: false
        },
        remark: {
            type: String,
            required: false
        }
    });
}
  
util.inherits(BaseItemSchema, Schema);

var dbbase = new BaseItemSchema();
//var dbauthcheckschema = new BaseItemSchema();

dbbase.set('toJSON', {
    virtuals: true
});
dbbase.options.toJSON.transform = function (doc, ret, options) {
    // remove the _id of every document before returning the result
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}

var dbgas = mongoose.model('dbgas', dbbase);
var dboil = mongoose.model('dboil', dbbase);
var dbauth = mongoose.model('dbauth', dbbase);

export {dbgas, dboil, dbauth};
