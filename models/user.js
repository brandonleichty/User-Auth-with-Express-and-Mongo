const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String, 
    required: true
  }
});

// a pre-save hook is a function that mongo runs just before saving the information to the database

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
   .exec((error, user) => {
     if (error) {
       return callback(error);
     } else if ( !user ) {
       const err = new Error('User not found.');
       err.status = 401;
       return callback(err);
     }
     bcrypt.compare(password, user.password, (error, result) => {
       if (result === true ) {
         return callback(null, user);
       } else {
         return callback();
       }
     });
   });
}

// hash password before saving
UserSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);

module.exports = User;