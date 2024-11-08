const express=require("express");
const AuthenticationRouter=express.Router();

AuthenticationRouter.get("/api/check-auth", (req, res) => {
    const token = req.cookies.token; 
    if (token) {
      res.json({ isAuthenticated: true });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  module.exports=AuthenticationRouter;