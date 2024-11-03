const {validateToken}=require("../service/authentication");

function authenticationCheck(req,res,next){
    const token=req.cookies.token;
   
    try{
          const user=validateToken(req.cookies.token);
        if(user){
            req.user=user;
            return next();
        }else{
            return res.json({msg:"User is not authenticated "})
        }
      } catch(error){
        console.error("error in middleware:",error);
        return res.json({mag:"error in middleware"})
      }
}

module.exports={authenticationCheck}