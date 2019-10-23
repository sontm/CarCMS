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
    ctrl.create(req, res, "gas")
  },
  getGasAll(req, res) {
    console.log("Gas Get All")
    ctrl.getAll(req, res, "gas")
  },
  getGasById(req, res) {
    console.log("Gas Get By ID:" + req.params.id)
    ctrl.getById(req, res, "gas")
  },
  getGasAllOfUser(req, res) {
    console.log("Gas Get All Of User")
    ctrl.getAllOfUser(req, res, "gas")
  },


  createOil(req, res) {
    console.log("Oil Create")
    ctrl.create(req, res, "oil")
  },
  getOilAll(req, res) {
    console.log("Oil Get All")
    ctrl.getAll(req, res, "oil")
  },
  getOilById(req, res) {
    console.log("Oil Get By ID:" + req.params.id)
    ctrl.getById(req, res, "oil")
  },
  getOilAllOfUser(req, res) {
    console.log("Oil Get All OfUser")
    ctrl.getAllOfUser(req, res, "oil")
  },



  createAuth(req, res) {
    console.log("AuthCheck Create")
    ctrl.create(req, res, "auth")
  },
  getAuthAll(req, res) {
    console.log("AuthCheck Get All")
    ctrl.getAll(req, res, "auth")
  },
  getAuthById(req, res) {
    console.log("AuthCheck Get By ID:" + req.params.id)
    ctrl.getById(req, res, "auth")
  },
  getAuthAllOfUser(req, res) {
    console.log("AuthCheck Get All OfUser")
    ctrl.getAllOfUser(req, res, "auth")
  },




  createExpense(req, res) {
    console.log("Expense Create")
    ctrl.create(req, res, "expense")
  },
  getExpenseAll(req, res) {
    console.log("Expense Get All")
    ctrl.getAll(req, res, "expense")
  },
  getExpenseById(req, res) {
    console.log("Expense Get By ID:" + req.params.id)
    ctrl.getById(req, res, "expense")
  },
  getExpenseAllOfUser(req, res) {
    console.log("Expense Get All")
    ctrl.getAllOfUser(req, res, "expense")
  },




  createService(req, res) {
    console.log("Service Create")
    ctrl.create(req, res, "service")
  },
  getServiceAll(req, res) {
    console.log("Service Get All")
    ctrl.getAll(req, res, "service")
  },
  getServiceById(req, res) {
    console.log("Service Get By ID:" + req.params.id)
    ctrl.getById(req, res, "service")
  },
  getServiceAllOfUser(req, res) {
    console.log("Service Get All")
    ctrl.getAllOfUser(req, res, "service")
  },
};
