const API_BASE_URL = "http://localhost:8080/api";

export async function getTrips() {
  const response = await fetch(`${API_BASE_URL}/trips`);

  if (!response.ok) {
    throw new Error("Failed to fetch trips");
  }

  return response.json();
}

export async function createTrip(trip) {
  const response = await fetch(`${API_BASE_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });

  if (!response.ok) {
    throw new Error("Failed to create trip");
  }

  return response.json();
}