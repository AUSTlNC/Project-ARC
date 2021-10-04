var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done)=> {
    done(null, user.id);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})

passport.use(new GoogleStrategy({
    clientID: '332517929733-f0js8e6icoi41pci1aijttmin1r5s72p.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: "http://localhost:3001/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    cb(null, profile);
  }
));
