import {dbgas, dboil, dbauth} from "../database/models/BaseItemSchema";

import ctrl from './BaseItemCtrl'

// try {
//   var person = new PersonModel(request.body);
//   var result = await person.save();
//   response.send(result);
// } catch (error) {
//   response.status(500).send(error);
// }
module.exports = {
  createGas(req, res) {
    console.log("Gas Create")
    ctrl.dbModel = dbgas
    ctrl.type = "gas"
    ctrl.create(req, res)
  },
  getGasAll(req, res) {
    console.log("Gas Get All")
    ctrl.dbModel = dbgas
    ctrl.type = "gas"
    ctrl.getAll(req, res)
  },
  getGasById(req, res) {
    console.log("Gas Get By ID:" + req.params.id)
    ctrl.dbModel = dbgas
    ctrl.type = "gas"
    ctrl.getById(req, res)
  },


  createOil(req, res) {
    console.log("Oil Create")
    ctrl.dbModel = dboil
    ctrl.type = "oil"
    ctrl.create(req, res)
  },
  getOilAll(req, res) {
    console.log("Oil Get All")
    ctrl.dbModel = dboil
    ctrl.type = "oil"
    ctrl.getAll(req, res)
  },
  getOilById(req, res) {
    console.log("Oil Get By ID:" + req.params.id)
    ctrl.dbModel = dboil
    ctrl.type = "oil"
    ctrl.getById(req, res)
  },



  createAuth(req, res) {
    console.log("AuthCheck Create")
    ctrl.dbModel = dbauth
    ctrl.type = "auth"
    ctrl.create(req, res)
  },
  getAuthAll(req, res) {
    console.log("AuthCheck Get All")
    ctrl.dbModel = dbauth
    ctrl.type = "auth"
    ctrl.getAll(req, res)
  },
  getAuthById(req, res) {
    console.log("AuthCheck Get By ID:" + req.params.id)
    ctrl.dbModel = dbauth
    ctrl.type = "auth"
    ctrl.getById(req, res)
  },
};
