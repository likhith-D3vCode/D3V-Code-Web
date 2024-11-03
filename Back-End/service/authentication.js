const JWT=require("jsonwebtoken");

const secret="Likhith777@"

function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        profileImageUrl:user.profileImg,
        role:user.role
    };
    const token=JWT.sign(payload,secret, { expiresIn: '2d' });
    return token;
}


function validateToken(token){
    const payload=JWT.verify(token,secret)
    return payload;
}


module.exports={createTokenForUser,validateToken}