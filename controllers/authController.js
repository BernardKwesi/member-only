const User = require('../models/user');
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const passport = require('passport');


exports.user_signup_get= function(req,res){
    res.render('sign-up-form',{title:'Sign Up'});

}

exports.user_signup_post = [
    body('firstname','First Name is required').trim().isLength({min:3}).escape(),
    body('lastname',"The Last Name field is required").trim().isLength({min: 4}).escape(),
    body('username','The Email field is required').trim().isLength({min:5}).escape(),
    body('password','The password field is required').trim().isLength({min:8}).escape(),
    function(req,res,next){

        const errors = validationResult(req);


    
    let user = new User({   
        fullname : req.body.firstname+' '+req.body.lastname,
        username:req.body.username,
        password : req.body.password
    });

       

        if(!errors.isEmpty){
            res.render("sign-up-form",{title:'Sign Up',user: user, errors:error.array()});
            return;
        }
        else{
            User.find({'username':req.body.username}).exec(function(err,results){
                if(err) return next(err);
                if(results.length > 0){
                  console.log(results)
                    res.render('sign-up-form',{title:'Sign Up', message:'User Email Address Already exists'});
                } else{
                    user.save(function(err){
                        if(err) return next(err);
                        res.redirect('/login');
                    })
                }
            });
           
       
        }
    
    }
]

exports.login_get=function(req,res){
  res.render('login-form',{title:'Login'})
}

exports.login_post =   passport.authenticate("local", {
  successRedirect: "/message/create",
  failureRedirect: "/"
});
exports.logout = function(req,res){
    req.logout();
    res.redirect("/");
}            



