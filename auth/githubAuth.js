const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const connectDB = require("../db/connection");

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    let user = await users.findOne({ githubId: profile.id });
    if (!user) {
      const newUser = {
        githubId: profile.id,
        username: profile.username,
        email: profile.emails?.[0]?.value || null,
        createdAt: new Date()
      };
      const result = await users.insertOne(newUser);
      user = { _id: result.insertedId, ...newUser };
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new require("mongodb").ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
