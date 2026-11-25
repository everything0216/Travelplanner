import { useEffect, useState } from "react";
import { getTrips } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

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
    <div className="home-page">
      <div className="home-container">

        {/* Header */}
        <header className="home-header">

          <Link to="/" className="brand">
            <div className="brand-icon">✈</div>
            <div>
              <div className="brand-name">Travel Planner</div>
              <div className="brand-subtitle">Plan less. Travel more.</div>
            </div>
          </Link>

          <div className="home-header-actions">
            {token && user ? (
              <>
                <Link to="/" className="home-nav-link active">
                  Home
                </Link>

                <Link to="/profile" className="home-nav-link profile-icon-link">
                  <svg
                    className="profile-person-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M5 21a7 7 0 0 1 14 0" />
                  </svg>
                  <span>My Profile</span>
                </Link>

                <Link to="/trips/new" className="create-trip-button">
                  <span>＋</span>
                  Create Trip
                </Link>

                <button
                  type="button"
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="login-button">Login</Link>
                <Link to="/register" className="register-button">Register</Link>

                <Link to="/trips/new" className="create-trip-button">
                  <span>＋</span>
                  Create Trip
                </Link>
              </>
            )}
          </div>

        </header>

        {/* Hero */}
        <section className="home-hero">

          <div>
            <span className="hero-label">
              YOUR JOURNEY
            </span>

            <h1>
              Where will you
              <br />
              <span>go next?</span>
            </h1>

            <p>
              Keep your trips, expenses, and travel plans
              <br />
              organized in one beautiful place.
            </p>
          </div>

          <div className="hero-decoration">
            <div className="plane">✈</div>

            <div className="route-line">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="location">📍</div>
          </div>

        </section>

        {/* Trips */}
        <section className="trips-section">

          <div className="section-header">

            <div>
              <span className="section-label">
                COLLECTION
              </span>

              <h2>My Trips</h2>
            </div>

            {!loading && !error && trips.length > 0 && (
              <span className="trip-count">
                {trips.length}{" "}
                {trips.length === 1 ? "trip" : "trips"}
              </span>
            )}

          </div>

          {loading && (
            <div className="state-card">
              <div className="loading-icon">✈️</div>
              <p>Loading your trips...</p>
            </div>
          )}

          {error && (
            <div className="state-card error-card">
              <div className="state-icon">!</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && trips.length === 0 && (
            <div className="empty-card">

              <div className="empty-icon">
                🧳
              </div>

              <h3>
                No trips yet
              </h3>

              <p>
                Your next adventure is waiting.
                <br />
                Create your first trip and start planning.
              </p>

              <Link
                to="/trips/new"
                className="empty-button"
              >
                Create your first trip →
              </Link>

            </div>
          )}

          {!loading && !error && trips.length > 0 && (
            <div className="trip-grid">

              {trips.map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="trip-card"
                >

                  <div className="trip-card-top">

                    <div className="destination-icon">
                      📍
                    </div>

                    <span className="view-trip">
                      View →
                    </span>

                  </div>

                  <div className="trip-card-content">

                    <span className="trip-destination">
                      {trip.destination}
                    </span>

                    <h3>
                      {trip.name}
                    </h3>

                    <div className="trip-details">

                      <div className="trip-detail">
                        <span className="detail-icon">
                          📅
                        </span>

                        <span>
                          {trip.startDate}
                        </span>

                        <span className="date-separator">
                          →
                        </span>

                        <span>
                          {trip.endDate}
                        </span>
                      </div>

                      <div className="trip-detail">
                        <span className="detail-icon">
                          $
                        </span>

                        <span>
                          Budget ${trip.budget}
                        </span>
                      </div>

                    </div>

                  </div>

                  <div className="trip-card-footer">
                    <span>
                      Trip #{trip.id}
                    </span>

                    <span className="arrow">
                      ↗
                    </span>
                  </div>

                </Link>
              ))}

            </div>
          )}

        </section>

      </div>
    </div>
  );
}

export default Home;