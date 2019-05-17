// wiki routes
const express = require('express');
const router = express.Router();

const { Page, User } = require('./../models/index.js');

const { addPage, wikiPage, main } = require('./../views/index.js');

// @ROUTE: GET to /wiki/
// @DESC: display all the existing wiki pages
router.get('/', async (req, res) => {
  // note: the code in this route is different from the post route because we are not creating a new page.

  // need to join page and user tables before sending to main()
  // because we want to handle all async stuff before generating html

  // the 'include' option in findAll is how sequelize does a join on tables
  // required:true option turns the join into an inner join
  Page.findAll({
    include: [
      {
        model: User,
        as: 'author', // need this because we set an alias when we created the association (Page.belongsTo(...))
        required: true,
      },
    ],
  })
    .then(pagesAndAuthors => {
      res.send(main(pagesAndAuthors));
    })
    .catch(e => {
      console.error('Error: ', e);
    });
});

// @ROUTE: POST to /wiki/
// @DESC: creates a new page and redirects to it
router.post('/', async (req, res) => {
  // page info
  const title = req.body.title;
  const content = req.body.content;
  const status = req.body.status;
  // user info
  const name = req.body.name;
  const email = req.body.email;

  try {
    // findOrCreate will either find a user with the given parameters or try to create a new user
    // it will return the user's row and a boolean stating
    // whether a new user was created(true) or an existing user was returned(false).
    const [user, wasCreated] = await User.findOrCreate({
      where: { name, email },
    });

    // console.log('I am a new user: ', wasCreated);

    // save the page to the db then set its author to the user returned above.
    // finally, redirect to the wiki page

    // optionally, we could combine page creation and saving with Page.create(pageObj).then(createdPage => ...)
    const pageObj = { title, content, status };
    const page = new Page(pageObj);
    page
      .save()
      .then(savedPage => {
        // after saving the new page in to the db, we set an association to the user from above.

        // setAuthor returns a promise,
        // we return that promise in the then block
        // to send it to the next then block
        return savedPage.setAuthor(user);

        // old code with nested promises
        /*
         * savedPage.setAuthor(user)
         *.then(() => {
         * res.redirect(`/wiki/${savedPage.slug}`)
         * })
         * .catch(e => {
         *   console.error("Error: ", e)
         * })
         */
      })
      // new code with promise chaining
      .then(savedPage => {
        res.redirect(`/wiki/${savedPage.slug}`);
      })
      .catch(e => {
        console.error(e);
      });
  } catch (err) {
    console.error('Error: ', err);
  }
});

// @ROUTE: GET to /wiki/add
// @DESC: user interface to generate a new wiki page. sends details to the /wiki/ post route.
router.get('/add', (req, res) => {
  res.send(addPage());
});

// @ROUTE: get to /wiki/:slug
// @DESC: find and display a page by its slug
router.get('/:slug', async (req, res) => {
  // note: it will just grab the first page it finds with that title regardless of who the author is
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });

    // old code
    // const author = await User.findOne({ where: { id: page.authorId } });

    // new code using sequelize associations
    const author = await page.getAuthor();

    res.send(wikiPage(page, author));
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
