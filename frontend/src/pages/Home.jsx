import { useEffect, useState } from "react";
import { getTrips } from "../services/api";
import { Link } from "react-router-dom";

function Home() {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      setError("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>✈️ Travel Planner</h1>

      <h2>My Trips</h2>

      <Link to="/trips/new">
        ＋ Create Trip
    </Link>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && trips.length === 0 && (
        <p>No trips yet.</p>
      )}

      {trips.map((trip) => (
        <div key={trip.id}>
          <h3>{trip.name}</h3>
          <p>{trip.destination}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;