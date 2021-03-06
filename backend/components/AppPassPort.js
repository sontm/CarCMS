import AppUtil from './AppUtil'
import dbuser from "../database/models/dbuser";
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt')

// "local" strategy
passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, 
    function (email, password, done) {
        AppUtil.CONSOLE_LOG("  AppPassport Local strategy called, useremail:" + email + ",pwd:" + password)
        return dbuser
        .findOne({email:email})
        .then(result => {
            if (result) {
                AppUtil.CONSOLE_LOG("    AppPassport Local Found User, checking PWD, raw:" + password + ",db:" + result.password)
                if ((!result.password && password) || (result.password && !password)) {
                    // One of password is NULL, FAIL
                    return done(null, false, {message: 'AUTH Incorrect password'});
                } else {
                    // Found user with this user name, check Password
                    bcrypt.compare(password, result.password)
                    .then(isMatch => {
                        if (isMatch) {
                            AppUtil.CONSOLE_LOG("      AppPassport Local PWD MATCHED")
                            // Match Username and Password
                            if (result) {
                                let user = AppUtil.createUserFromRecordForJWT(result)
                                return done(null, user, 
                                    {message: 'AUTH Logged In Successfully'});
                            } else {
                                return done(null, false, {message: 'AUTH Incorrect Local PWD'});
                            }
                        } else {
                            AppUtil.CONSOLE_LOG("      AppPassport Local PWD NOT MATCH")
                            // Not Match
                            return done(null, false, {message: 'AUTH Incorrect user And password'});
                        }
                    })
                }
            } else {
                return done(null, false, {message: 'AUTH Incorrect User Name'});
            }
        })
        .catch(error => {
            AppUtil.CONSOLE_LOG(error)
            return done(null, false, {message: 'AUTH Incorrect user or password.'});
        });
    }
));

//ExtractJwt.fromAuthHeaderAsBearerToken()
passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : 'your_jwt_secret',
        passReqToCallback: true, // Will pass req as first param
    },
    function (req, jwtPayload, done) {
        AppUtil.CONSOLE_LOG("  AppPassport JWT strategy jwtPayload:")
        AppUtil.CONSOLE_LOG(jwtPayload)
        return done(null, jwtPayload);

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
