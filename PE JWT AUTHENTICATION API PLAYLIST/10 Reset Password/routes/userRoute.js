const express = require('express');

const router = express();

router.use(express.json());

const path = require('path');

const multer = require('multer');






const storage = multer.diskStorage({
  destination: function (request, file, cb) {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {

      cb(null, path.join(__dirname, '../public/images'));
    }
    else {
      cb(new Error('Invalid file type'), null);
    }
  },

  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});


const fileFilter = (req, file, cb) => {

  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  }
  else {
    cb(null, false);
  }

}



const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});


const userController = require('../controllers/userController');


const { registerValidator } = require('../helpers/validation');

// Aise v sendMailVerificationValidator ko import kar sakte hia.
// const { registerValidator, sendMailVerificationValidator } = require('../helpers/validation');

router.post('/register', upload.single('images'), registerValidator, userController.register)


// ya to aise import kro ya register validator ke saath hi kar lo
const { sendMailVerificationValidator } = require('../helpers/validation');

router.post('/send-mail-verification', sendMailVerificationValidator, userController.sendMailVerification);


// hme yaha per validation ko use krna hoga email me validation ke liye, for this we will import it either by this or that:-

// const { sendMailVerificationValidator, forgotPasswordValidator } = require('../helpers/validation');
const { forgotPasswordValidator } = require('../helpers/validation');

router.post('/forgot-password', forgotPasswordValidator, userController.forgotPassword);


module.exports = router;