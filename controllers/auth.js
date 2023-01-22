const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: 'User created',
        userId: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUserData;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error('Email cannot find');
        error.statusCode = 401;
        throw error;
      }
      loadedUserData = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUserData.email,
          userId: loadedUserData._id.toString(),
        },
        'secret',
       
      );
      res
        .status(200)
        .json({ token: token, userId: loadedUserData._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.changeUserPassword = (req, res, next) => {
  const userId = req.userId;
  const password=req.body.password
  bcrypt.hash(password,12).then(hashedPassword=>{
   User.findById(userId).then(user=>{
    if(!user){
      const error=new Error('User data not find')
      error.statusCode=404
      throw error
    }
    user.password=hashedPassword

    return user.save()
    
  }).then(result=>{ res.status(200).json({ message:'Updated successfully', updatedUser:result})
})
.catch(err=>{
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err);
})
})
};
