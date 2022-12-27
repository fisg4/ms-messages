const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || 'secret';

passport.use(
  new JwtStrategy(opts, ((jwtPayload, done) => done(null, true)))
);

module.exports = passport;
