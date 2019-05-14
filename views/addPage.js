const html = require('html-template-tag');
const layout = require('./layout');

module.exports = () =>
  layout(html`
    <h3>Add a Page</h3>
    <hr />
    <form action="/wiki" method="post">
      <div>PLACEHOLDER FOR AUTHOR NAME FIELD</div>

      <div>PLACEHOLDER FOR AUTHOR EMAIL FIELD</div>

      <div class="form-group">
        <label for="title" class="col-sm-2 control-label">Page Title</label>
        <div class="col-sm-10">
          <input type="text" name="title" id="title" class="form-control" />
        </div>
      </div>

      <div class="form-group">
        <label for="content" class="col-sm-2 control-label">Page Content</label>
        <div class="col-sm-10">
          <input type="text" name="content" id="content" class="form-control" />
        </div>
      </div>

      <div class="form-group">
        <label for="status" class="col-sm-2 control-label">Page Status</label>
        <div>
          <input type="radio" name="status" id="open" value="open" />
          <label for="open">Open</label>
        </div>
        <div>
          <input type="radio" name="status" id="closed" />
          <label for="closed">Closed</label>
        </div>
      </div>

      <div class="col-sm-offset-2 col-sm-10">
        <button type="submit" class="btn btn-primary">submit</button>
      </div>
    </form>
  `);
