const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('login', {
    title: 'Request Login'
  });
};

exports.registerForm = (req, res) => {
  res.render('register', {
    title: 'Register'
  });
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Supply a name').notEmpty();
  req.checkBody('email', 'That email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password cannot be  blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be  blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be  blank').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {
      title: 'Register',
      body: req.body,
      flashes: req.flash()
    });
  }
}