import dbteam from "../database/models/dbteam";
import dbuser from "../database/models/dbuser";
import dbjointeam from "../database/models/dbjointeam";

module.exports = {
  // req.body: teamId
  async getAllUserOfTeam(req, res) {
    console.log("getAllUserOfTeam:" + req.body.teamId)    
    if (req.body.teamId) {
      try {
        // Find the User with this ID. Create new Team, assign teamId of User to this new ID
        const allUsers = await new Promise((resolve, reject) => {
          dbuser.find({teamId: req.body.teamId}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        res.status(200).send(allUsers)
      } catch (error) {
        console.log(error);
        res.status(500).send({msg: "Inter Server Error "})
        throw error;
      }
    } else {
      res.status(500).send({msg: "Wrong ID "})
    }
  },

  // TODO. Need return new JWT token contain teamId and TeamCode of this User
  async createTeamOfUser(req, res) {
    console.log("Team Create of USERID:" + req.user.id)    
    var ObjectId = require('mongoose').Types.ObjectId;
    if (req.user.id) {
      var item = new dbteam({
        ...req.body,
        _id: new ObjectId(req.body.id)
      });
    } else {
      var item = new dbteam({
        ...req.body
      });
    }
    console.log(item)
    try {
      // Find the User with this ID. Create new Team, assign teamId of User to this new ID
      const thisUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (thisUser) {
        const newTeam = await new Promise((resolve, reject) => {
          // item.save(function(err, doc){
          //   err ? reject(err) : resolve(doc);
          // });
          //Insert or Update
          dbteam.findOneAndUpdate({ _id: item._id }, item, 
            {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
          err ? reject(err) : resolve(doc);
        });

        });
        console.log("Created Team ID:")
        console.log(newTeam)
        thisUser.teamId = newTeam._id;
        thisUser.teamCode = newTeam.code;
        thisUser.roleInTeam = "manager";

        await new Promise((resolve, reject) => {
          thisUser.save(function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        res.status(200).send(newTeam)
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },


  // An User want to Join a team
  async joinTeam(req, res) {
    console.log("Team Join Team From USERID:" + req.user.id + ", to:" + req.body.teamCode)
    try {
      // Find if Any Blocked Requested  
      // TODO
      // const thisUser = await new Promise((resolve, reject) => {
      //   dbuser.findById(req.user.id, function(err, doc){
      //     err ? reject(err) : resolve(doc);
      //   });
      // });

      //Find the User informationi of Request
      const requestUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (requestUser) {
        // Create new Request. If Found, Update status to requested
        let item = {
          teamCode: req.body.teamCode,
          userId: req.user.id,
          status: "requested",
          fullName: requestUser.fullName,
          email: requestUser.email,
          phone: requestUser.phone
        };
        await new Promise((resolve, reject) => {
          dbjointeam.findOneAndUpdate({ teamCode: item.teamCode, userId: item.id }, item, 
              {upsert:true, useFindAndModify: false}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });

        res.status(200).send({msg: "OK"})
      } else {
        res.status(400).send({msg: "Not Found User "})
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },

  // req.body: teamId, teamCode
  async getAllJoinRequestWhichUserIsManager(req, res) {
    console.log("TeamCtrl, getAllJoinRequestWhichUserIsManager")
    try {
      // Find the User with this ID
      const thisUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (thisUser && thisUser.roleInTeam == "manager") {
        // Find all Request with teamCode which User is Manager and status is "requested"
        const allRequests = await new Promise((resolve, reject) => {
          dbjointeam.find({teamCode: thisUser.teamCode, status: "requested"}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        res.status(200).send(allRequests)
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },


  // req.body: teamId, teamCode, requestUserId, id (join id), action (approved or rejected)
  async approveOrRejectJoinRequest(req, res) {
    console.log("TeamCtrl, approveOrRejectJoinRequest")
    console.log(req.body)
    try {
      // Find the User with this ID
      const thisUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (thisUser && thisUser.roleInTeam == "manager" && req.body.teamCode == thisUser.teamCode) {
        // Find Request with teamCode which User is Manager
        const request = await new Promise((resolve, reject) => {
          dbjointeam.findById(req.body.id, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        if (request) {
          if (req.body.action == "approved" || req.body.action == "rejected" || req.body.action == "blocked") {
            request.status = req.body.action;

            // Save Request with new Type status
            await new Promise((resolve, reject) => {
              request.save(function(err, doc){
                err ? reject(err) : resolve(doc);
              });
            });

            if (req.body.action == "approved") {
              // Find the User which Request, set him the teamId, teamCOde and role member
              const requestUser = await new Promise((resolve, reject) => {
                dbuser.findById(req.body.requestUserId, function(err, doc){
                  err ? reject(err) : resolve(doc);
                });
              });
              if (requestUser) {
                requestUser.teamCode = req.body.teamCode;
                requestUser.teamId = req.body.teamId;
                requestUser.roleInTeam = "member";

                await new Promise((resolve, reject) => {
                  requestUser.save(function(err, doc){
                    err ? reject(err) : resolve(doc);
                  });
                });
              }
            }

            // Return all New Requests
            const allRequests = await new Promise((resolve, reject) => {
              dbjointeam.find({teamCode: thisUser.teamCode, status: "requested"}, function(err, doc){
                err ? reject(err) : resolve(doc);
              });
            });
            res.status(200).send(allRequests)
            return;
          } else {
            // Illegal status
          }
        }
      }
      res.status(400).send({})
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },

  // TODO for Edit Team. Only User of that Team can Edit
  getAll(req, res) {
    console.log("Team Get All")
    dbteam.find({}, function(err, result) {
      if (err) {
          console.log("    Team Get All Error")
          console.log(err);
          res.status(500).send(err)
      } else {
          console.log("    Team Get All OK")
          // object of all the users
          console.log(result);
          res.status(200).send(result)
      }
    });
  },
  getById(req, res) {
    console.log("Team Get By ID:" + req.params.id)
    dbteam.find(req.params, function(err, result) {
      if (err) {
        console.log("    Team Get By ID Error")
        console.log(err);
        res.status(500).send(err)
      } else {
        // object of all the users
        console.log("    Team Get By ID OK")
        console.log(result);
        res.status(200).send(result)
      }
    });
  },

  // Auth API
  getAllOfUser(req, res) {
    console.log("Vehicle Get OF USER ID:" + req.user.id)
    if (req.user) {
      dbteam.find({userId: req.user.id}, function(err, result) {
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
