const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema =new Schema({
    username:{type:String ,required:true},
    fullname:{type:String , required:true},
    password:{type:String , required:true},
    membership_status :{type:Boolean  ,default:false},
    isAdmin :{type:Boolean , default: false}
});

module.exports = mongoose.model('User', userSchema);