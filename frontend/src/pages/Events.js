import React,{Component} from 'react';
import './Events.css'
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import AuthContext from '../context/auth-context'
import EventList from "../components/Events/EventList";
import Spinner from "../components/Spinner/spinner";



class EventsPage extends Component{
   state={
       creating:false,
       events:[],
       isLoading:false,
       selectedEvents:null
   };

   isActive=true;
   static contextType = AuthContext;

   constructor (props){
       super(props);
       this.titleElRef = React.createRef();
       this.priceElRef = React.createRef();
       this.dateElRef = React.createRef();
       this.descriptionElRef = React.createRef()
       
   }

  componentDidMount(){
      this.fetchEvents();
  }

   startCreatingHandler=()=>{
       this.setState({creating:true});
   }
   
   modalConfirmHandler =()=>{
    this.setState({creating:false});
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if( title.trim().length===0||
        price<=0||
        date.trim().length===0||
        description.trim().length===0
        ){
            return;
        }

    const event = {title,price,date,description}
    console.log(event)
    
    let requestBody = {
            query:`mutation {
                createEvent(eventInput: {title:"${title}",description:"${description}",price:${price},date:"${date}"}) {
                    _id
                    title
                    description
                    date
                    price
                }
            }`
        }

const token =this.context.token;
console.log("token",token)

    fetch('http://localhost:7000/graphql',{
       method:"POST",
       body:JSON.stringify(requestBody),
       headers:{
           'Content-Type':'application/json',
           'Authorization':'Bearer '+token
       } 
    }).then(res=>{
        
        if(res.status !== 200 && res.status !==201){
            throw new Error('Failed');
        }
        return res.json()
    })
    .then(resData=>{
        //this.fetchEvents();
        this.setState(prevState =>{

            const updatedEvents=[...prevState.events];
            updatedEvents.push({

                _id:resData.data.createEvent._id,
                title:resData.data.createEvent.title,
                description:resData.data.createEvent.description,
                date:resData.data.createEvent.date,
                price:resData.data.createEvent.price,
                creater :{ 
                    _id:this.context.userId
                }
            });
        return {events:updatedEvents};
        })
        
    })
    .catch(err=>{
        console.log(">>>>>>>>>>>>>>>",err)
    })


   };

   modalCancelHandler=()=>{
    this.setState({creating:false,selectedEvents:null});
   }

   fetchEvents(){
            this.setState({isLoading:true})
            let requestBody11 = {
                query:`query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creater { 
                            _id
                            email
                        }
                        
                    }
                }
                `
                
            }

        fetch('http://localhost:7000/graphql',{
        method:"POST",
        body:JSON.stringify(requestBody11),
        headers:{
            'Content-Type':'application/json',
            
        } 
        }).then(res=>{
            
            if(res.status !== 200 && res.status !==201){
                throw new Error('Failed');
            }
            return res.json()
        })
        .then(resData=>{
            const events = resData.data.events;
           if(this.isActive){
            this.setState({events:events,isLoading:false});
           }
        })
        .catch(err=>{
            console.log(err)
            if(this.isActive){
            this.setState({isLoading:false});
            }
        })

  }
   
showDetailsHandler=eventId=>{
    this.setState(prevState=>{
        const selectedEvents=prevState.events.find(e=>e._id===eventId);
        return {selectedEvents: selectedEvents}
    })
}

bookEventHandler=()=>{
    if(!this.context.token){
        this.setState({selectedEvents:null})
        return;
    }
    let requestBody1 = {
        query:`
        mutation{
            bookEvent(eventId: "${this.state.selectedEvents._id}") {
                _id
                createdAt
                updatedAt
            }
        }
        `
    }

fetch('http://localhost:7000/graphql',{
method:"POST",
body:JSON.stringify(requestBody1),
headers:{
    'Content-Type':'application/json',
    'Authorization':'Bearer '+this.context.token,
    
} 
}).then(res=>{
    
    if(res.status !== 200 && res.status !==201){
        throw new Error('Failed');
    }
    return res.json()
})
.then(resData=>{
   console.log(resData)
   this.setState({selectedEvents:null})
})
.catch(err=>{
    console.log(err)
})

}
componentWillUnmount(){
    this.isActive=false;
}

    render(){
    
        return(
            <React.Fragment>
               {(this.state.creating || this.state.selectedEvents) 
                && <Backdrop />} 
                {this.state.creating && 
                <Modal 
                title="Add Event" 
                canCancel 
                canConfirm 
                onCancel={this.modalCancelHandler} 
                onConfirm={this.modalConfirmHandler}
                confirmText='Confirm'
                >
                    
                    <form >
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" ref={this.dateElRef}/>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionElRef}/>
                        </div>
                    </form>
                </Modal>}

                {this.state.selectedEvents && (
                    <Modal 
                    title={this.state.selectedEvents.title} 
                    canCancel 
                    canConfirm
                     onCancel={this.modalCancelHandler} 
                     onConfirm={this.bookEventHandler}
                     confirmText={this.context.token?'Book':'Confirm'}
                     >
                         <h1>{this.state.selectedEvents.title}</h1>
                         <h2>${this.state.selectedEvents.price}---{new Date(this.state.selectedEvents.date).toLocaleDateString()}</h2>
                         <p> {this.state.selectedEvents.description}</p>
                </Modal>)

                }
                {this.context.token && (
                    <div className="events-control">
                        <p>Share your Event Details</p>
                        <button className="btn" onClick={this.startCreatingHandler}> Create Event</button>
                    </div>
                )}
                {this.state.isLoading ? (
                  <Spinner />
                ):(
                 <EventList 
                 events={this.state.events} 
                 authUserId={this.context.userId} 
                 onViewDetail={this.showDetailsHandler}
                 />

                )
            }
            
            </React.Fragment>
        )
    }
}

export default EventsPage;