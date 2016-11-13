var queryString = require('querystring');
var request = require('request');
var fetch = require("node-fetch");
var Promise = require('bluebird');

module.exports = function(configs) {

  var express = require('express');
  var router = express.Router({mergeParams: true, strict: true});

  var routeConfigs = {
    'numofactiveusers' : {"url":'/no_of_active_users.json',"type":'s'},
    'sessionperuser' : {"url":'/no_of_sessions.json',"type":'s'},
    'sessionsPerUser' : {"url":'/no_of_sessions_per_user.json',"type":'s'},
    'avgsessionduration' : {"url":'/average_session_duration.json',"type":'s'}
  }

  function constructUrl(req, res, path) {
    res.contentType(configs.get('business:content_type'));

    var url = configs.get('business:business_base_url') +
      configs.get('business:rest_path') +
          path.url + '?' +
          "type=" + path.type;
    
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

        result.numofactiveusers = res_numofactiveusers;
        result.sessionperuser = res_sessionperuser;
        result.sessionsPerUser = res_sessionsPerUser;
        result.avgsessionduration = res_avgsessionduration;

        res.send(JSON.stringify({
          out: result
        }));

      });

  });

  function getFetch(req, res, reqObj) {
    return fetch(constructUrl(req, res, reqObj), {
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
