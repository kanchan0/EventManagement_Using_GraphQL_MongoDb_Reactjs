const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    
    const authHeader = req.get("Authorization")
    if(!authHeader){
        req.isAuth=false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if(!token || token==' '){
        req.isAuth=false;
        return next();
    }
    var decodedToken;
    try{
     decodedToken=jwt.verify(token,"someothrsecretkey")  

    }catch(err){
        req.isAuth=false;
        return next();

    }
    if(!decodedToken){
        req.isAuth=false;
        return next();
    }
    
    req.isAuth=true;
    req.decodedToken=decodedToken;
    next();
}