const Message = require('../models/message');
const User = require('../models/user');
const {body,validationResult} = require('express-validator');


exports.message_list = function(req,res,next){
    Message.find({},(err,messages)=>{
        if(err) return next(err);
        res.render('messages_list',{messages: messages}) 
    });
    
};

exports.message_create_get = function(req,res){
        res.render('message-form',{title:'Create Message'});
}

exports.message_create_post =[
    body('title','The title field is required').trim().isLength({min:3}).escape(),
    body('content','The content field is required').trim().isLength({min:3}).escape(),

    function(req,res,next){
        let errors = validationResult(req);

        let message = new Message({
            title:req.body.title ,
            content : req.body.content,
            timestamp :new Date ,
            user : req.user ,
        });

        if(!errors.isEmpty()){
            res.render('message-form',{title:'Create Message', errors:erros.array() , message : message});
        }
        
        message.save(function(err){
            if(err) return next(err);

            res.redirect('/messages_list',{message:"Message Added Successfully"});
        })
    }
]