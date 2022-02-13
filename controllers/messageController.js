const Message = require('../models/message');
const User = require('../models/user');
const {body,validationResult} = require('express-validator');
const async = require('async');


exports.index = function(req,res,next){
   /*  async.parallel({
        messages : function(callback){
            Message.find({}).populate('user').exec(callback);
        },
        user: function(callback){
            User.findById(res.locals.currentUser).exec(callback);
        }
    },function(err,results){
        if(err) return next(err);
        res.render('index',{messages:results.messages , user: results.user})
    }) */


    Message.find({}).populate('user').exec((err,messages)=>{
        if(err) return next(err);
      
        res.render('index',{messages: messages,user: res.locals.currentUser}); 
    });
    
};

exports.message_create_get = function(req,res){
    if(!res.locals.currentUser){
        res.redirect('/login');
    }
 // console.log(res.locals.currentUser);
    res.render('message-form',{title:'Create Message',user: res.locals.currentUser});
       
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
            user : res.locals.currentUser ,
        });

        if(!errors.isEmpty()){
            res.render('message-form',{title:'Create Message', errors:errors.array() , message : message});
        }
        
        message.save(function(err){
            if(err) return next(err);

            res.redirect('/');
        })
    }
]

exports.message_update_get = function (req,res,next){
    if(!res.locals.currentUser){
        res.redirect('/login');
    }


    Message.findById(req.params.id, function(err,message){
        if(err) return next(err);
        if(message == null){
            let error = new Error("Message Not found");
            error.status = 404;
            return next(error);
        }else{
            res.render('message-form',{title:'Update Message',message:message,user: res.locals.currentUser});
        }
    });
   
}

exports.message_update_post = [
    body('title','The title field is required').trim().isLength({min:3}).escape(),
    body('content','The content field is required').trim().isLength({min:3}).escape(),

    function(req,res,next){
        console.log(req.params.id)
        let errors = validationResult(req);
        
        let message = new Message({
            _id: req.params.id,
            title:req.body.title ,
            content : req.body.content,
            timestamp :new Date ,
            user : req.body.user_id,
        });
        

        if(!errors.isEmpty()){
            res.render('message-form',{title:'Update Message', errors:errors.array() , message : message});
        }
        Message.findByIdAndUpdate(req.params.id,message,{},function(err){
            if(err) return next(err);
            res.redirect('/');
            return;
        })
    }
]

exports.delete_post =function(req,res,next){
    
    Message.findByIdAndDelete(req.body.message_id,function(err){
        if(err) return next(err);
        res.redirect('/')
    })
}

exports.delete_get = function(req,res,next){
    if(!res.locals.currentUser){
        res.redirect('/login');
    }
    Message.findById(req.body.message_id).populate('user').exec(function(err, message){
        if(err) return next(err);
        if(message == null){
            let error = new Error("Message Not Found");
            error.status = 404;
            return next(error);
        }
        res.render('message_delete',{title:'Delete Message', message:message});
    });
}