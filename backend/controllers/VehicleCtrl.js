import dbvehicle from "../database/models/dbvehicle";

module.exports = {
  async create(req, res) {
    console.log("Vehicle Create of USERID:" + req.user.id)
    console.log(req.body)
    // If this is Array, process each item
    if (req.body.constructor == Array) {
      for (let loop = 0; loop < req.body.length; loop++) {
        let element = req.body[loop];

        // Add User ID from JWT 
        element.userId = req.user.id;

        await new Promise((resolve, reject) => {
          dbvehicle.findOneAndUpdate({ id: element.id, userId: req.user.id }, element, 
              {upsert:true, useFindAndModify: false}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
      }
      res.status(200).send({msg: "Sync To Server Vehicle OK"})
    } else {
      let item = {
        ...req.body,
        userId: req.user.id
      };
      await new Promise((resolve, reject) => {
        dbvehicle.findOneAndUpdate({ id: item.id, userId: req.user.id }, item, 
            {upsert:true, useFindAndModify: false}, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      res.status(200).send({msg: "Add Vehicle OK "})
    }
  },
  getAll(req, res) {
    console.log("Vehicle Get All")
    dbvehicle.find({}, function(err, result) {
      if (err) {
          console.log("    Vehicle Get All Error")
          console.log(err);
          res.status(500).send(err)
      } else {
          console.log("    Vehicle Get All OK")
          // object of all the users
          console.log(result);
          res.status(200).send(result)
      }
    });
  },
  getById(req, res) {
    console.log("Vehicle Get By ID:" + req.params.id)
    dbvehicle.find(req.params, function(err, result) {
      if (err) {
        console.log("    Vehicle Get By ID Error")
        console.log(err);
        res.status(500).send(err)
      } else {
        // object of all the users
        console.log("    Vehicle Get By ID OK")
        console.log(result);
        res.status(200).send(result)
      }
    });
  },

  // Auth API
  getAllOfUser(req, res) {
    console.log("Vehicle Get OF USER ID:" + req.user.id)
    if (req.user) {
      dbvehicle.find({userId: req.user.id}, function(err, result) {
        if (err) {
            console.log("    Vehicle Get All OF USER Error")
            console.log(err);
            res.status(500).send(err)
        } else {
            console.log("    Vehicle Get All OF USER OK")
            // object of all the users
            console.log(result);
            res.status(200).send(result)
        }
      });
    } else {
      res.status(501).send({msg: "Require Authentication."})
    }
  }
};
