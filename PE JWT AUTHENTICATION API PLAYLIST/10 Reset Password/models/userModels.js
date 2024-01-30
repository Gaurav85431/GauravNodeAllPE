const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_verified: {
    type: Number,
    default: 0
    // bydefault 0 means ki koi user verified nhi hai after varification ye 1 ho jayegea.
  },
  images: {
    type: String,
    // reqiured: true
  }
});

module.exports = mongoose.model('user', userSchema);