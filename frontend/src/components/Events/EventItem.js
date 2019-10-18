import React from 'react';
import './EventItem.css'

const eventItem =props=>(
 <li key={props.eventId} className="event_list-item">
 <div>
     <h1>{props.title}</h1>
     <h2>${props.price}---{new Date(props.date).toLocaleDateString()}</h2>
     
     </div>
 <div> 
     {props.userId === props.createrId ?(
        <p>you are the creater</p>
        ):(
        <button className="btn" onClick={props.onDetails.bind(this,props.eventId)}>Show Details</button> 
        )} 
 </div>
 </li>
)

export default eventItem;