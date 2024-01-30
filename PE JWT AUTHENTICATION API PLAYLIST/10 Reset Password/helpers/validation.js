const { check } = require('express-validator');

exports.registerValidator = [

  // const registerValidator=[

  check('name', "Name is require").not().isEmpty(),

  check('email', "plz include valid email").isEmail().normalizeEmail({ gmail_remove_dots: true }),

  // check('mobile',"Mob No. should be of 10 digits").isMobilePhone();

  check('mobile', 'Mobile No. is of 10 digits').isLength({
    min: 10,
    max: 10
  }),

  check('password', 'Password must have 1 no., char uppercase, lowercase, symbol,').isStrongPassword({
    minLength: 6,
    minUppercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1
  }),

  /*  Use image/jpg instead of images/jpg

    check('images').custom((value, { req }) => {
  
      if (req.file.mimetype === 'images/jpeg' || req.file.mimetype === 'images/jpg' || req.file.mimetype === 'images/png') {
  
        return true;
      }
      else {
        return false;
      }
    }).withMessage("Please upload an image of jpeg or jpg or png format")
  */
  //   Use image instead of images
  check('images').custom((value, { req }) => {

    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg' || req.file.mimetype === 'image/png') {

      return true;
    }
    else {
      return false;
    }
  }).withMessage("Please upload an image of jpeg or jpg or png format")

];



// TO send verification link bcz yadi mail per se verify nhi kiya to bad me user ko verification link jayega jisse ki wo bad me verify kar sakta hai.
// 1st check valid mail id 
// 2nd uska is_Verified = 0 ho

exports.sendMailVerificationValidator = [

  // check mail vaild hai ya nhi
  check('email', "plz include valid email").isEmail().normalizeEmail({ gmail_remove_dots: true }),

];



// Forgot password ke liye validator
exports.forgotPasswordValidator = [


  check('email', "plz include valid email").isEmail().normalizeEmail({ gmail_remove_dots: true }),

];