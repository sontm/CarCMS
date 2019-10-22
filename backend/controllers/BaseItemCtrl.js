import {dbgas, dboil, dbauth, dbexpense, dbservice} from "../database/models/BaseItemSchema";

// User.find().or([{ name: param }, { nickname: param }])
//     .then(users => { /*logic here*/ })
//     .catch(error => { /*error logic here*/ })
module.exports = {
  async create(req, res, dbModel, type) {
    console.log(" ->[BaseCtrl] Create of User:" + req.user.id)
    //console.log(req.body)

    // If this is Array, process each item
    if (req.body.constructor == Array) {
      for (let loop = 0; loop < req.body.length; loop++) {
        let element = req.body[loop];

        element.userId = req.user.id;

        await new Promise((resolve, reject) => {
          dbModel.findOneAndUpdate({ id: element.id }, element, 
              {upsert:true, useFindAndModify: false}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
      }
      res.status(200).send({msg: "Sync To Server OK for " + type})
    } else {
      let item = await new dbModel({
        ...req.body,
        userId: req.user.id
      });
      const result = await new Promise((resolve, reject) => {
        item.save((err, res) => {
            err ? reject(err) : resolve(res);
        });
      });
      res.status(200).send({msg: "Add Item OK for " + type})
    }
  },
  getAll(req, res, dbModel, type) {
    console.log(" ->[BaseCtrl] Get All")
    dbModel.find({}, function(err, result) {
      if (err) {
          console.log("    [BaseCtrl] Get All Error")
          console.log(err);
          res.status(500).send(err)
      } else {
          console.log("    [BaseCtrl] Get All OK")
          // object of all the users
          console.log(result);
          res.status(200).send(result)
      }
    });
  },
  getById(req, res, dbModel, type) {
    console.log(" ->[BaseCtrl] Get By ID:" + req.params.id)
    dbModel.find(req.params, function(err, result) {
      if (err) {
        console.log("    [BaseCtrl] Get By ID Error")
        console.log(err);
        res.status(500).send(err)
      } else {
        // object of all the users
        console.log("    [BaseCtrl] Get By ID OK")
        console.log(result);
        res.status(200).send(result)
      }
    });
  },


  getAllOfUser(req, res, dbModel, type) {
    console.log(" ->[BaseCtrl] Get All of UserID:" + req.user.id)
    if (req.user) {
      dbModel.find({userId: req.user.id}, function(err, result) {
        if (err) {
            console.log("    BaseCtrl Get All OF USER Error")
            console.log(err);
            res.status(500).send(err)
        } else {
            console.log("    BaseCtrl Get All OF USER OK")
            // object of all the users
            console.log(result);
            res.status(200).send(result)
        }
      });
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  },
};
