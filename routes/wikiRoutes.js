// wiki routes
const express = require('express');
const router = express.Router();

const { Page, User } = require('./../models/index.js');

const { addPage, wikiPage, main } = require('./../views');

router.get('/', async (req, res, next) => {
  // need to join page and user tables before sending to main()
  // because we want to handle all async stuff before generating html
  const pagesAndAuthors = await Page.findAll({
    include: [
      {
        model: User,
        as: 'author',
        required: true,
      },
    ],
  });
  res.send(main(pagesAndAuthors));
});

router.post('/', async (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const status = req.body.status;

  const name = req.body.name;
  const email = req.body.email;

  const pageObj = { title, content, status };
  const page = new Page(pageObj);
  try {
    const [user, _] = await User.findOrCreate({ where: { name, email } });
    page
      .save()
      .then(savedPage => {
        savedPage.setAuthor(user).then(() => {
          res.redirect(`/wiki/${savedPage.slug}`);
        });
      })
      .catch(e => {
        console.error(e);
      });
  } catch (err) {
    console.error('Error: ', err);
  }
});

// generate the html for the add page
router.get('/add', (req, res, next) => {
  res.send(addPage());
});

// get a page by its slug
router.get('/:slug', async (req, res, next) => {
  // will not work properly if their are multiple pages with the same title
  try {
    const page = await Page.findOne({
      where: { slug: req.params.slug },
    });
    const author = await User.findOne({ where: { id: page.authorId } });
    res.send(wikiPage(page, author));
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
