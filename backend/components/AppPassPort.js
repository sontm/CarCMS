import AppUtil from '../components/AppUtil'

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const FacebookStrategy  =     require('passport-facebook').Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4');

// "local" strategy
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    function (username, password, done) {
        console.log("  AppPassport Local strategy called, user:" + username + ",pwd:" + password)
        return DBUsers
            .findOne({
                where: {
                    'userId': username,
                    [Op.or]: {
                        'email': username
                      }
                },
                include: [{
                    model: DBRoles,
                    as: 'role',
                }]
            })
            .then(result => {
                if (result) {
                    console.log("    AppPassport Local Found User, checking PWD, raw:" + password + ",db:" + result.password)
                    // Found user with this user name, check Password
                    bcrypt.compare(password, result.password)
                    .then(isMatch => {
                        if (isMatch) {
                            console.log("      AppPassport Local PWD MATCHED")
                            // Match Username and Password
                            if (result) {
                                let user = AppUtil.createUserFromRecordForJWT(result)
                                return done(null, user, 
                                    {message: 'Logged In Successfully'});
                            } else {
                                return done(null, false, {message: 'Incorrect User Role'});
                            }
                        } else {
                            console.log("      AppPassport Local PWD NOT MATCH")
                            // Not Match
                            return done(null, false, {message: 'Incorrect user And password'});
                        }
                    })
                } else {
                    return done(null, false, {message: 'Incorrect User Name'});
                }
            })
            .catch(error => {
                console.log(error)
                return done(null, false, {message: 'Incorrect user or password.'});
            });
    }
));

var cookieExtractor = function (req) {
    let token = null;
    if (req) {
        token  = req.cookies["jwt"];
    }
    return token;
}

//ExtractJwt.fromAuthHeaderAsBearerToken()
passport.use(new JWTStrategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey   : 'your_jwt_secret',
        passReqToCallback: true, // Will pass req as first param
    },
    function (req, jwtPayload, done) {
        console.log("  AppPassport JWT strategy jwtPayload:")
        console.log(jwtPayload)
        // Compare CSRF in jwt with in Header
        let authorization = req.headers.authorization;
        if (authorization) {
            //// authorization: 'CSRF-TOKEN 6959dfd4-e263-4ade-b8c0-f12f4893d181' 
            let csrfToken = authorization.substring(11);
            if (csrfToken == jwtPayload.csrf) {
                delete jwtPayload.csrf;
                console.log("      Match CSRF, further process:")
                return done(null, jwtPayload);
            } else {
                console.log("      NOT Match CSRF")
            }
        }
        // UnAuthorized
        return done(null);


        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        // return UserModel.findOneById(jwtPayload.id)
        //     .then(user => {
        //         return done(null, user);
        //     })
        //     .catch(err => {
        //         return done(err);
        //     });
    }
));
