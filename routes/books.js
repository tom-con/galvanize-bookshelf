'use strict';
const express = require('express');
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

// YOUR CODE HERE
router.get('/', (req, res, next) => {
  knex('books').orderBy('title', 'asc')
    .then((books) => {
      res.send(humps.camelizeKeys(books));
    })
});

router.get('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    })
});

router.post('/', (req, res, next) => {
  knex('books')
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .insert(humps.decamelizeKeys(req.body))
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    });
});

router.patch('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .returning(['id', 'title', 'author', 'genre', 'description', 'cover_url'])
    .update(humps.decamelizeKeys(req.body))
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    });
});

router.delete('/:id', (req, res, next) => {
  let id = req.params.id;
  knex('books')
    .where('id', id)
    .returning(['title', 'author', 'genre', 'description', 'cover_url'])
    .del()
    .then((book) => {
      res.send(humps.camelizeKeys(book[0]));
    });
});

module.exports = router;
