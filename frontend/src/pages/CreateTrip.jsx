import { useState } from "react";
import { createTrip } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/CreateTrip.css";

function CreateTrip() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const trip = {
        name,
        destination,
        startDate,
        endDate,
        budget: Number(budget),
      };

      const result = await createTrip(trip);

      console.log("Trip created:", result);

      alert("Trip created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create trip.");
    }
  }

  return (
    <div className="create-trip-page">

      <div className="create-trip-wrapper">

        <Link to="/" className="back-link">
          ← Back to Trips
        </Link>

        <div className="create-trip-layout">

          {/* 左側介紹 */}
          <div className="create-trip-intro">

            <div className="intro-badge">
              ✦ TRAVEL PLANNER
            </div>

            <h1>
              Your next
              <br />
              <span>adventure</span>
              <br />
              starts here.
            </h1>

            <p>
              Create a trip, invite your friends,
              track expenses, and enjoy the journey
              without worrying about the details.
            </p>

            <div className="intro-decoration">
              <span>✈</span>
              <span>•</span>
              <span>🌍</span>
              <span>•</span>
              <span>📍</span>
            </div>

          </div>

          {/* 右側表單 */}
          <div className="create-trip-card">

            <div className="card-header">
              <div>
                <span className="card-label">
                  NEW TRIP
                </span>

                <h2>
                  Plan your trip
                </h2>
              </div>

              <div className="card-icon">
                ✈
              </div>
            </div>

            <form
              className="create-trip-form"
              onSubmit={handleSubmit}
            >

              <div className="form-group">
                <label>
                  Trip name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Iceland Adventure"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Destination
                </label>

                <div className="input-with-icon">
                

                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(event) =>
                      setDestination(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="date-section">

                <div className="form-group">
                  <label>
                    Start date
                  </label>

                  <input
                    type="date"
                    value={startDate}
                    onChange={(event) =>
                      setStartDate(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="date-arrow">
                  →
                </div>

                <div className="form-group">
                  <label>
                    End date
                  </label>

                  <input
                    type="date"
                    value={endDate}
                    onChange={(event) =>
                      setEndDate(event.target.value)
                    }
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>
                  Budget
                </label>

                <div className="budget-input">
                  <span className="currency">
                    $
                  </span>

                  <input
                    type="number"
                    placeholder="50,000"
                    min="0"
                    value={budget}
                    onChange={(event) =>
                      setBudget(event.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="create-trip-button"
              >
                <span>
                  Create Trip
                </span>

                <span className="button-arrow">
                  →
                </span>
              </button>

            </form>

            <p className="form-footer">
              You can add members and expenses after
              creating your trip.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CreateTrip;