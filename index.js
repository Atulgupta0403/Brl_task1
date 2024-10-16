require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
const passport = require("passport")
const session = require("express-session")
const cookieParser = require("cookie-parser")
app.use(cookieParser()) 

app.use(cors({
  origin: "*"
}))

const Notes = require("./Routes/notes")
const register = require("./Routes/register")
const login = require("./Routes/login")
const logout = require("./Routes/logout")

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<a href='/auth/google'> Login with google </a>")
})


// =====================================================================================================

const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(
  new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile)
    }
  )
);

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.get("/auth/google/",
  passport.authenticate("google", { scope: ["profile", "email"] })
)


app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile")
  }
)

app.get("/profile", (req, res) => {
  res.send(`<h1>Welcome ${req.user.displayName} </h1>`)
})


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++







app.use("/api/notes", Notes);
app.use("/register", register)
app.use("/login", login)
app.use("/logout", logout)

app.get("/cookie" , (req,res) => {
  res.send(req.cookies)
})


app.listen(3000);