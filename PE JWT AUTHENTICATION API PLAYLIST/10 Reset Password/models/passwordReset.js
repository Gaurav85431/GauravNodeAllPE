// isme userid aur token store hoga ki, hm ek valid link banayenge ki agar ek bar link ko use kar liya to dobara use na kar sake

const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({


  user_id: {
    type: String,
    required: true,
    ref: 'User' // hm reference de rhe hai User model ke saath.

    // hm user_id ko objectId ke roop me store karenge taki aage hme easy ho relationship etc ko use karne me, populate etc ko use karne me
  },
  token: {
    type: String,
    required: true
  }

});
module.exports = mongoose.model("PasswordReset", passwordResetSchema);