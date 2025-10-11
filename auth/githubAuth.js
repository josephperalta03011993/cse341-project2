const passport = require("passport");
const { Strategy: GitHubStrategy } = require("passport-github2");
const { ObjectId } = require("mongodb");
const connectDB = require("../db/connection");

// --- GitHub OAuth Setup ---
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const db = await connectDB();
        const users = db.collection("users");

        // Check if user already exists
        let user = await users.findOne({ githubId: profile.id });

        if (!user) {
          // Create new user if not found
          const newUser = {
            githubId: profile.id,
            username: profile.username,
            email: profile.emails?.[0]?.value || null,
            createdAt: new Date(),
          };

          const result = await users.insertOne(newUser);
          user = { _id: result.insertedId, ...newUser };
        }

        return done(null, user);
      } catch (err) {
        console.error("GitHub Auth Error:", err);
        return done(err, null);
      }
    }
  )
);

// --- Session Serialization ---
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --- Export Passport ---
module.exports = passport;
