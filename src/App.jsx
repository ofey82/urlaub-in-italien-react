import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TripOverviewPage from './pages/TripOverviewPage';
import TripDetailPage from './pages/TripDetailPage';


const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<TripOverviewPage />} />
          <Route path="/trip/:id" element={<TripDetailPage />} />
          <Route path="/new-trip" element={<TripDetailPage />} />
        </Routes>
      </Router>
  );
};

export default App;




//
// import TripList from './components/TripList';
// import TripDetail from './components/TripDetail';
// import './styles/App.css';
//
// const App = () => {
//   const [selectedTrip, setSelectedTrip] = useState(null);
//
//   return (
//       <div className="app">
//         {selectedTrip ? (
//             <TripDetail tripId={selectedTrip.id} />
//         ) : (
//             <TripList onSelectTrip={setSelectedTrip} />
//         )}
//       </div>
//   );
// };
//
// export default App;
