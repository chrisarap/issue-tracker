'use strict';
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

module.exports = function (app) {

  mongoose.connect('mongodb://localhost:27017/test');
  const issueSchema = new mongoose.Schema({
     "project": String,

     "issue_title": {type: String, required: true},
     "issue_text": {type: String, required: true},
     "created_by": {type: String, required: true},
     "assigned_to": String,
     "status_text": String,

     "created_on": Date,
     "updated_on": Date,
     "open": Boolean,
  });

  const Issue = mongoose.model('Issue', issueSchema);

  app.route('/api/issues/:project')

    .get(function (req, res){

      let query = req.query;
      query.project = req.params.project;

      console.log('get request - querys ', query);

      Issue.find(query, (err, data) => {
        console.log('get request - query found ', data);
        res.json(data);
      })
    })

    .post((req, res) => {
      let project = req.params.project;

      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
      } = req.body;

      let actualDate = Date();

      if (!assigned_to) { assigned_to = ''; }
      if (!status_text) { status_text = ''; }

      console.log('post request - input data', req.body);

      Issue.create({
        project,

        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,

        created_on: actualDate,
        updated_on: actualDate,
        open: true,
      }, (err, data) => {
        if (err) res.send({ error: 'required field(s) missing' });
        console.log('post request - data created', data);
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
      let id = req.body._id;

      if (!id) {
        console.log('delete request - missing id', id);
        return res.send({error: 'missing _id'});
      }

      Issue.deleteOne({_id: id}, (err, data) => {

        if (!data || !data.deletedCount) {
          console.log('delete request - error', data, id);
          return res.send({error: 'could not delete', '_id': id });
        }

        console.log('delete request - deleted', err, data.deletedCount, id);
        return res.send({result: 'successfully deleted', '_id': id });

      // Issue.deleteMany({}, (err, data) => {
      //   if (err) return console.log(err);
      //   console.log(data);
      // });
    });
  });
};
