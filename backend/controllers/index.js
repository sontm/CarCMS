const passport = require('passport');

import itemController from './ItemCtrl'
import vehicle from './VehicleCtrl'

module.exports = (app) => {
app.get('/api', (req, res) => res.status(200).send({
  message: 'Welcome to the Vehicle CMS /api!',
}));

app.post('/api/vehicle', vehicle.create);
app.get('/api/vehicle', vehicle.getAll);
app.get('/api/vehicle/:id', vehicle.getById);



app.post('/api/gas', itemController.createGas);
app.get('/api/gas', itemController.getGasAll);
app.get('/api/gas/:id', itemController.getGasById);

app.post('/api/oil', itemController.createOil);
app.get('/api/oil', itemController.getOilAll);
app.get('/api/oil/:id', itemController.getOilById);

app.post('/api/authcheck', itemController.createAuth);
app.get('/api/authcheck', itemController.getAuthAll);
app.get('/api/authcheck/:id', itemController.getAuthById);

app.post('/api/expense', itemController.createExpense);
app.get('/api/expense', itemController.getExpenseAll);
app.get('/api/expense/:id', itemController.getExpenseById);

app.post('/api/service', itemController.createService);
app.get('/api/service', itemController.getServiceAll);
app.get('/api/service/:id', itemController.getServiceById);
};
