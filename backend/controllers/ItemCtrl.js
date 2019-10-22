import {dbgas, dboil, dbauth, dbexpense, dbservice} from "../database/models/BaseItemSchema";

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
    ctrl.create(req, res, dbgas, "gas")
  },
  getGasAll(req, res) {
    console.log("Gas Get All")
    ctrl.getAll(req, res, dbgas, "gas")
  },
  getGasById(req, res) {
    console.log("Gas Get By ID:" + req.params.id)
    ctrl.getById(req, res, dbgas, "gas")
  },
  getGasAllOfUser(req, res) {
    console.log("Gas Get All Of User")
    ctrl.getAllOfUser(req, res, dbgas, "gas")
  },


  createOil(req, res) {
    console.log("Oil Create")
    ctrl.create(req, res, dboil, "oil")
  },
  getOilAll(req, res) {
    console.log("Oil Get All")
    ctrl.getAll(req, res, dboil, "oil")
  },
  getOilById(req, res) {
    console.log("Oil Get By ID:" + req.params.id)
    ctrl.getById(req, res, dboil, "oil")
  },
  getOilAllOfUser(req, res) {
    console.log("Oil Get All OfUser")
    ctrl.getAllOfUser(req, res, dboil, "oil")
  },



  createAuth(req, res) {
    console.log("AuthCheck Create")
    ctrl.create(req, res, dbauth, "auth")
  },
  getAuthAll(req, res) {
    console.log("AuthCheck Get All")
    ctrl.getAll(req, res, dbauth, "auth")
  },
  getAuthById(req, res) {
    console.log("AuthCheck Get By ID:" + req.params.id)
    ctrl.getById(req, res, dbauth, "auth")
  },
  getAuthAllOfUser(req, res) {
    console.log("AuthCheck Get All OfUser")
    ctrl.getAllOfUser(req, res, dbauth, "auth")
  },




  createExpense(req, res) {
    console.log("Expense Create")
    ctrl.create(req, res, dbexpense, "expense")
  },
  getExpenseAll(req, res) {
    console.log("Expense Get All")
    ctrl.getAll(req, res, dbexpense, "expense")
  },
  getExpenseById(req, res) {
    console.log("Expense Get By ID:" + req.params.id)
    ctrl.getById(req, res, dbexpense, "expense")
  },
  getExpenseAllOfUser(req, res) {
    console.log("Expense Get All")
    ctrl.getAllOfUser(req, res, dbexpense, "expense")
  },




  createService(req, res) {
    console.log("Service Create")
    ctrl.create(req, res, dbservice, "service")
  },
  getServiceAll(req, res) {
    console.log("Service Get All")
    ctrl.getAll(req, res, dbservice, "service")
  },
  getServiceById(req, res) {
    console.log("Service Get By ID:" + req.params.id)
    ctrl.getById(req, res, dbservice, "service")
  },
  getServiceAllOfUser(req, res) {
    console.log("Service Get All")
    ctrl.getAllOfUser(req, res, dbservice, "service")
  },
};
