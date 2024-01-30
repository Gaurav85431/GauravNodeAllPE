const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, //bcz google ka smtp use kr rhe hai free me.

  requireTLS: true,
  // authentication (auth) me username/ id aur password denge.
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD
  }

});


// To send Mail
// sendMail(email, subject, content) method ko call karega aur email, subject, content ko pass karega to mail send ho jayega.

const sendMail = async (email, subject, content) => {

  try {

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: content
      // koi method ko call krega to content html format me aayega.

    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
      console.log("Mail sent successfully ", info.messageId);

    })




  } catch (error) {

  }


}
module.exports = {
  sendMail,
};