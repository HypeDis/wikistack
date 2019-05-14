// wiki routes
const express = require('express');
const router = express.Router();

// GET 	/wiki/ 	/ 	retrieve all wiki pages
// POST 	/wiki/ 	/ 	submit a new page to the database
// GET 	/wiki/add/ 	/add 	retrieve the "add a page" form

const { addPage } = require('./../views');

router.get('/', (req, res, next) => {
  res.send('Get /wiki/ route');
});

router.post('/', (req, res, next) => {
  console.log(req.body);
});

router.get('/add', (req, res, next) => {
  res.send(addPage());
});

module.exports = router;
