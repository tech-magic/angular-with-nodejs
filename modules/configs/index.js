/**
*
*
* Use default configuration file to initiate configurations.
*
* When it is required to add environment specific configurations this module
* uses seperate file to override any configurations given in
* the default configuration file. Please mention the overriding file name
* in the default configuration file with the key "overrideProfile".
*
* config.local.json is a sample configurations override.
*
*/
var nconf = require('nconf');
var default_nconf_options = require('../../config.default.json');

var overrideProfile = default_nconf_options.overrideProfile;

if(overrideProfile){
	var overriden_nconf_options = require('../../'+overrideProfile);
    nconf.add('user',{ type: 'literal', store: overriden_nconf_options } );
}

nconf.add('global',{ type: 'literal', store: default_nconf_options } );

module.exports = nconf;
