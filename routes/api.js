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

      //console.log('get request - querys ', query);

      Issue.find(query, (err, data) => {
        //console.log('get request - query found ', data);
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

      //console.log('post request - input data', req.body);

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
        //console.log('post request - data created', data);
        res.json(data);
      });

    })

    .put(function (req, res){

      // get only variables with text (true variables)
      let putVariables = {};

      for (let key in req.body) {
        if (req.body[key]) {
          Object.assign(putVariables, {[key]: req.body[key]});
        }
      }

      let myID = req.body._id;
      delete req.body._id;
      let open2 = !req.body.open;
      putVariables.open = open2;
      console.log(myID, putVariables);

      /*

      let myId = putVariables._id;
      delete putVariables._id;

      if (Object.entries(putVariables).length == 0) {
        console.log('put request ', 'no update field(s) sent', putVariables);
        return res.send({error: 'no update field(s) sent', data: putVariables});
      }



      if (!putVariables._id) {
        console.log('put request ', 'missing id', putVariables);
        return res.send({error: 'missing _id'});
      }

      putVariables.updated_on = Date();
      putVariables.open = !putVariables.open;


      Issue.findById(putVariables._id, (err, data) => {
        if (err) {
          console.log('put request ', 'could not update', data);
          return res.send({error: 'could not update', _id: putVariables._id });
        } else {
          Issue.findByIdAndUpdate(
            putVariables._id,
            putVariables,
            {
              overwrite: false,
              new: true,
              upsert: false
            }, (err, newData) => {
              if (err) {
                console.log('put request ', 'could not update 2');
                return res.send({error: 'could not update', _id: putVariables._id });
              }

              console.log('put request ', 'successfully updated', data, newData);
              return res.send({result: 'successfully updated', _id: putVariables._id});
            }
          );
        }
      });


      /*
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      let open = !req.body.open;
      let id = req.body._id;

      if (!id) {
        console.log('put request - missing _id', {id, issue_title, issue_text, created_by, assigned_to, status_text});
        return res.send({error: 'missing _id'});
      }


        Issue.findByIdAndUpdate(id, {
          issue_title:issue_title,
          issue_text:issue_text,
          created_by:created_by,
          assigned_to:assigned_to,
          status_text: status_text,
          open: open,
          updated_on: Date(),
        }, {
          overwrite: true,
          new: true,
          upsert: false
        }, (err, data) => {
          if(err || !data) {


            console.log('put request - could not update', {id, issue_title, issue_text, created_by, assigned_to, status_text});
            return res.send({ error: 'could not update', '_id': id });


          }

          if (data._id == id) {
            if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text) {
              console.log('put request - no update field(s) sent', {id, issue_title, issue_text, created_by, assigned_to, status_text});
              return res.send({error: 'no update field(s) sent', '_id': id});
            }

            console.log('put request - successfully updated', data, {id, issue_title, issue_text, created_by, assigned_to, status_text});
            return res.send({result: 'successfully updated', _id: id});
          }

        });


*/
})

    .delete(function (req, res){
      let project = req.params.project;
      let id = req.body._id;

      if (!id) {
        //console.log('delete request - missing id', id);
        return res.send({error: 'missing _id'});
      }

      Issue.deleteOne({_id: id}, (err, data) => {

        if (!data || !data.deletedCount) {
          //console.log('delete request - error', data, id);
          return res.send({error: 'could not delete', '_id': id });
        }

        //console.log('delete request - deleted', err, data.deletedCount, id);
        return res.send({result: 'successfully deleted', '_id': id });

      // Issue.deleteMany({}, (err, data) => {
      //   if (err) return console.log(err);
      //   console.log(data);
      // });
    });
  });
};
