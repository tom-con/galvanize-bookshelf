'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const boom = require('boom');

// eslint-disable-next-line new-cap
const router = express.Router();

// YOUR CODE HERE
router.get('/', (req, res, next) => {
  if (!req.cookies.token) {
    next(boom.create(401, 'Unauthorized'));
  } else {
    knex('favorites')
      .innerJoin('books', 'favorites.book_id', 'books.id')
      .then((faves) => {
        res.status(200).send(humps.camelizeKeys(faves));
      })
  }
})

router.get('/check', (req, res, next) => {
  if (!req.cookies.token) {
    next(boom.create(401, 'Unauthorized'));
  } else {
    let id = req.query.bookId;
    knex('favorites')
      .join('books', 'favorites.book_id', 'books.id')
      .where('books.id', id)
      .first()
      .then((book) => {
        if (book) {
          res.status(200).send(true);
        } else {
          res.status(200).send(false);
        }
      })
  }
})

router.post('/', (req, res, next) => {
  if (!req.cookies.token) {
    next(boom.create(401, 'Unauthorized'));
  } else {
    let bookId = req.body.bookId;
    knex('favorites')
      .returning(['id', 'book_id', 'user_id'])
      .insert({
        book_id: bookId,
        user_id: 1
      })
      .then((book) => {
        if (book) {
          res.status(200).send(humps.camelizeKeys(book[0]));
        }
      })
  }
})

router.delete('/', (req, res, next) => {
  if (!req.cookies.token) {
    next(boom.create(401, 'Unauthorized'));
  } else {
    let bookId = req.body.bookId;
    knex('favorites')
      .where('book_id', bookId)
      .returning(['book_id', 'user_id'])
      .del()
      .then((book) => {
        if (book[0]) {
          res.status(200).send(humps.camelizeKeys(book[0]));
        }
      })
  }
})

module.exports = router;
