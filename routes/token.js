'use strict';
const knex = require('../knex')
const express = require('express');
const bcrypt = require('bcrypt');
const humps = require('humps');
const jwt = require('jsonwebtoken');
const boom = require('boom');



// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/', (req, res) => {
  if (!req.cookies.token) {
    res.status(200).send(false);
  } else {
    res.status(200).send(true);
  }
})

router.post('/', (req, res, next) => {
  let email = req.body.email;
  let pw = req.body.password;

  if (!email || !pw) {
    next(boom.create(400, 'Bad email or password'));
  }
  knex('users')
    .where('email', email)
    .then(users => {
      const user = users[0];
      if(user){
        bcrypt.compare(pw, user.hashed_password, (err, result) => {
          if (err) {
            next(boom.create(400, 'Bad email or password'));
          }
          if (result) {
            let token = jwt.sign({
              email: user.email,
              password: user.hashed_password
            }, "kjbsldkfasldfkj");
            res.cookie('token', token, {
              httpOnly: true
            });
            delete user.hashed_password;
            res.send(humps.camelizeKeys(user));
          } else {
            next(boom.create(400, 'Bad email or password'));
          }
        })
      } else {
        next(boom.create(400, 'Bad email or password'));
      }

    })
})

router.delete('/', (req, res) => {
  res.clearCookie('token');
  res.status(200).send(true);
})

module.exports = router;
