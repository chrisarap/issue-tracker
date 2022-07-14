'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let {open} = req.query;

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
