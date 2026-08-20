import { useState } from "react";
import { createTrip } from "../services/api";
import { Link } from "react-router-dom";

function CreateTrip() {

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

    } catch (error) {
        console.error(error);
        alert("Failed to create trip.");
    }
    }

  return (
    <div>
        <Link to="/">
            ← Back to Trips
        </Link>
      <h1>Create Trip</h1>

      <form onSubmit={handleSubmit}>

        <div>
          <label>Trip Name</label>
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
          />
        </div>

        <div>
          <label>Destination</label>
          <input
            value={destination}
            onChange={(event) =>
              setDestination(event.target.value)
            }
          />
        </div>

        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
          />
        </div>

        <div>
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
          />
        </div>

        <div>
          <label>Budget</label>
          <input
            type="number"
            value={budget}
            onChange={(event) =>
              setBudget(event.target.value)
            }
          />
        </div>

        <button type="submit">
          Create Trip
        </button>

      </form>
    </div>
  );
}

export default CreateTrip;