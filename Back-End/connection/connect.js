const mongoose=require("mongoose");

async function connectToThemongodb(url){
    return mongoose.connect(url);
}

module.exports={connectToThemongodb}