import { useState, useEffect } from 'react';
import TripList from '../components/TripList';


const TripOverviewPage = () => {
  // const [trips, setTrips] = useState([]);
  //
  // useEffect(() => {
  //   const fetchTrips = async () => {
  //     const response = await axios.get('/api/trips');
  //     setTrips(response.data);
  //   };
  //   fetchTrips();
  // }, []);

  return <TripList  />;
};

export default TripOverviewPage;
