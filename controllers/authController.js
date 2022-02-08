const User = require('../models/user');
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const session =require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

exports.user_signup_get= function(req,res){
    res.render('sign-up-form',{title:'Sign Up'});

}

exports.user_signup_post = [
    body('firstname','First Name is required').trim().isLength({min:3}).escape(),
    body('lastname',"The Last Name field is required").trim().isLength({min: 4}).escape(),
    body('email','The Email field is required').trim().isLength({min:5}).escape(),
    body('password','The password field is required').trim().isLength({min:8}).escape(),
    function(req,res,next){

        const errors = validationResult(req);

bcrypt.hash(req.body.password,12,(err,hashedPassword)=>{
    if(err) return next(err);
    let user = new User({
            
        fullname : req.body.firstname+' '+req.body.lastname,
        email:req.body.email,
        password : hashedPassword
    });

       

        if(!errors.isEmpty){
            res.render("sign-up-form",{title:'Sign Up',user: user, errors:error.array()});
            return;
        }
        else{
            User.find({'email':req.body.email}).exec(function(err,results){
                if(err) return next(err);
                if(results){
                    res.redirect('/sign-up',{message:'User Email Address Already exists'});
                } else{
                    user.save(function(err){
                        if(err) return next(err);
                        res.redirect('/login');
                    })
                }
            });
           
       
        }
    });
    }
]

exports.login = passport.authenticate("local",{successRedirect:"/",

            failureRedirect:"/login"});

exports.logout = function(req,res){
    req.logout();
    res.redirect("/");
}            

passport.use(
    new LocalStrategy((email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return done(null, user)
            } else {
              // passwords do not match!
              return done(null, false, { message: "Incorrect password" })
            }
          })
        return done(null, user);
      });
    })
  );


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


