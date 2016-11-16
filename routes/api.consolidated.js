var queryString = require('querystring');
var fetch = require("node-fetch");
var Promise = require('bluebird');
var express = require('express');

module.exports = function(configs) {

  var router = express.Router({mergeParams: true, strict: true});

  var routeConfigs = {
    'numofactiveusers' : {"url":'/no_of_active_users.json'},
    'sessionperuser' : {"url":'/no_of_sessions.json'},
    'sessionsPerUser' : {"url":'/no_of_sessions_per_user.json'},
    'avgsessionduration' : {"url":'/average_session_duration.json'}
  }

  function constructUrl(req, res, path) {
    res.contentType(configs.get('business:content_type'));

    var url = configs.get('business:business_host') +
      configs.get('business:rest_path') +
          path.url;

    console.log(url);      
    
    return url;
  };

  router.get('/users', function(req, res, next) {

    Promise.join(
      getFetch(req, res, routeConfigs['numofactiveusers']),
      getFetch(req, res, routeConfigs['sessionperuser']),
      getFetch(req, res, routeConfigs['sessionsPerUser']),
      getFetch(req, res, routeConfigs['avgsessionduration']),
      function(res_numofactiveusers, res_sessionperuser, res_sessionsPerUser, res_avgsessionduration) {
        
        var result = {};

        console.log()

        result.numofactiveusers = res_numofactiveusers;
        result.sessionperuser = res_sessionperuser;
        result.sessionsPerUser = res_sessionsPerUser;
        result.avgsessionduration = res_avgsessionduration;

        res.send(JSON.stringify({
          out: result
        }));

      });

  });

  function getFetch(req, res, path) {
    return fetch(constructUrl(req, res, path), {
      method: 'get'
    })
    .then((response) => {
      return response.json();
    })
    .catch((e) => {
      console.error("error in fetching...");
      throw(e);
    })
  }

  return router;

};
