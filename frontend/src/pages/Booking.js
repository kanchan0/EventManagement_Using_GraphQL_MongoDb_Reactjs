import React,{Component} from 'react';
import AuthContext from '../context/auth-context'
import Spinner from '../components/Spinner/spinner'
import BookingList from '../components/Bookings/BookingList';
import BookingChart from '../components/Bookings/BookingsChart'
import BookingsControl from '../components/Bookings/BookingsControl'

class BookingPage extends Component{
    
    state={
        isLoading:false,
        bookings:[],
        outputType:"list"
    };

static contextType = AuthContext;

    componentDidMount(){
        this.fetchBookings();
    }

    fetchBookings=()=>{
    this.setState({isLoading:true})
        let requestBody11 = {
            query:`query {
                bookings {
                    _id
                    createdAt
                    event{
                      _id
                      title
                      date  
                      price
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
        'Authorization':'Bearer '+this.context.token,
        
    } 
    }).then(res=>{
        
        if(res.status !== 200 && res.status !==201){
            throw new Error('Failed');
        }
        return res.json()
    })
    .then(resData=>{
        const bookings = resData.data.bookings;
        this.setState({bookings:bookings,isLoading:false});
    })
    .catch(err=>{
        console.log(err)
        this.setState({isLoading:false});
    });
};
 
deleteBookingHandler=bookingId=>{

    //another way of writing a query ,inteading of passing 
    //value to the query we can use this named query and oassing the value in variables.

    let requestBody11 = {
        query:`mutation CancelBooking($id:ID!) {
            cancelBooking(bookingId:$id) {
                _id
                title
            }       
        }
        `,
        variables:{
            id:bookingId
        }
    }

    fetch('http://localhost:7000/graphql',{
    method:"POST",
    body:JSON.stringify(requestBody11),
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
        this.setState(prevState=>{
            const updatedBooking=prevState.bookings.filter(booking=>{
                return booking._id===bookingId;
            })
            return {bookings:updatedBooking,isLoading:false};
        });
    })
    .catch(err=>{
        console.log(err)
        this.setState({isLoading:false});
    });
}

changeOutputHandler = outputType=>{
    if(outputType === 'list'){
        this.setState({outputType:'list'})
    }else{
        this.setState({outputType:'chart'})
    }
}

    render(){
        let content=<Spinner />
        if(!this.state.isLoading){
            content=(
                <React.Fragment>
                    <BookingsControl activeOutputType={this.state.outputType} onChange={this.changeOutputHandler}/>
                    <div>
                    {this.state.outputType==='list'?(<BookingList 
                        bookings={this.state.bookings} 
                        onDelete={this.deleteBookingHandler} 
                            />
                        ):(
                            <BookingChart bookings={this.state.bookings}/>
                        )}
                    </div>
                </React.Fragment>
            );
        }
        return<React.Fragment>{content}</React.Fragment>
    }
}

export default BookingPage;