 const mongoose = require('mongoose');
 const {Schema} = mongoose;
const {DateTime} = require("luxon");

 const postSchema = new Schema({
     title :{type:String , required:true},
     content :{type:String , required:true},
     timestamp :{type: Date, required:true},
    user:{type:Schema.Types.ObjectId , ref:'User', required:true}
 });

postSchema.virtual('url').get(function(){
    return '/message/'+this._id;
})
 postSchema.virtual('timestamp_formatted').get(function(){
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
 })

module.exports = mongoose.model('Post', postSchema);