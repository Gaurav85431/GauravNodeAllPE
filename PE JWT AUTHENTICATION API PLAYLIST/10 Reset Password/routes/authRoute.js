// JO mail verification hoga wo basically view hoga, view load hoga for this hm ejs view ko use kar rhe hai hm pug ko v use kar sakte hia.
const express = require('express');
const routes = express();

routes.use(express.json());

const userController = require('../controllers/userController');

routes.get('/mail-verification', userController.mailVerification)

module.exports = routes;