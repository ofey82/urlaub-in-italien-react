import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { getTrips, createTrip } from '../api/api';
import { format, isValid } from 'date-fns';

const API_URL = 'http://localhost:8080/';


const TripList = () => {

  const [trips, setTrips] = useState([]);

  useEffect(() => {
    getTrips()
        .then(data => {
          const sortedTrips = data.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
          setTrips(sortedTrips);
        })
        .catch(error => console.error('Error fetching trips:', error));
  }, []);

  const handleCreateTrip = async () => {
    try {
      const newTrip = await createTrip({
        title: 'New Trip',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        participants: "Alone",
        coverPhoto: ''
      });
      setTrips([...trips, newTrip]);
      //onSelectTrip(newTrip);
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  const formatDateStart = (date) => {
    return isValid(new Date(date)) ? format(new Date(date), 'dd.MM.') : 'Invalid Date';
  };

  const formatDateEnd = (date) => {
    return isValid(new Date(date)) ? format(new Date(date), 'dd.MM.yy') : 'Invalid Date';
  };

  return (
    <div className="trips-list-container">
      <div className="trips-header">
        <h1>Your Trips</h1>
        <button onClick={handleCreateTrip} className="add-trip">Add New Trip</button>
      </div>
      <div className="trips-list">
        {trips.map(trip => (
            <Link to={`/trip/${trip.id}`} key={trip.id} className="trip-item">
              <div className="trip-content">
                <div className="trip-info">
                  <h2>{trip.title}</h2>
                  <span className="list-trip-period">{formatDateStart(trip.startDate)} - {formatDateEnd(trip.endDate)}</span>
                </div>
                <div className="trip-cover-photo-container">
                  {trip.coverPhoto && (
                      <img src={`${API_URL}${trip.coverPhoto}`} alt={`${trip.title} cover`} className="trip-cover-photo"/>
                  )}
                </div>
              </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default TripList;
