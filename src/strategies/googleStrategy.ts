import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  GOOGLE_OAUTH2_CLIENT_ID,
  GOOGLE_OAUTH2_CLIENT_SECRET,
  BASE_URL,
  PORT,
} from '@/config';
import { UserModel as User } from '@/models/users.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH2_CLIENT_SECRET,
      callbackURL: `http://${BASE_URL}:${PORT}/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await user.save();
        }

        const userResponseData = {
          _id: user._id,
          googleId: user.googleId,
        };

        return done(null, userResponseData);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
