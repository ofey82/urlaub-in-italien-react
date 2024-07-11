import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { getTrips, createTrip } from '../api/api';

const TripList = () => {

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getTrips().then(data => setTrips(data)).catch(error => console.error('Error fetching trips:', error));
  }, []);

  const handleCreateTrip = async () => {
    try {
      const newTrip = await createTrip({
        title: 'Neuer Trip',
        description: '',
        period: '',
        participants: [],
        coverPhoto: ''
      });
      setTrips([...trips, newTrip]);
      //onSelectTrip(newTrip);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  return (
  <div className="trips-container">
    <div className="header">
      <h1>Trips</h1>
      <button onClick={handleCreateTrip} className="add-trip">Add</button>
    </div>
    <div className="trip-list">
      {trips.map(trip => (
          <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-item">
            <div className="trip-info">
              <h2>{trip.title}</h2>
              {trip.period && <p>{trip.period}</p>}
            </div>
            <div className="trip-arrow">
              <span>&gt;</span>
            </div>
          </Link>
      ))}
    </div>
  </div>
);

  // return (
  //     <div>
  //       <h1>Trips</h1>
  //       <button onClick={handleCreateTrip}>Neuen Trip anlegen</button>
  //       <div className="trip-list">
  //         {trips.map((trip) => (
  //             <div key={trip.id} className="trip">
  //               <h2>{trip.title}</h2>
  //               <Link to={`/trip/${trip.id}`}>Details ansehen</Link>
  //             </div>
  //         ))}
  //       </div>
  //     </div>
  // );
};

export default TripList;


// import { useState, useEffect } from 'react';
// import { getTrips, createTrip } from '../api/api';
//
// const TripList = ({ onSelectTrip }) => {
//   const [trips, setTrips] = useState([]);
//
//   useEffect(() => {
//     getTrips().then(data => setTrips(data)).catch(error => console.error('Error fetching trips:', error));
//   }, []);
//
//   const handleCreateTrip = async () => {
//     try {
//       const newTrip = await createTrip({
//         title: 'Neuer Trip',
//         description: '',
//         period: '',
//         participants: [],
//         coverPhoto: ''
//       });
//       setTrips([...trips, newTrip]);
//       onSelectTrip(newTrip);
//     } catch (error) {
//       console.error('Error creating trip:', error);
//     }
//   };
//
//   return (
//       <div className="trip-list">
//         <button onClick={handleCreateTrip}>Neuen Trip anlegen</button>
//         {trips.map(trip => (
//             <div key={trip.id} onClick={() => onSelectTrip(trip)}>
//               <img src={trip.coverPhoto} alt={trip.title} />
//               <h2>{trip.title}</h2>
//             </div>
//         ))}
//       </div>
//   );
// };
//
// export default TripList;
