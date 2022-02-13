const User = require('../models/user');
const {body,validationResult} = require('express-validator');
require('dotenv').config();
  

exports.membership_get = function(req,res){
    if(!res.locals.currentUser){
        res.redirect('/login');
    }
    res.render('membership-form',{title:'Become A Member',user:res.locals.currentUser});
}

exports.membership_post =[
    
    body('passcode','The passcode field is required').trim().isLength({min:2}).escape(),

    function(req,res,next){
        let error = validationResult(req);
        if(!error.isEmpty()){
            res.render('membership-form',{title:'Become A Member', error:error.array()});
        }
        if(req.body.passcode !== process.env.MEMBER_PASSCODE){
            res.render('membership-form',{title:'Become A Member', message:"Invalid Passcode, Try Again"});
        }
        else{
            User.updateOne({_id:res.locals.currentUser}, {$set:{'membership_status': true}}).exec(function(err){
                if(err) return next(err);
                res.redirect('/');
            })
        }


    }
]

exports.admin_get =function(req,res){
    if(!res.locals.currentUser){
        res.redirect('/login');
    }
    res.render('admin-form',{title:'Become An Admin',user:res.locals.currentUser});
}

exports.admin_post = [
    
    body('passcode',"The passcode field is required ").trim().isLength({min:2}).escape(),

    function(req,res,next){
        let errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('admin-form',{title:'Become an Admin'});
        }
        if(req.body.passcode !== process.env.ADMIN_PASSCODE){
            res.render("admin-form",{title:'Become An Admin',message :"Invalid Admin Passcode"});            
        }
        else{
            User.updateOne({_id : res.locals.currentUser},{$set:{'isAdmin' :true}}).exec(function(err){
                if(err) return next(err);

                res.redirect('/');
            });
        }
    }
]