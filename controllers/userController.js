const User = require('../models/user');
const {body,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

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
            User.findOne({'email':req.body.email}).exec(function(err,results){
                if(err) return next(err);
                if(results){
                    res.redirect('/sign-up',{message:'User Email Found '});
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
exports.login = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  });
  

exports.membership_form_get = function(req,res){
    res.render('membership-form',{title:'Become A Member'});
}

exports.membership_form_post =[
    body('user_id').trim().isLength({min:3}).escape(),
    body('passcode','The passcode field is required').trim().isLength({min:8}).escape(),

    function(req,res,next){
        let error = validationResult(req);
        if(!error.isEmpty()){
            res.render('membership-form',{title:'Become A Member', error:error.array()});
        }else{
            User.updateOne({_id:req.body.user_id}, {$set:{'membership_status':'active'}}).exec(function(err){
                if(err) return next(err);
                res.redirect('/member');
            })
        }


    }
]

exports.admin_form_get =function(req,res){
    res.render('admin-form',{title:'Become An Admin'});
}

exports.admin_form_post = [
    body('user_id').trim().isLength({min:3}).escape(),
    body('passcode',"The passcode field is required ").trim().isLength({min:8}).escape(),

    function(req,res,next){
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('admin-form',{title:'Become an Admin'});
        }else{
            User.update({_id : req.body.user_id},{$set:{'isAdmin' :true}}).exec(function(err){
                if(err) return next(err);

                res.redirect('/admin');
            });
        }
    }
]