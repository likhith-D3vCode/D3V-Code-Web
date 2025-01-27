const {validateToken}=require("../service/authentication");

function authenticationCheck(req,res,next){
    // const token=req.cookies.token;
    const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

   
    try{
          const user=validateToken(token);
        if(user){
            req.user=user;
            return next();
        }else{
            return res.json({msg:"User is not authenticated "})
        }
      } catch(error){
        console.error("error in middleware:");
        return res.json({mag:"error in middleware"})
      }
}

module.exports={authenticationCheck}