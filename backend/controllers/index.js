const passport = require('passport');

import itemController from './ItemCtrl'


module.exports = (app) => {
app.get('/api', (req, res) => res.status(200).send({
  message: 'Welcome to the Vehicle CMS /api!',
}));

app.post('/api/gas', itemController.createGas);
app.get('/api/gas', itemController.getGasAll);
app.get('/api/gas/:id', itemController.getGasById);

app.post('/api/oil', itemController.createOil);
app.get('/api/oil', itemController.getOilAll);
app.get('/api/oil/:id', itemController.getOilById);

app.post('/api/authcheck', itemController.createAuth);
app.get('/api/authcheck', itemController.getAuthAll);
app.get('/api/authcheck/:id', itemController.getAuthById);

};
