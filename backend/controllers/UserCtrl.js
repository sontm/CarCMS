import dbuser from "../database/models/dbuser";
import dbteam from "../database/models/dbteam";
import dbnotification from "../database/models/dbnotification";
import apputil from "../components/AppUtil";
import axios from 'axios';
const bcrypt = require('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client("654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com");

module.exports = {
  // TODO for validate Email
  registerLocalUser(req, res, next) {
    console.log("[UserCtrl] Register, email, password:" + req.body.password + "," + req.body.email)
    let rawPwd = req.body.password;
    bcrypt.hash(rawPwd, 10, (err, newHashed) => {
      if(err) {
        return res.status(400).send(err);
      }
      console.log("  Register user, NewHashed:" + newHashed)
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
    console.log("[UserCtrl], Login:")
    // Not use session, use JWT
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            console.log("    Auth, Login Failed, err:")
            console.log(user)
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
        
        // Auth OK
        req.login(user, {session: false}, (err) => {
            if (err) {
                console.log("      Auth, ReqLogin failed:")
                return res.status(401).send(err);
            }
            console.log("      Auth, ReqLogin OK, UserInfo:")
            console.log(user)
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
            console.log("      Auth, ReqLogin OK, token:" + token)

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
    console.log("updateUserProfile of USERID:" + req.user.id)
    console.log(req.body)
    // Find current User record contain Vehicle data
    const currentUser = await new Promise((resolve, reject) => {
      dbuser.findById(req.user.id, function(err, doc){
        err ? reject(err) : resolve(doc);
      });
    });
    
    //console.log(currentUser)
    if (currentUser) {
      if (req.body.oldPwd) {
        if (req.body.oldPwd != currentUser.passwordR) {
          // Old password not matched
          res.status(500).send({msg: "Mật Khẩu Cũ không đúng!"})
          return;
        }
        const newHashed = await bcrypt.hash(req.body.newPwd, 10)
        console.log("   UNewHashed:" + newHashed)
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
      console.log("      New Token:" + token)

      res.status(200).send({
        fullName: result.fullName,
        phone: result.phone,
        token: token
      })
    }
  },

  async loginGoogle(req, res, next) {
    try {
      console.log("loginGoogle------------")
      console.log(req.body)
      const ticket = await client.verifyIdToken({
        idToken: req.body.idToken,
        audience: [
          "654590019389-5p2kn1c423p3mav7a07gsg8e7an12rc1.apps.googleusercontent.com",  // Android Specify the CLIENT_ID of the app that accesses the backend
          "654590019389-t78472q9u9ao4gcr2josc3r3gnki85if.apps.googleusercontent.com" // iOS
        ]
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      console.log("Verity Google TOken OK")
      //console.log(payload)
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
          // TODO for this AND query
          dbuser.findOneAndUpdate({ email: item.email, userServiceId: item.userServiceId }, item, 
              {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
            err ? reject(err) : resolve(doc);
          });
        });
        console.log("Found User++++++++++++++")
        console.log(theUser)
        if (!theUser) {
          // This is First time Create
          var user = apputil.createUserFromRecordForJWT(item);
        } else {
          var user = apputil.createUserFromRecordForJWT(theUser);
        }
        
        
        const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
        console.log("      Auth, Google LOgin OK, token:" + token)
        console.log("userJwt-----")
        console.log(user)
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
        console.log("create/find Google User Failed")
        console.log(err)
        res.status(500).send({msg: "Google Login Error"})
      }
    } catch (error) {
      console.log("Cannot Verify Google idToken")
      console.log(error)
      res.status(500).send({msg: "Google Login Error"})
    }
  },


  async loginFacebook(req, res, next) {
    try {
      console.log("loginFacebook------------")
      console.log(req.body)
      let userToken = req.body.accessToken;
      const appToken = await new Promise((resolve, reject) => {
        axios.get('https://graph.facebook.com/oauth/access_token?client_id=' 
          + '704967129987939' + '&client_secret=' 
          + 'a198785420e516c70853f12886b7bdca' + '&grant_type=client_credentials')
          .then(response => {
            console.log(response.data.access_token);
            resolve(response.data.access_token)
          })
          .catch(error => {
            console.log(error);
            reject(err)
          });
      })
      console.log(" appToken: " + appToken)

      const responseData = await new Promise((resolve, reject) => {
        axios.get('https://graph.facebook.com/debug_token?input_token=' + userToken + '&access_token=' + appToken)
          .then(response => {
            console.log(response.data)
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
            console.log(error);
            reject(error)
          });
      })
      console.log("  AppID: " + responseData.app_id + ",UserID:" + responseData.user_id)
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
              dbuser.findOneAndUpdate({ email: item.email, userServiceId: item.userServiceId }, item, 
                  {upsert:true, useFindAndModify: false, new:true}, function(err, doc){
                err ? reject(err) : resolve(doc);
              });
            });
            console.log("Found User++++++++++++++")
            console.log(theUser)
            if (!theUser) {
              // This is First time Create
              var user = apputil.createUserFromRecordForJWT(item);
            } else {
              var user = apputil.createUserFromRecordForJWT(theUser);
            }
            
            const token = jwt.sign(user, 'your_jwt_secret', { expiresIn: '30d' });
            console.log("      Auth, Facebook LOgin OK, token:" + token)
            console.log("userJwt-----")
            console.log(user)
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
            console.log("create/find Google User Failed")
            console.log(err)
            res.status(500).send({msg: "Google Login Error"})
          }
        }
      }
    } catch (error) {
      console.log("Cannot Verify FB idToken")
      console.log(error)
      res.status(500).send({msg: "FB Login Error"})
    }
  },


  getAll(req, res) {
    console.log("[UserCtrl] Get All")
    dbuser.find({}, function(err, result) {
      if (err) {
          console.log("    UserCtrl Get All Error")
          console.log(err);
          res.status(500).send(err)
      } else {
          console.log("    UserCtrl Get All OK")
          // object of all the users
          console.log(result);
          res.status(200).send(result)
      }
    });
  },


  getByEmailOrObjectId(req, res) { // Get from Params
    // req.body.email or email, req.body.password
    console.log("[UserCtrl] getByEmailOrObjectId")
    console.log(req.params.id)
    var ObjectId = require('mongoose').Types.ObjectId;
    var objId = new ObjectId( (req.params.id.length < 12) ? "123456789012" : req.params.id );
    
    dbuser.find({ $or:
      [ {'_id':objId},
        {'email':req.params.id}
      ]}, function(err, result) {
      if (err) {
        console.log("    UserCtrl getByEmailOrObjectId Error")
        console.log(err);
        res.status(500).send(err)
      } else {
        // object of all the users
        console.log("    UserCtrl getByEmailOrObjectId OK")
        console.log(result);
        res.status(200).send(result)
      }
    });
  },
  getUserProfile(req, res) {
    console.log("[UserCtrl] getUserProfile, User in Request")
    console.log(req.user)
    res.status(200).send(req.user)
  },



  // Input
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
  async syncToServer(req, res) {
    console.log("Vehicle Sync of USERID:" + req.user.id)
    
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
      currentUser.settings = req.body.settings;
      currentUser.settingService = req.body.settingService;

      console.log(" -- Will Save User")
      console.log(currentUser)

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

  // Auth API
    // vehicleList: props.userData.vehicleList,
    // customServiceModules: props.userData.customServiceModules,
    // customServiceModulesBike: props.userData.customServiceModulesBike,
    // settings: props.userData.settings,
    // settingService: props.userData.settingService
    // teamInfo: teamInfo
  async syncFromServer(req, res) {
    console.log("Vehicle Get OF USER ID:" + req.user.id)
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

      //console.log(currentUser.vehicleList[0])
      res.status(200).send({
        vehicleList: currentUser.vehicleList,
        customServiceModules: currentUser.customServiceModules,
        customServiceModulesBike: currentUser.customServiceModulesBike,
        settings: currentUser.settings,
        settingService: currentUser.settingService,
        teamInfo: teamInfo,
        notifications: notiInfo
      }
      )
    } else {
      res.status(500).send({msg: "Error, Not Found User"})
    }
  }
};
