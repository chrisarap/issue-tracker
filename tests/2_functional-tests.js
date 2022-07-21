const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
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
          assert.ifError(err);
      })
      done();
  });
});
