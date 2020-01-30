import dbuser from "../database/models/dbuser";
import dbteam from "../database/models/dbteam";
import dbnotification from "../database/models/dbnotification";
import dbjointeam from "../database/models/dbjointeam";
import dbpwdrecovery from "../database/models/dbpwdrecovery";

import apputil from "../components/AppUtil";
import axios from 'axios';
const bcrypt = require('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com");

module.exports = {
  // TODO for validate Email
  async registerLocalUser(req, res, next) {
    apputil.CONSOLE_LOG("[UserCtrl] Register, email, password:" + req.body.password + "," + req.body.email)
    let currentUser = await dbuser.findOne({email: req.body.email});
    // if There is a User associated, NG
    if (currentUser) {
      res.status(400).send({msg:"Địa chỉ Email đã được sử dụng!"})
      return;
    }


    let rawPwd = req.body.password;
    bcrypt.hash(rawPwd, 10, (err, newHashed) => {
      if(err) {
        return res.status(400).send(err);
      }
      apputil.CONSOLE_LOG("  Register user, NewHashed:" + newHashed)
      let userInfo = {};
      userInfo.email = req.body.email;
      userInfo.password = newHashed;
      userInfo.passwordR = rawPwd;
      userInfo.fullName = req.body.fullName;
      userInfo.phone = req.body.phone;
      userInfo.type = "local";
      userInfo.class = "freeUser";

      let item = new dbuser(userInfo);

      return item.save()
        .then(result => {
          res.status(201).send(result)
        })
        .catch(error => res.status(400).send(error));
    });
  },

  login(req, res, next) {
    apputil.CONSOLE_LOG("[UserCtrl], Login:")
    // Not use session, use JWT
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            apputil.CONSOLE_LOG("    Auth, Login Failed, err:")
            apputil.CONSOLE_LOG(user)
            return res.status(400).json({
                message: 'Invalid Email or Password!',
                user   : user
            });
        }
        
        // Auth OK
        req.login(user, {session: false}, (err) => {
            if (err) {
                apputil.CONSOLE_LOG("      Auth, ReqLogin failed:")
                return res.status(401).send(err);
            }
            apputil.CONSOLE_LOG("      Auth, ReqLogin OK, UserInfo:")
            apputil.CONSOLE_LOG(user)
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
            apputil.CONSOLE_LOG("      Auth, ReqLogin OK, token:" + token)

            // Return Team Info also
            dbteam.findById(user.teamId,function(err, teamInfo) {
              if (err) {
                  res.status(500).send(err)
              } else {
                  return res
                    .status(200)
                    .send({user, token, teamInfo})
                  }
            });
        });
    })(req, res);
  },
  //body 
  async updateUserProfile(req, res) {
    apputil.CONSOLE_LOG("updateUserProfile of USERID:" + req.user.id)
    apputil.CONSOLE_LOG(req.body)
    // Find current User record contain Vehicle data
    const currentUser = await new Promise((resolve, reject) => {
      dbuser.findById(req.user.id, function(err, doc){
        err ? reject(err) : resolve(doc);
      });
    });
    
    //apputil.CONSOLE_LOG(currentUser)
    if (currentUser) {
      if (req.body.oldPwd) {
        if (req.body.oldPwd != currentUser.passwordR) {
          // Old password not matched
          res.status(500).send({msg: "Mật Khẩu Cũ không đúng!"})
          return;
        }
        const newHashed = await bcrypt.hash(req.body.newPwd, 10)
        apputil.CONSOLE_LOG("   UNewHashed:" + newHashed)
        currentUser.passwordR = req.body.newPwd;
        currentUser.password = newHashed;
      }
      currentUser.fullName = req.body.fullName;
      currentUser.phone = req.body.phone;
      // todo email 
      const result = await new Promise((resolve, reject) => {
        currentUser.save(function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });
      let user = apputil.createUserFromRecordForJWT(result)
      const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
      apputil.CONSOLE_LOG("      New Token:" + token)

      res.status(200).send({
        fullName: result.fullName,
        phone: result.phone,
        token: token
      })
    }
  },


  //body . Req from Website
  async resetPassword(req, res) {
    apputil.CONSOLE_LOG("resetPassword of USERID:")
    if (req.body.userId && req.body.token && req.body.password) {
      // Find current User record contain Vehicle data
      const theRecord = await dbpwdrecovery.findOne({
        userId: req.body.userId,
        enable: true,
        token:req.body.token});
      
      if (theRecord) {
        // Check the valid current Date
        let nowDate = new Date();
        if (nowDate.getTime() < new Date(theRecord.validUntil).getTime()) {
          // Valid TOken, Now CHange the PWD
          const currentUser = await dbuser.findById(req.body.userId);
          if (currentUser) {
            const newHashed = await bcrypt.hash(req.body.password, 10)
            currentUser.passwordR = req.body.password;
            currentUser.password = newHashed;
            await currentUser.save();

            theRecord.enable = false;
            await theRecord.save();

            res.status(200).send({msg: "OK"})
          } else {
            res.status(400).send({msg: "User Not Found!"})
          }
        } else {
          // Time Out Request
          res.status(400).send({msg: "Time Out Reset Token!"})
        }
      } else {
        res.status(500).send({msg: "No PWD Record Exist!"})
      }
      return;
    } else {
      res.status(500).send({msg: "Invalid Request Param!"})
      return;
    }
  },

  async loginGoogle(req, res, next) {
    try {
      apputil.CONSOLE_LOG("loginGoogle------------")
      apputil.CONSOLE_LOG(req.body)
      const ticket = await client.verifyIdToken({
        idToken: req.body.idToken,
        audience: [
          "654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com",  // Android Specify the CLIENT_ID of the app that accesses the backend
          "654590019389-t78472q9u9ao4gcr2josc3r3gnki85if.apps.googleusercontent.com", // iOS

          // Got from google-services.json
          "654590019389-kpvccej3ahoin5tm0l62tmsj23q2bb48.apps.googleusercontent.com",
          "654590019389-ulnlrsteuoramtlk82l5h19fsr88o6o5.apps.googleusercontent.com",
          "654590019389-v756q9jmg4ueskmjgi4cj79ltp03r187.apps.googleusercontent.com",
          "654590019389-t78472q9u9ao4gcr2josc3r3gnki85if.apps.googleusercontent.com",
        ]
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      apputil.CONSOLE_LOG("Verity Google TOken OK")
      //apputil.CONSOLE_LOG(payload)
      // Till here, aud, exp, iss is OK
      // { iss: 'https://accounts.google.com',
      // azp:
      // '65oogleusercontent.com',
      // aud:
      // '6512rc1.apps.googleusercontent.com',
      // sub: '10064770098098299751xxx7', <<---- User ID here
      // email: '',
      // email_verified: true,
      // at_hash: 'WbFOyy_LD-0MdecfnRi8Pg',
      // name: 'XXX',
      // picture:
      // 'https://lh3.googleusercontent.com/a-/AAuE7mA4DF_sq2s3a',
      // given_name: 'Son',
      // family_name: 'Tran minh',
      // locale: 'en',
      // iat: 1572364219,
      // exp: 1572367819 }

      // Check if the email  or sub (userServiceId) Existed
      let item = {
        email: payload.email,
        userServiceId: payload.sub,
        phone: "",
        fullName: payload.name,
        pictureUrl: payload.picture,
        type: "google",
        class: "freeUser",
      };
      try {
        const theUser = await new Promise((resolve, reject) => {
          //userServiceId: item.userServiceId 
          dbuser.findOneAndUpdate({ email: item.email}, item, 
              {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        apputil.CONSOLE_LOG("Found User++++++++++++++")
        apputil.CONSOLE_LOG(theUser)
        if (!theUser) {
          // This is First time Create
          var user = apputil.createUserFromRecordForJWT(item);
        } else {
          var user = apputil.createUserFromRecordForJWT(theUser);
        }
        
        
        const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
        apputil.CONSOLE_LOG("      Auth, Google LOgin OK, token:" + token)
        apputil.CONSOLE_LOG("userJwt-----")
        apputil.CONSOLE_LOG(user)
        // Return Team Info also
        dbteam.findById(user.teamId,function(err, teamInfo) {
          if (err) {
              res.status(500).send(err)
          } else {
              return res
                .status(200)
                .send({user, token, teamInfo})
              }
        });

      } catch (err) {
        apputil.CONSOLE_LOG("create/find Google User Failed")
        apputil.CONSOLE_LOG(err)
        res.status(500).send({msg: "Google Login Error"})
      }
    } catch (error) {
      apputil.CONSOLE_LOG("Cannot Verify Google idToken")
      apputil.CONSOLE_LOG(error)
      res.status(500).send({msg: "Google Login Error"})
    }
  },


  async loginFacebook(req, res, next) {
    try {
      apputil.CONSOLE_LOG("loginFacebook------------")
      apputil.CONSOLE_LOG(req.body)
      let userToken = req.body.accessToken;
      const appToken = await new Promise((resolve, reject) => {
        axios.get('https://graph.facebook.com/oauth/access_token?client_id=' 
          + '704967129987939' + '&client_secret=' 
          + 'a198785420e516c70853f12886b7bdca' + '&grant_type=client_credentials')
          .then(response => {
            apputil.CONSOLE_LOG(response.data.access_token);
            resolve(response.data.access_token)
          })
          .catch(error => {
            apputil.CONSOLE_LOG(error);
            reject(err)
          });
      })
      apputil.CONSOLE_LOG(" appToken: " + appToken)

      const responseData = await new Promise((resolve, reject) => {
        axios.get('https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken)
          .then(response => {
            apputil.CONSOLE_LOG(response.data)
            // It will return
            // "data": {
            //   "app_id": "YYY",
            //   "type": "USER",
            //   "application": "QuanLyXe",
            //   "data_access_expires_at": 1580145891,
            //   "expires_at": 1577552671,
            //   "is_valid": true,
            //   "issued_at": 1572368671,
            //   "metadata": {
            //   "auth_type": "rerequest"
            //   },
            //   "scopes": [
            //   "email",
            //   "public_profile"
            //   ],
            //   "user_id": "XXX"  <-----We will Verify this
            //   }
            resolve(response.data.data)
          })
          .catch(error => {
            apputil.CONSOLE_LOG(error);
            reject(error)
          });
      })
      apputil.CONSOLE_LOG("  AppID: " + responseData.app_id + ",UserID:" + responseData.user_id)
      if (responseData.app_id == "704967129987939") {
        let userProfile = req.body.userProfile;
        if (userProfile.id == responseData.user_id) {
          // Match User, do Insert or Get DB here
          let item = {
            email: userProfile.email,
            userServiceId: userProfile.id,
            phone: "",
            fullName: userProfile.name,
            pictureUrl: userProfile.picture.data.url,
            type: "facebook",
            class: "freeUser",
          };
          try {
            const theUser = await new Promise((resolve, reject) => {
              // TODO for this AND query, OR ??
              ////userServiceId: item.userServiceId 
              dbuser.findOneAndUpdate({ email: item.email}, item, 
                  {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
                err ? reject(err) : resolve(doc);
              });
            });
            apputil.CONSOLE_LOG("Found User++++++++++++++")
            apputil.CONSOLE_LOG(theUser)
            if (!theUser) {
              // This is First time Create
              var user = apputil.createUserFromRecordForJWT(item);
            } else {
              var user = apputil.createUserFromRecordForJWT(theUser);
            }
            
            const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
            apputil.CONSOLE_LOG("      Auth, Facebook LOgin OK, token:" + token)
            apputil.CONSOLE_LOG("userJwt-----")
            apputil.CONSOLE_LOG(user)
            // Return Team Info also
            dbteam.findById(user.teamId,function(err, teamInfo) {
              if (err) {
                  res.status(500).send(err)
              } else {
                  return res
                    .status(200)
                    .send({user, token, teamInfo})
                  }
            });
    
          } catch (err) {
            apputil.CONSOLE_LOG("create/find Google User Failed")
            apputil.CONSOLE_LOG(err)
            res.status(500).send({msg: "Google Login Error"})
          }
        }
      }
    } catch (error) {
      apputil.CONSOLE_LOG("Cannot Verify FB idToken")
      apputil.CONSOLE_LOG(error)
      res.status(500).send({msg: "FB Login Error"})
    }
  },


  getAll(req, res) {
    apputil.CONSOLE_LOG("[UserCtrl] Get All")
    dbuser.find({}, function(err, result) {
      if (err) {
          apputil.CONSOLE_LOG("    UserCtrl Get All Error")
          apputil.CONSOLE_LOG(err);
          res.status(500).send(err)
      } else {
          apputil.CONSOLE_LOG("    UserCtrl Get All OK")
          // object of all the users
          apputil.CONSOLE_LOG(result);
          res.status(200).send(result)
      }
    });
  },


  getByEmailOrObjectId(req, res) { // Get from Params
    // req.body.email or email, req.body.password
    apputil.CONSOLE_LOG("[UserCtrl] getByEmailOrObjectId")
    apputil.CONSOLE_LOG(req.params.id)
    var ObjectId = require('mongoose').Types.ObjectId;
    var objId = new ObjectId( (req.params.id.length < 12) ? "123456789012" : req.params.id );
    
    dbuser.find({ $or:
      [ {'_id':objId},
        {'email':req.params.id}
      ]}, function(err, result) {
      if (err) {
        apputil.CONSOLE_LOG("    UserCtrl getByEmailOrObjectId Error")
        apputil.CONSOLE_LOG(err);
        res.status(500).send(err)
      } else {
        // object of all the users
        apputil.CONSOLE_LOG("    UserCtrl getByEmailOrObjectId OK")
        apputil.CONSOLE_LOG(result);
        res.status(200).send(result)
      }
    });
  },
  getUserProfile(req, res) {
    apputil.CONSOLE_LOG("[UserCtrl] getUserProfile, User in Request")
    apputil.CONSOLE_LOG(req.user)
    res.status(200).send(req.user)
  },



  // Input
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    //customVehicleModel
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
  async syncToServer(req, res) {
    apputil.CONSOLE_LOG("Vehicle Sync of USERID:" + req.user.id)
    
    // Find current User record 
    const currentUser = await new Promise((resolve, reject) => {
      dbuser.findById(req.user.id, function(err, doc){
        err ? reject(err) : resolve(doc);
      });
    });
    if (currentUser) {
      // Update VehicleList
      currentUser.vehicleList = [];
      for (let loop = 0; loop < req.body.vehicleList.length; loop++) {
        let element = req.body.vehicleList[loop];
        currentUser.vehicleList.push({
          ...element,
          userId: req.user.id
        });
      }
      currentUser.customServiceModules = req.body.customServiceModules;
      currentUser.customServiceModulesBike = req.body.customServiceModulesBike;
      currentUser.customVehicleModel = req.body.customVehicleModel;
      
      currentUser.settings = req.body.settings;
      currentUser.settingService = req.body.settingService;

      apputil.CONSOLE_LOG(" -- Will Save User")
      apputil.CONSOLE_LOG(currentUser)

      await new Promise((resolve, reject) => {
        currentUser.save(function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });
      // if (req.body.constructor == Array) {
      //   // If this is Array, process each item
      //   currentUser.vehicleList = [];
      //   for (let loop = 0; loop < req.body.length; loop++) {
      //     let element = req.body[loop];
      //     // TODO for LOGIC of Sync

      //     currentUser.vehicleList.push({
      //       ...element,
      //       userId: req.user.id
      //     });
      //   }

      //   await new Promise((resolve, reject) => {
      //     currentUser.save(function(err, doc){
      //       err ? reject(err) : resolve(doc);
      //     });
      //   });
      // } else {
      //   currentUser.vehicleList.push({
      //     ...req.body,
      //     userId: req.user.id
      //   });
      //   await new Promise((resolve, reject) => {
      //     currentUser.save(function(err, doc){
      //       err ? reject(err) : resolve(doc);
      //     });
      //   });
      // }
      res.status(200).send({msg: "Sync To Server Vehicle OK"})
    } else {
      res.status(500).send({msg: "Error, Not Found User"})
    }
  },
  // Input
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    //customVehicleModel
    // settings: props.userData.settings,
    // settingService: props.userData.settingService

    // Or someVehicles:[]
    async syncSomeDataToServer(req, res) {
      apputil.CONSOLE_LOG("Vehicle SOME DATA Sync of USERID:" + req.user.id)
      // Find current User record 
      let currentUser = await new Promise((resolve, reject) => {
        dbuser.findById(req.user.id, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });
      if (currentUser) {

        // Save all vehicleList, settiing, customdata if have
        if (req.body.vehicleList && req.body.vehicleList.length > 0) {
          currentUser.vehicleList = req.body.vehicleList;
        }
        if (req.body.customServiceModules && req.body.customServiceModules.length>0) {
          currentUser.customServiceModules = req.body.customServiceModules;
        }
        if (req.body.customServiceModulesBike&& req.body.customServiceModulesBike.length>0) {
          currentUser.customServiceModulesBike = req.body.customServiceModulesBike;
        }
        if (req.body.customVehicleModel&& req.body.customVehicleModel.length>0) {
          currentUser.customVehicleModel = req.body.customVehicleModel;
        }
        if (req.body.settings) {
          currentUser.settings = req.body.settings;
        }
        if (req.body.settingService) {
          currentUser.settingService = req.body.settingService;
        }

        // check if have someVehicles
        if (req.body.someVehicles && req.body.someVehicles.length > 0) {
          // loop in the DB, change if match id
          //for (let i = 0; i < currentUser.vehicleList.length; i++) {
          let newVeList = [];
          currentUser.vehicleList.forEach(dbItem => {
            let found = false;
            for (let i = 0; i < req.body.someVehicles.length; i++) {
              if (req.body.someVehicles[i].id == dbItem.id) {
                newVeList.push(req.body.someVehicles[i])
                found = true;
                break;
              }
            }
            if (!found) {
              newVeList.push(dbItem)
            }
          })
          if (newVeList.length > 0) {
            currentUser.vehicleList = newVeList;
          }
          //}
        }


        apputil.CONSOLE_LOG(" -- Will Save User from PartlyData")
  
        await new Promise((resolve, reject) => {
          currentUser.save(function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        
        res.status(200).send({msg: "Sync To Server Vehicle OK"})
      } else {
        res.status(500).send({msg: "Error, Not Found User"})
      }
    },


  // Auth API
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    //customVehicleModel
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
    // teamInfo: teamInfo
    // notifications
    // myJoinRequest
  async syncFromServer(req, res) {
    apputil.CONSOLE_LOG("Vehicle Get OF USER ID:" + req.user.id)
    // Find current User record contain Vehicle data
    const currentUser = await new Promise((resolve, reject) => {
      dbuser.findById(req.user.id, function(err, doc){
        err ? reject(err) : resolve(doc);
      });
    });
    if (currentUser) {
      // Find Team data of this User
      // Return Team Info also
      let teamInfo = await new Promise((resolve, reject) => {
        dbteam.findById(currentUser.teamId,function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });
      if (!teamInfo) {
        teamInfo = {};
      }

      // Load Notification also
      let notiInfo = await new Promise((resolve, reject) => {
        dbnotification.find( 
          { 
            $and: [
              {
                $or:[ 
                  {forAll: true},
                  {'teamId':currentUser.teamId},
                  {'userId':currentUser.id} 
                ],
              },
              {enable: true}
            ]
          },function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });
      if (!notiInfo) {
        notiInfo = [];
      }

      // Load my Join Requests
      const myJoinRequest = await new Promise((resolve, reject) => {
        dbjointeam.findOne({userId: req.user.id, status: "requested"}, function(err, doc){
          err ? reject(err) : resolve(doc);
        });
      });

      //apputil.CONSOLE_LOG(currentUser.vehicleList[0])
      res.status(200).send({
        vehicleList: currentUser.vehicleList,
        customServiceModules: currentUser.customServiceModules,
        customServiceModulesBike: currentUser.customServiceModulesBike,
        customVehicleModel: currentUser.customVehicleModel,
        settings: currentUser.settings,
        settingService: currentUser.settingService,
        teamInfo: teamInfo,
        notifications: notiInfo,
        myJoinRequest: myJoinRequest,
        isNoAds: currentUser.isNoAds
      }
      )
    } else {
      res.status(500).send({msg: "Error, Not Found User"})
    }
  }
};
