const Sequelize = require('sequelize');

const slugGenerator = require('./../utils/slugGenerator.js');

const db = require('./db.js');

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    defaultValue: 'open',
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
});

// generate a slug from the title before inserting into pages table
Page.addHook('beforeValidate', page => {
  page.slug = slugGenerator(page.title);
});

module.exports = Page;
