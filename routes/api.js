var queryString = require('querystring');
var request = require('request');
var express = require('express');

module.exports = function(configs) {

	var router = express.Router({mergeParams: true, strict: true});

  var routeConfigs = {
    'listallcities' : {"url":'/filters/list_all_cities.json'},
    'listalldevices' : {"url":'/filters/list_all_devices.json'}
  }

	function constructUrl(req, res, path) {
		res.contentType(configs.get('business:content_type'));

		var url = configs.get('business:business_host') +
          configs.get('business:rest_path') +
          path.url;

    console.log(url);      
    
    return url;
	};

  router.get('/:infoFilter', function(req, res, next) {
    var url = constructUrl(req, res, routeConfigs[req.params.infoFilter]);
    var counter = 0;

    var requestProcessor = function(error, response, body) {
		
		if (!error && response.statusCode === 200) {
      var bodyParse = JSON.parse(body);
        res.send(JSON.stringify({
          out: bodyParse
        }));
      } else {
        if(counter < 3) {
          counter++;
          request(url, requestProcessor);
        } else {
          res.status(404).send(JSON.stringify({
            out: false,
            error: "No data found!"
          }));
        }
      }
    };

    request(url, requestProcessor);

  });

	return router;

};
