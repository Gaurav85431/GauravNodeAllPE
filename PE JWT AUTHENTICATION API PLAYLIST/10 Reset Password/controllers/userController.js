const user = require('../models/userModels');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const myMailer = require('../helpers/mailer');


// Hm ek package install karenge randomstring jiska use hoga string ko randomly generate krne me jiska use karke hm token ko generate karenge.
const randomstring = require('randomstring');
const PasswordReset = require('../models/passwordReset');



const register = async (req, res) => {

  try {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Error", success: false, errors: errors.array() });
    }

    const { name, email, mobile, password } = req.body;



    const isExists = await user.findOne({ email: email });

    if (isExists) {
      return res.status(400).json({ msg: "Email already exists", success: false });
    }

    else {



      const hashPassword = await bcrypt.hash(password, 10);


      const myUser = new user({

        name,
        email,
        mobile,
        password: hashPassword,
        images: req.file.fileName

      })
      const myData = await myUser.save();
      // console.log(myUser);

      // we want ki jaise hi user register ho to uske mail pr mail jaye.

      const msg = '<p>Hii ' + name + ', Please <a href="http://127.0.0.1:3000/mail-verification?id=' + myData._id + '">Verify</a> your mail </p>'

      myMailer.sendMail(email, 'Mail verification', msg);
      // sendMail(email, subject, message)

      // return ke bad koi line not execute so sendMail() ko pehle call kre.
      return res.status(200).json({ success: true, msg: "Registered Successfully", user: myData });



      /*  WHY IMAGE NOT SHOWING AT INSERTING TIME
      const imagePath = path.join(__dirname, '..', 'public/images', myUser.images);
      res.status(200).send({ msg: "inserted", data: myData, images: imagePath });
*/


    }
  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, msg: err.message });
  }


}

// Mail Verifiaction:
const mailVerification = async (req, res) => {

  try {
    // Yadi req.query = query means jo v query parameter hai URL me ? laga kar ke baad jo hai. i.e. ?id=322      req.query.id

    // agar hme undefined de rha hai i.e. yani ki wo set  nhi hai url ke under.

    if (req.query.id == undefined) {
      return res.render('404');
    }



    // hm check krenge ki jo id hia wo valid hai ya nhi i.e. db me wo id hia ya nhi.

    const UserData = await user.findOne({ _id: req.query.id })

    // check if mail already verified

    if (UserData.is_verified === 1) {
      return res.render('mail-verification', { message: 'Mail has already verified' })
    }


    if (UserData) {

      // ydi id valid hai to hm isVerified ko 1 kar denge i.e. ki mail verification ho gya.

      /*const x =*/ await user.findByIdAndUpdate({ _id: req.query.id }, { $set: { is_verified: 1 } })
      return res.render('mail-verification', { message: 'mail has been verified!' });

      // agar is_Verified 1 ho gaya to message render karenge ki mail verified. i.e. message variable ko hi yaha se pass kar rhe hia.



    }

    else {
      return res.render('mail-verification', { message: 'User Not Found' });
      // TO hm mail-verification.ejs ek file banaye hai lekin usme hm ek variable (message) send karenge aur ek message send karenge i.e. User Not found.
      // yaha mail-verification jo hai wo ejs file hai jisko hm render kara rhe hai.
      // jab user find nhi hoga tb ye error dega.
    }


  } catch (error) {

    console.log(error.message);

    // jo v error aayega wo hm view ko render kar denge.
    return res.render('404');
  }

}



// send mail verification link

const sendMailVerification = async (req, res) => {

  try {

    // validationResult ko hmne import kiya hai.
    const errors = validationResult(req);
    // validationResult me hm req (request) ko pass kar denge taki ye hmari request ko validate kare

    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Error", success: false, errors: errors.array() });
    }


    // Take email
    const { email } = req.body;


    // check ki wo email database me store hia ya nhi.

    const userData = await user.findOne({ email });
    // jab key and value same ho to hm email:email ke badle email v likh sakte hia.

    // IF email nhi hai database me to wo error send karega.

    if (!userData) {
      return res.status(400).json({

        success: false,
        msg: "Email doesn't exist😒"

      });
    }

    // yadi pehle se hi verified hoga hoga to ye error throw karega.

    if (userData.is_verified == 1) {
      return res.status(400).json({
        success: false,
        msg: userData.email + " is already verified😊"
      })
    }

    // Agar verification nhi hai i.e. upper ka condition ko follow nhi kar rha hia to wo error throw karega.


    const msg = '<p>Hii ' + userData.name + ', Please <a href="http://127.0.0.1:3000/mail-verification?id=' + userData._id + '">Verify</a> your mail </p>'

    myMailer.sendMail(userData.email, 'Mail verification', msg);
    // sendMail(email, subject, message)

    // return ke bad koi line not execute so sendMail() ko pehle call kre.
    return res.status(200).json({ success: true, msg: "Verification link sent to your mail,  Plz verify", user: userData });



    // 
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, msg: err.message });
  }



}



// FORGOT Password


const forgotPassword = async (req, res) => {

  try {

    const errors = validationResult(req);
    // validationResult me hm req (request) ko pass kar denge taki ye hmari request ko validate kare

    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Error", success: false, errors: errors.array() });
    }

    const { email } = req.body;

    // console.log(email);

    const userData = await user.findOne({ email });
    // jab key and value same ho to hm email:email ke badle email v likh sakte hia.

    // IF email nhi hai database me to wo error send karega.

    if (!userData) {
      return res.status(400).json({

        success: false,
        msg: "Email doesn't exist😒"

      });
    }

    // Hm ek package install karenge randomstring jiska use hoga string ko randomly generate krne me jiska use karke hm token ko generate karenge.


    // randomstring ke paas ek method hota hai generate() jo ki hme random string generate krke de dega.
    // isko hm randomString name ke variable me store kara lenge
    const randomString = randomstring.generate();

    // ab hme mail sending ka kam krna hoga to iske liye message ko likh lenge ek variable me.
    const msg = '<p>Hii ' + userData.name + ', Please click <a href="http://127.0.0.1:3000/reset-password?token=' + randomString + '">here </a>to reset your password. </p>';


    // to ye randomString hmare liye token ban chuka hai. Hme es token ko passwordReset model me store krna hai
    // problem ye hai ki agar ek user to 2 bar mail send kiye to 2 bar wo database me store ho jayega aur 2 token store rahega. To hm verifu karne ke liye user ke last token ko le sakte hai. Lekin wo Sahi tarika nhi hai because usme bahoot storage lag jayega.
    // to hm save karenge password reset ko isse pehle hm password reset ko empty kar de us particular user ka.

    await PasswordReset.deleteMany({ user_id: userData._id });

    const passwordReset = new PasswordReset({
      user_id: userData._id,
      token: randomString
    });
    await passwordReset.save(); // save the data of user_id and token

    // ab msg de diye to ab hm mail send karenge.   

    myMailer.sendMail(userData.email, 'Reset Password', msg);
    // ab isko hm user ko message provide kar denge.

    return res.status(201).json({
      success: true,
      msg: 'Reset password link is sent to your mail please check :) '
    });

  }
  catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, msg: err.message });
  }

}


module.exports = {
  register,
  mailVerification,
  sendMailVerification,
  forgotPassword
}