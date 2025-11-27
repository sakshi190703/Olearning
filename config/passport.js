const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

class PassportConfig {
    constructor() {
        this.configure();
    }

    configure() {
        // Local Strategy
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    return done(null, false, { message: 'No user with that email address' });
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Password incorrect' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }));

        // Serialize user
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        // Deserialize user
        passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (error) {
                done(error);
            }
        });
    }

    initialize() {
        return passport.initialize();
    }

    session() {
        return passport.session();
    }
}

module.exports = new PassportConfig();