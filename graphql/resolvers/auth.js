const User              =   require("../../model/user")
const bcrypt            =   require("bcrypt")
const jwt               =   require("jsonwebtoken")

module.exports={
   
    createUser:async(args)=>{
       try{
        const existinguser=await User.findOne({email:args.userInput.email})
            if(existinguser){
                throw new Error("User exists alredy");
            }
            const hashedPassword=await bcrypt.hash(args.userInput.password,12)
            const user = new User({
                email:args.userInput.email,
                password:hashedPassword
            });
            const result=await user.save()  
    
            return { 
                ...result._doc
                ,password:null,
                 _id:result._id 
                };
           
        }catch(err){
            throw err;
        }     
    },

    
    login : async ({ email,password }) => {

        const user = await User.findOne({email:email});
        if(!user){
            throw new Error("User does not exist")
        }
        const isEqual = await bcrypt.compare(password,user.password); 
        if(!isEqual){
            throw new Error("Password incorrect")
        }

       const token = jwt.sign(
           {userId:user.id,email:user.email},
           "someothrsecretkey",
           {
            expiresIn:'1h'      

            });
        return {userId:user.id,token:token,tokenExpiration:1}
    },
};