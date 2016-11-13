var LocalStrategy = require('passport-local').Strategy;

module.exports = function(configs, passport) {
    var authEndPoint = configs.get('services:security:auth');

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and deserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        return done(null, user);
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'
    passport.use('local', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true,
            session: true
        }, 
        function(request, username, password, done) {
            console.log('Reaches the passport auth callback !!!!');
            if(username == "wimal") {
                return done(null, { "username" : "wimal", "tenant" : "halebop" }, { message: 'Login successful.' });
            } else {
                return done(null, false, { message: 'Login Not Successful.' });
            }
        })
    );
};