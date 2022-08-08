/**
 * Authentication middleware
 */


 const auth = require("basic-auth"); //library that parses auth header
 const bcrypt = require("bcryptjs");
 const e = require("express");
 const { User } = require("../models");

 //basic authentication: middleware to authenticate the request

 exports.authenticateUser = async (req, res, next) => {
   let message; //variable to store message

   const credentials = auth(req); //parse the user's credentials (line 8)

   if (credentials) { //checking to see if user's credentials are available
     const user = await User.findOne({
       where: { emailAddress: credentials.name },
     });
     if (user) {//checking to see successful user retrieval
       const authenticated = bcrypt.compareSync(credentials.pass, user.password);
       if (authenticated) {
         console.log(
           `Authentication successful for the username: ${user.emailAddress}`
         );

         req.currentUser = user; //stores the user on the request object
       } else {
         message = `Authentication failure for the username: ${user.emailAddress}`;
       }
     } else {
       message = `User not found for username: ${user.emailAddress}`;
     }
   } else {
     message = `Auth header not found`;
   }
 //when authentication fails a 401 status code is returned
   if (message) {
     console.warn(message);
     res.status(401).json({ message: "Access Denied" });
   } else {
     next();
   }
 };