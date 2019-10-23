import dbuser from "../database/models/dbuser";
import dbteam from "../database/models/dbteam";
const bcrypt = require('bcrypt')
const passport = require('passport');
const jwt = require('jsonwebtoken');

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
  }
};
