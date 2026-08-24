import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateTrip from "./pages/CreateTrip";
import TripDetail from "./pages/TripDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;