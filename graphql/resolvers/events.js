const Event             =   require("../../model/event")
const {transformEvent}=require("./merge")
const User = require("../../model/user")

module.exports={
    events:async ()=>{
        try{
         const events=await Event.find()
            return events.map(event=>{
                return transformEvent(event)
             });  
        }catch(err){
            throw err;
        }
    },

    createEvent :async(args,req)=>{
        if(!req.isAuth){
            throw new Error("You are not Authorized")
        }
       
           const event = new Event({
                title:args.eventInput.title,
                description:args.eventInput.description,
                price:+args.eventInput.price,
                date:new Date(args.eventInput.date),
                creater:req.decodedToken.userId
           });
           var createdEvent;
           try{
            const result=await event.save();   
            createdEvent =transformEvent(result);
            
            let creater=await User.findById(req.decodedToken.userId);
                if(!creater){
                    throw new Error("user not found")
                 }

             creater.createdEvents.push(event);
             await creater.save();
             
             return createdEvent;
        }catch(err){
            throw err;
        }       

    },
}