// wiki routes
const express = require('express');
const router = express.Router();

const { Page } = require('./../models');

const { addPage } = require('./../views');

router.get('/', (req, res, next) => {
  console.log(req.body);
  res.json(req.body);
});

router.post('/', async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const status = req.body.status;

  const pageObj = { title, content, status };
  pageObj.slug = 'asdf';

  const page = Page.build(pageObj);
  console.log('page', page);

  page
    .save()
    .then(() => {
      res.json({ result: 'success' });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

module.exports = router;
