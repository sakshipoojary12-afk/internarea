const mongoose=require("mongoose");

const resumeSchema=new mongoose.Schema({

student:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},

name:String,

email:String,

phone:String,

qualification:String,

experience:String,

skills:[String],

photo:String,

resumeUrl:String

});


module.exports=mongoose.model("Resume",resumeSchema);