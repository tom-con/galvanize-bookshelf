'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const bcrypt = require('bcrypt');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.post('/', (req, res, next) => {
  if(!req.body.email){
    return res.status(400).set('Content-Type', 'text/plain').send('Email must not be blank');
  }
  if(!req.body.password || req.body.password.length < 8){
    return res.status(400).set('Content-Type', 'text/plain').send('Password must be at least 8 characters long');
  }
  if(knex('users').where('email', req.body.email)){
    return res.status(400).set('Content-Type', 'text/plain').send('Email already exists');
  }
  else{
    knex('users')
      .returning(['id', 'first_name', 'last_name', 'email', ])
      .insert({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        hashed_password: bcrypt.hashSync(req.body.password, 8),
        created_at: new Date(),
        updated_at: new Date()
      })
      .then((user) => {
        res.set('Content-Type', 'application/json')
        res.send(humps.camelizeKeys(user[0]));
      })
  }
})

module.exports = router;
