'use strict';
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  'issue_title': {type: String, required: true},
  'issue_text': {type: String, required: true},
  'created_by': {type: String, required: true},
  'assigned_to': String,
  'status_text': String
});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      console.log(req);

    })
    
    .post(function (req, res){
      let project = req.params.project;

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
  
  app.route('/api/issues/apitest')
    .post((req, res) => {})
    .put((req, res) => {})
    .delete((req, res) => {});
};
