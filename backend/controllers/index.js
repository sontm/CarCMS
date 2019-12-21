const passport = require('passport');

import user from './UserCtrl'
import team from './TeamCtrl';
import appData from './AppDataCtrl';

module.exports = (app) => {
app.get('/api', (req, res) => res.status(200).send({
  message: 'Welcome to the Vehicle CMS /api!',
}));

app.post('/api/login', user.login);
app.post('/api/login/google', user.loginGoogle);
app.post('/api/login/facebook', user.loginFacebook);

app.post('/api/users', user.registerLocalUser);
//app.get('/api/users', user.getAll);
//app.get('/api/usersById/:id', user.getByEmailOrObjectId);
// this request is Protected by JWT Authentication
app.get('/api/users/profile', passport.authenticate('jwt', {session: false}), user.getUserProfile);
app.post('/api/users/update', passport.authenticate('jwt', {session: false}), 
  user.updateUserProfile);
app.post('/api/resetpwd', user.resetPassword);  // Reset PWD, no need Authen

// Sync To Server from App
app.post('/api/users/vehicle', passport.authenticate('jwt', {session: false}), user.syncToServer);
// Sync From Server to App
app.get('/api/users/vehicle', passport.authenticate('jwt', {session: false}), user.syncFromServer);

// upsert
app.post('/api/team', passport.authenticate('jwt', {session: false}), team.createTeamOfUser);
app.post('/api/team/join', passport.authenticate('jwt', {session: false}), team.joinTeam);
app.get('/api/team/join', passport.authenticate('jwt', {session: false}), team.getAllJoinRequestWhichUserIsManager);
app.get('/api/team/leave', passport.authenticate('jwt', {session: false}), team.leaveTeam);
app.post('/api/team/join/action', passport.authenticate('jwt', {session: false}), team.approveOrRejectJoinRequest);
app.post('/api/team/users', passport.authenticate('jwt', {session: false}), team.getAllUserOfTeam);
app.get('/api/team/createdbyme', passport.authenticate('jwt', {session: false}), 
  team.getAllTeamCreatedByUser);
app.post('/api/team/rejointeam', passport.authenticate('jwt', {session: false}), 
  team.rejoinTeamCreatedByMe);

app.get('/api/team/latest', passport.authenticate('jwt', {session: false}), 
  team.getLatestTeamInfoOfUser);
app.get('/api/team/request/mine/:id', passport.authenticate('jwt', {session: false}), 
  team.getMyJoinRequest);
app.post('/api/team/request/cancel', passport.authenticate('jwt', {session: false}), 
  team.cancelMyJoinRequest);

//app.get('/api/app/services', passport.authenticate('jwt', {session: false}), appData.getDataServiceTypes);
// app.get('/api/app/services', appData.getDataServiceTypes);
// app.get('/api/app/expenses', appData.getDataExpenseTypes);
// app.get('/api/app/vehicles', appData.getDataVehicleModels);

app.get('/api/app/lateston', appData.getLatestDataDateOn);
app.get('/api/app/appdata', appData.getLatestAppData);

app.post('/api/app/notification', appData.addAppNotification);
app.post('/api/app/notification/me', passport.authenticate('jwt', {session: false}),
  appData.getMyNotification);
app.get('/api/app/notification/all', appData.getAllAppNotification);

//app.get('/api/app/recovermail', appData.sendEmailForgotPassword);
app.post('/api/app/recovermail', appData.requestEmailPasswordRecovery);

// app.post('/api/vehicle', passport.authenticate('jwt', {session: false}), vehicle.create);
// app.get('/api/vehicle', passport.authenticate('jwt', {session: false}), vehicle.getAllOfUser);
// app.get('/api/vehicle/all', vehicle.getAll);
// app.get('/api/vehicleById/:id', vehicle.getById);

// app.post('/api/gas', passport.authenticate('jwt', {session: false}), itemController.createGas);
// app.get('/api/gas', passport.authenticate('jwt', {session: false}), itemController.getGasAllOfUser);
// app.get('/api/gas/all', itemController.getGasAll);
// app.get('/api/gasById/:id', itemController.getGasById);

// app.post('/api/oil', passport.authenticate('jwt', {session: false}), itemController.createOil);
// app.get('/api/oil', passport.authenticate('jwt', {session: false}), itemController.getOilAllOfUser);
// app.get('/api/oil/all', itemController.getOilAll);
// app.get('/api/oilById/:id', itemController.getOilById);

// app.post('/api/authcheck', passport.authenticate('jwt', {session: false}), itemController.createAuth);
// app.get('/api/authcheck', passport.authenticate('jwt', {session: false}), itemController.getAuthAllOfUser);
// app.get('/api/authcheck/all', itemController.getAuthAll);
// app.get('/api/authcheckById/:id', itemController.getAuthById);

// app.post('/api/expense', passport.authenticate('jwt', {session: false}), itemController.createExpense);
// app.get('/api/expense', passport.authenticate('jwt', {session: false}), itemController.getExpenseAllOfUser);
// app.get('/api/expense/all', itemController.getExpenseAll);
// app.get('/api/expenseById/:id', itemController.getExpenseById);

// app.post('/api/service', passport.authenticate('jwt', {session: false}), itemController.createService);
// app.get('/api/service', passport.authenticate('jwt', {session: false}), itemController.getServiceAllOfUser);
// app.get('/api/service/all', itemController.getServiceAll);
// app.get('/api/serviceById/:id', itemController.getServiceById);
};
