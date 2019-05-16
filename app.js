const morgan = require('morgan');
const express = require('express');

const app = express();

// import db and models
const { db, Page, User } = require('./models/index.js');

// middleware
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

//routes
const wikiRouter = require('./routes/wikiRoutes');
const userRouter = require('./routes/userRoutes.js');
app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

const PORT = 3000;

app.get('/', (req, res) => {
  res.redirect('/wiki');
});

// sync models and start listening for requests on PORT
const init = async function() {
  await Page.sync();
  await User.sync();
  app.listen(PORT, () => {
    console.log(`connected to Port ${PORT}`);
  });
};

init();
