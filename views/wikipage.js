const html = require('html-template-tag');
const layout = require('./layout');

module.exports = (page, author) =>
  layout(html`
    <a href="/wiki/${page.slug}"><h3>${page.title}</h3></a>

    <h4>by <a href="/user/${author.name}">${author.name}</a></h4>
    <hr />
    <div class="page-body">${page.content}</div>
    <hr />
    <a href="/wiki/${page.slug}/edit" class="btn btn-primary">edit this page</a>
    <a href="/wiki/${page.slug}/delete" class="btn btn-danger"
      >delete this page</a
    >
  `);
