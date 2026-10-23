const API_BASE_URL = "http://localhost:8080/api";

async function request(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}


// =========================
// Trips
// =========================

export async function getTrips() {
  return request(`${API_BASE_URL}/trips`);
}

export async function getTrip(tripId) {
  return request(`${API_BASE_URL}/trips/${tripId}`);
}

export async function createTrip(trip) {
  return request(`${API_BASE_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });
}


// =========================
// Members
// =========================

export async function getMembers(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/members`
  );
}

export async function addMember(tripId, member) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/members`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    }
  );
}

export async function deleteMember(tripId, memberId) {
  await request(
    `${API_BASE_URL}/trips/${tripId}/members/${memberId}`,
    {
      method: "DELETE",
    }
  );
}


// =========================
// Expenses
// =========================

export async function getExpenses(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/expenses`
  );
}

export async function createExpense(tripId, expense) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/expenses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expense),
    }
  );
}


// =========================
// Settlement
// =========================

export async function getSettlements(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/settlement`
  );
}


// =========================
// Itinerary
// =========================

export async function getItineraries(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/itineraries`
  );
}

export async function createItinerary(
  tripId,
  itinerary
) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/itineraries`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itinerary),
    }
  );
}

export async function updateItinerary(
  tripId,
  itineraryId,
  itinerary
) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/itineraries/${itineraryId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itinerary),
    }
  );
}

export async function deleteItinerary(
  tripId,
  itineraryId
) {
  await request(
    `${API_BASE_URL}/trips/${tripId}/itineraries/${itineraryId}`,
    {
      method: "DELETE",
    }
  );
}

// =========================
// Flights
// =========================

export async function getFlights(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/flights`
  );
}

export async function createFlight(tripId, flight) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/flights`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flight),
    }
  );
}

export async function updateFlight(tripId, flightId, flight) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/flights/${flightId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flight),
    }
  );
}

export async function deleteFlight(tripId, flightId) {
  await request(
    `${API_BASE_URL}/trips/${tripId}/flights/${flightId}`,
    {
      method: "DELETE",
    }
  );
}


 // =========================
 // Memos
 // =========================

export async function getMemos(tripId) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/memos`
  );
}

export async function createMemo(tripId, memo) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/memos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memo),
    }
  );
}

export async function updateMemo(tripId, memoId, memo) {
  return request(
    `${API_BASE_URL}/trips/${tripId}/memos/${memoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(memo),
    }
  );
}

export async function deleteMemo(tripId, memoId) {
  await request(
    `${API_BASE_URL}/trips/${tripId}/memos/${memoId}`,
    {
      method: "DELETE",
    }
  );
}
