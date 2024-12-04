const mongoose=require('mongoose');
const {createHmac,randomBytes}=require("crypto");
const {createTokenForUser}=require("../service/authentication")
const signupUser=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
       type:String,
    },
    password:{
        type:String,
        required:true
    },
   profileImg:{
    type:String,
    default:"../userImages/download.png"                 
   },
   role:{
    type:String,
    enum:["USER","ADMIN"],
    default:"USER"
   },
   phoneNo:{
    type:Number,
    default:"000"
   },
   skils:[
    {
        addskills: { type: String },
    }
   ],
   Education:[
    {
        schoolName:{type:String},
        year:{type:Number},
        score:{type:String},
        place:{type:String}
    }
   ],
},
{timestamps:true}
);

signupUser.pre("save", function(next){
    const user=this;

    if(!user.isModified("password")) return next();

    const salt = randomBytes(16).toString("hex");
    const hashPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");

    user.salt=salt;
    user.password=hashPassword;
    next()
});

signupUser.static("matchedpassword",async function(email,password){
    const user=await this.findOne(({email}));
    if(!user) return null
    const salt=user.salt;
    const hashpassword=user.password;
    const userProvidedHash=createHmac("sha256",salt)
    .update(password)
    .digest("hex");

    if(hashpassword!=userProvidedHash){
        return null;
    }
   
    const token=createTokenForUser(user);
   
    
    return token;
})



const signupmodel=mongoose.model("UserDetails",signupUser);

module.exports=signupmodel