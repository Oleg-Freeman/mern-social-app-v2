const Joi = require('@hapi/joi');
const User = require('../models/user.model');

module.exports = {

  registerValidation: (data) => {
    const schema = Joi.object({
      email: Joi.string().required().min(6).max(254).email().lowercase(),
      password: Joi.string().min(6).max(72, 'utf8').required(),
      password2: Joi.any().valid(Joi.ref('password')).required(),
      userName: Joi.string().min(3).max(128).required()
    });
    return schema.validate(data);
  },

  loginValidation: (data) => {
    const schema = Joi.object({
      email: Joi.string().required().min(6).max(254).email().lowercase(),
      password: Joi.string().min(6).max(72, 'utf8').required()
    });
    return schema.validate(data);
  },

  ensureAuthenticated: async(req, res, next) => {
    if (!req.headers.token) {
      console.log('Please log in to view that resource');
      return res.status(400).json('Please log in to view that resource');
    }
    else {
      await User.findById(req.headers.token)
        .exec((err, user) => {
          if (err) return res.status(400).json('Error: ' + err);
          else if (user === null || user.length === 0) {
            return res.status(400).json('User not found');
          }
          else if (!user.isAuthenticated) {
            console.log('Please log in to view that resource');
            return res.status(400).json('Please log in to view that resource');
          }
          else {
            next();
          }
        });
    }
  },

  isloggedIn: async(req, res, next) => {
    if (req.headers.token) {
      await User.findById(req.headers.token)
        .exec((err, user) => {
          if (err) return res.status(400).json('Error: ' + err);
          if (user.isAuthenticated) {
            console.log('User already logged in');
            return res.json({ authenticated: true });
          }
          else {
            next();
          }
        });
    }
    else {
      next();
    }
  },

  isNotloggedIn: (req, res, next) => {
    console.log(req.session.user);
    if (!req.session.user) {
      console.log('User not logged in');
      return res.json({ notAuthenticated: true });
    }
    else {
      next();
    }
  },

  reduseUserDetails: (data) => {
    const userDetails = {};
    if (!data.bio.trim().isEmpty()) userDetails.bio = data.bio;
    if (!data.website.trim().isEmpty()) {
      if (data.website.trim().substring(0, 4) !== 'http') {
        userDetails.website = `http://${data.website.trim()}`;
      }
      else userDetails.website = data.website;
    }
    if (!data.location.trim().isEmpty()) userDetails.location = data.location;
    if (!data.birthDay.trim().isEmpty()) userDetails.birthDay = data.birthDay;
    return userDetails;
  },

  userDetailsValidation: (data) => {
    const schema = Joi.object({
      bio: Joi.string().empty().not(' '),
      website: Joi.string().empty().not(' '),
      location: Joi.string().empty().not(' '),
      birthDay: Joi.date().empty().less('now').iso().not(' ')
    });
    return schema.validate(data);
  },

  bodyValidation: (data) => {
    const schema = Joi.object({
      body: Joi.string().empty().not(' ')
    });
    return schema.validate(data);
  }

};
