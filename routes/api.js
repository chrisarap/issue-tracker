'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect(process.env.MONGO_URI);
  const issueSchema = new mongoose.Schema({
     "issue_title": {type: String, required: true},
     "issue_text": {type: String, required: true},
     "created_on": Date,
     "updated_on": Date,
     "created_by": {type: String, required: true},
     "assigned_to": String,
     "open": Boolean,
     "status_text": String,
  });

  const Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')

    .get(function (req, res){
      let project = req.params.project;
      let {open} = req.query;
      Issue.find({}, (err, data) => {
        res.json(data);
      })
    })

    .post(function (req, res){
      let project = req.params.project;
      const {issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text} = req.body;
      Issue.create({
        issue_title,
        issue_text,
        created_on,
        updated_on,
        created_by,
        assigned_to,
        open,
        status_text
      }, (err, data) => {
        if (err) return console.error(err._message);
        console.log(req.body.error)
      });
    })

    .put(function (req, res){
      let project = req.params.project;

    })

    .delete(function (req, res){
      let project = req.params.project;
      let { id } = req.body._id;

      Issue.deleteOne(id, (err, data) => {
        if (err) return console.error(err);
      });
    });
};
