const html = require('html-template-tag');
const layout = require('./layout');
const wikiPage = require('./wikipage');

// when we ran the join query the author tables were attached to the page tables inside 'page.author'
module.exports = pages =>
  layout(html`
    <h3>Pages</h3>
    <hr />
    <form method="GET" action="/wiki/search">
      <input type="text" name="search" />
      <button type="submit">Search</button>
    </form>
    <hr />
    <ul class="list-unstyled">
      <ul>
        ${pages.map(
          page =>
            `
              <li>${wikiPage(page, page.author)}</li>
            `
        )}
      </ul>
    </ul>
  `);
