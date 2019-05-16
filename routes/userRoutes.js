// users route\
const express = require('express');
const router = express.Router();

const { User, Page } = require('./../models/index.js');
const { userList, userPages } = require('./../views/index.js');

// @ROUTE: /users/
// @DESC: list all existing users
router.get('/', (req, res) => {
  User.findAll()
    .then(users => {
      res.send(userList(users));
    })
    .catch(e => {
      console.error('Error: ', e);
    });
});

// @ROUTE: /users/:id
// @DESC: get info on a specific user

router.get('/:id', async (req, res) => {
  const rawId = req.params.id;
  const numericalId = parseInt(rawId);
  if (isNaN(numericalId)) {
    throw new Error('Id is not a number');
  }

  // async await code
  /*  try {
    const user = await User.findByPk(numericalId);
    if (!user) {
      res.send('User not found');
    }
    const pages = await Page.findAll({
      where: {
        authorId: numericalId,
      },
    });
    res.send(userPages(user, pages));
  } catch (err) {
    console.error('Error: ', err);
  } */

  // new code running parallel promises using promise.all
  Promise.all([
    // findById is not a function in sequelize. use findByPk (primary key) instead
    User.findByPk(numericalId),
    Page.findAll({
      where: {
        authorId: numericalId,
      },
    }),
  ])
    .then(([user, pages]) => {
      res.send(userPages(user, pages));
    })
    .catch(e => {
      console.error('Error: ', e);
    });
});

module.exports = router;
