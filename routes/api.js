'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {

  mongoose.connect('mongodb://localhost:27017/test');
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
        console.log(req.body)
        res.json(data);
      });
    })

    .put(function (req, res){
      let project = req.params.project;
      const {issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text,_id} = req.body;

      Issue.findByIdAndUpdate(_id, {
        issue_title:issue_title,
        issue_text:issue_text,
        created_on:created_on,
        updated_on:updated_on,
        created_by:created_by,
        assigned_to:assigned_to,
        open: open,
        status_text: status_text
      },{
        new: true,
        overwrite: false
      } , (err, data) => {
        console.log(data)
        res.json(data);
      });
    })

    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;
      console.log(_id);
/*
      Issue.deleteMany({}, (err, data) => {
        if (err) return console.log(err);
        console.log(data);
      });

      */
      Issue.deleteOne({_id:_id}, (err, data) => {
        if (err) return console.error(err);
        console.log(data);
      });

    });
};
