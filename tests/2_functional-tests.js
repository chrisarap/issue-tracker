const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);
let testID;

suite('Functional Tests', () => {
  test("create issue with every field /api/issues/{project}", done => {
    chai
        .request(server)
        .post('/api/issues/apitest')
        .send({
            issue_title: "test",
            issue_text: "it just a test",
            created_by: "max",
            assigned_to: "maxi",
            status_text: "working"
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "test");
          assert.equal(res.body.issue_text, "it just a test");
          assert.equal(res.body.created_by, "max");
          assert.equal(res.body.assigned_to, "maxi");
          assert.equal(res.body.status_text, "working");
          // id for test
          testID = res.body._id;
        });
        done();
  });

  test('create issue with every field /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: "test",
        issue_text: "it just a test",
        created_by: "max",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "test");
        assert.equal(res.body.issue_text, "it just a test");
        assert.equal(res.body.created_by, "max");
      })
      done();
  });

  test('create issue with missing required field /api/issues/{project}', done => {
    chai
      .request(server)
      .post('/api/issues/apitest')
      .send({
        issue_title: "test"
      })
      .end((err, res) => {
          assert.equal(res.status, 200, "200 status");
          assert.equal(res.body.error, 'required field(s) missing');
      })
      done();
  });

  test('view issues on a project', done => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], '_id');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
      })
    done();
  });

  test('view issues on a project with one filter', done => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({open: true})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'open');
        assert.equal(res.body[0].open, true);
      })
    done();
  });

  test('view issues on a project with multiples filters', done => {
    chai
      .request(server)
      .get('/api/issues/apitest')
      .query({open: true, project: 'apitest'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'project');
        assert.equal(res.body[0].open, true);
        assert.equal(res.body[0].project, 'apitest');
      })
    done();
  });

  test('update one field', done => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({_id: testID, issue_title: 'test put title'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, testID);
        assert.equal(res.body.result, 'successfully updated');
      });
      done();
  });

  test('update multiple fields', done => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({_id: testID, issue_title: 'test put title 2', issue_text: 'test put text'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, testID);
        assert.equal(res.body.result, 'successfully updated');
      });
      done();
  });

  test('update without id', done => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({issue_title: 'test put title'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
      });
      done();
  });

  test('update without fields', done => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({})
      .end((err, res) => {
        console.log('heywawdsa', res.body);
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
      });
      done();
  });

  test('update with invalid id', done => {
    chai
      .request(server)
      .put('/api/issues/apitest')
      .send({_id: 'heyimtestingthis', issue_title: 'test put title'})
      .end((err, res) => {
        console.log(res.body, 'hey');
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
      });
      done();
  });

  test('delete an issue', done => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({_id: testID})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
      })
      done();
  });

  test('delete an issue with an invalid id', done => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .send({_id: 'asdasdasd'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
      });
    done();
  });

  test('delete an issue without id', done => {
    chai
      .request(server)
      .delete('/api/issues/apitest')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
      });
    done();
  });
});
