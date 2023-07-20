import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import {
  GITHUB_OAUTH2_CLIENT_ID,
  GITHUB_OAUTH2_CLIENT_SECRET,
  BASE_URL,
  PORT,
} from '@/config';
import { UserModel as User } from '@/models/users.model';

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_OAUTH2_CLIENT_ID,
      clientSecret: GITHUB_OAUTH2_CLIENT_SECRET,
      callbackURL: `http://${BASE_URL}:${PORT}/v1/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = new User({
            githubId: profile.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await user.save();
        }

        const userResponseData = {
          _id: user._id,
          githubId: user.githubId,
        };

        return done(null, userResponseData);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
