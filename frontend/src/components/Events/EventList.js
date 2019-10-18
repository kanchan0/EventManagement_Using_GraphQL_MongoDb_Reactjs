import React from 'react';
import EventItem from "./EventItem"
import './EventList.css';


const eventList = props=>{
   const events = props.events.map(event=>{
    return (
    <EventItem 
    key={event._id} 
    eventId={event._id} 
    title={event.title} 
    userId={props.authUserId}
    price={event.price}
    date={event.date}
    createrId={event.creater._id}
    onDetails={props.onViewDetail}
    />
    );
});

   return <ul className="events_list"> {events}  </ul>
};

export default eventList;