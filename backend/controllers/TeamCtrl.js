import dbteam from "../database/models/dbteam";
import dbuser from "../database/models/dbuser";
import dbjointeam from "../database/models/dbjointeam";

module.exports = {
  // req.body: teamId
  async getAllUserOfTeam(req, res) {
    console.log("getAllUserOfTeam:" + req.body.teamId)  
    console.log(req.body)  
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
  // An User want to Join a team
  async rejoinTeamCreatedByMe(req, res) {
    console.log("rejoinTeamCreatedByMe USERID:" + req.user.id + ",code:" + req.body.code)
    try {
      //Find the User informationi of Request
      const requestUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (requestUser && req.body.code && req.body.code.length > 0) {
        const result = await dbteam.findOne({code: req.body.code});
        console.log("    getTeam with Code OK:" + req.body.code)
        // object of all the users
        console.log(result);
        // If the TEam is same with User ID
        if (result.createdUserId == req.user.id) {
          requestUser.teamId = result._id;
          requestUser.teamCode = result.code;
          requestUser.roleInTeam = "manager";

          await new Promise((resolve, reject) => {
            requestUser.save(function(err, doc){
              err ? reject(err) : resolve(doc);
            });
          });

          res.status(200).send(result)
        } else {
          res.status(401).send({msg: "Not match team of User"})
        }
      } else {
        res.status(400).send({msg: "Not Found User"})
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },

  // An User want to Join a team
  async getLatestTeamInfoOfUser(req, res) {
    console.log("getLatestTeamInfoOfUser USERID:" + req.user.id + ",code:" + req.body.code)
    try {
      //Find the User informationi of Request
      const requestUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (requestUser && requestUser.teamCode) {
        const result = await dbteam.findOne({code: requestUser.teamCode});
        console.log("    getTeam with Code OK:" + requestUser.teamCode)

        // If the TEam is same with User ID
        if (result) {
          res.status(200).send(result)
        } else {
          res.status(401).send({msg: "Cannot Find Team of User"})
        }
      } else {
        res.status(400).send({msg: "Not Found User"})
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },

  // ONE USER CAN ONLY Have MAx 3 Team
  // TODO. Need return new JWT token contain teamId and TeamCode of this User
  async createTeamOfUser(req, res) {
    console.log("Team Create of USERID:" + req.user.id)  
    // Find How Many Team this User created
    const teamsOfMe = await dbteam.find({createdUserId: req.user.id});
    console.log("   User have Teams:" + teamsOfMe.length)
    if (teamsOfMe && teamsOfMe.length >= 3) {
      // User canot create Any more
      res.status(500).send({msg: "Bạn Không thể tạo quá 3 Nhóm!"})
      return;
    }

    var ObjectId = require('mongoose').Types.ObjectId;
    if (req.body.id) {
      // if Team ID existed, this is Edit infor
      var item = new dbteam({
        ...req.body,
        _id: new ObjectId(req.body.id)
      });
    } else {
      var item = new dbteam({
        ...req.body,
        createdUserId: req.user.id
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
        // if user already manager of other team or not manager, skip
        if (thisUser.roleInTeam == "member" && thisUser.teamId) {
          console.log("Member cannot create team")
          res.status(401).send({msg: "Member cannot create team"})
          return;
        }

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
        // Find if the teamCode is Valid
        const theTeam = await dbteam.findOne({code: req.body.teamCode});
        if (!theTeam) {
          res.status(400).send({msg: "Mã Nhóm Không Tồn Tại!"})
          return;
        }

        // Create new Request. If Found, Update status to requested
        let theRequest = await dbjointeam.findOne({ teamCode: req.body.teamCode, userId: req.user.id });
        if (theRequest) {
          // Existed Request, update
          // If Status is "blocked", mean Team Dont Want User to Join
          if (theRequest.status =="blocked") {
            res.status(400).send({msg: "Bạn đã bị chặn gia nhập từ nhóm '"+theTeam.name+"'!"})
          } else {
            // Update
            theRequest.teamCode= req.body.teamCode;
            theRequest.teamName= theTeam.name;
            theRequest.userId= req.user.id;
            theRequest.status= "requested";
            theRequest.fullName= requestUser.fullName;
            theRequest.email= requestUser.email;
            theRequest.phone= requestUser.phone;
            theRequest.updatedOn= new Date();

            await theRequest.save();
            res.status(200).send(theRequest)
          }
        } else {
          // Save New
          theRequest= new dbjointeam();
          theRequest.teamCode= req.body.teamCode;
          theRequest.teamName= theTeam.name;
          theRequest.userId= req.user.id;
          theRequest.status= "requested";
          theRequest.fullName= requestUser.fullName;
          theRequest.email= requestUser.email;
          theRequest.phone= requestUser.phone;
          theRequest.updatedOn= new Date();

          await theRequest.save();
          res.status(200).send(theRequest)
        }

        // let joinRequest = await new Promise((resolve, reject) => {
        //   dbjointeam.findOneAndUpdate({ teamCode: item.teamCode, userId: item.userId }, item, 
        //       {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
        //     err ? reject(err) : resolve(doc);
        //   });
        // });
      } else {
        res.status(400).send({msg: "Not Found User "})
      }

    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },
  // An User want to Join a team
  async leaveTeam(req, res) {
    console.log("Team Leave From USERID:" + req.user.id)
    try {
      //Find the User informationi of Request
      const requestUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      if (requestUser) {
        requestUser.teamCode=null;
        requestUser.teamId=null;
        requestUser.roleInTeam=null;
        // Create new Request. If Found, Update status to requested
        await new Promise((resolve, reject) => {
          requestUser.save(function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });

        res.status(200).send({msg: "OK"})
      } else {
        res.status(400).send({msg: "Not Found User"})
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
      } else {
        // if user is not manager, return empty
        res.status(200).send([])
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({msg: "Inter Server Error "})
      throw error;
    }
  },

  async cancelMyJoinRequest(req, res) {
    console.log("TeamCtrl, cancelMyJoinRequest")
    console.log(req.user)
    if (req.user && req.user.id) {
      try {
        // Find all Request with teamCode which User is Manager and status is "requested"
        const allRequests = await new Promise((resolve, reject) => {
          dbjointeam.find({userId: req.user.id, status: "requested"}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        if (allRequests && allRequests.length > 0) {
          // Save Request with new Type status
          for (let i = 0; i < allRequests.length; i++) {
            allRequests[i].status = "cancelByUser";
            await allRequests[i].save();
          }

          res.status(200).send([])
        } else {
          // no Requests
          res.status(200).send([])
        }
        

      } catch (error) {
        console.log(error);
        res.status(500).send({msg: "Inter Server Error "})
        throw error;
      }
    } else {
      res.status(500).send({msg: "Unauthorized!"})
    }
  },
  async getMyJoinRequest(req, res) {
    console.log("TeamCtrl, getMyJoinRequest, ID")
    console.log(req.params.id)
    let queryObj = {userId: req.user.id, status: "requested"};
    if (req.params.id) {
      var ObjectId = require('mongoose').Types.ObjectId;
      queryObj = {userId: req.user.id, "_id": new ObjectId(req.params.id )};
    }
    console.log("queryObj---")
    console.log(queryObj)
    if (req.user && req.user.id) {
      try {
        // Find all Request with teamCode which User is Manager and status is "requested"
        const allRequests = await new Promise((resolve, reject) => {
          dbjointeam.findOne(queryObj, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        console.log(allRequests)
        res.status(200).send(allRequests)
      } catch (error) {
        console.log(error);
        res.status(500).send({msg: "Inter Server Error "})
        throw error;
      }
    } else {
      res.status(500).send({msg: "Unauthorized!"})
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
  getAllTeamCreatedByUser(req, res) {
    console.log("Team getAllTeamCreatedByUser:" + req.user.id)
    if (req.user) {
      dbteam.find({createdUserId: req.user.id}, function(err, result) {
        if (err) {
            console.log("    getAllTeamCreatedByUser USER Error")
            console.log(err);
            res.status(500).send(err)
        } else {
            console.log("    getAllTeamCreatedByUser OK")
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
