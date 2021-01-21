const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgramSchema = new Schema({
  heading : { type : String, required : true},
  code : {type : String, required : true},
  date : {type : Date, required : true},
  language : {type : String, required : true},
  public : {type:Boolean,required:true,default:false},
  stared : {type:Boolean,required:true,default:false},
  userId : {type:Schema.Types.ObjectId,ref:"User",required:true}
});

module.exports = mongoose.model("Program",ProgramSchema);