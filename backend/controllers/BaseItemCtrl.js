
var dbModel;
var type="gas";
module.exports = {
  create(req, res) {
    console.log(" ->[BaseCtrl] Create, Body")
    console.log(req.body)
    var item = new module.exports.dbModel({
      ...req.body,
    //   fillDate: new Date(),
    //   type: module.exports.type 
    });

    item.save((err, result) => {
      if (err) {
        console.log('    [BaseCtrl] Item Create ERROR!');
        console.log(err)
        res.status(500).send(err)
      } else {
        console.log('    [BaseCtrl] Item created!');
        console.log(result)
        res.status(200).send(item)
      }
    });
  },
  getAll(req, res) {
    console.log(" ->[BaseCtrl] Get All")
    module.exports.dbModel.find({}, function(err, result) {
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
  getById(req, res) {
    console.log(" ->[BaseCtrl] Get By ID:" + req.params.id)
    module.exports.dbModel.find(req.params, function(err, result) {
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
  }
};
exports.dbModel = dbModel;
exports.type = type;
