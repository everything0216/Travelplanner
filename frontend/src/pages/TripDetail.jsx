import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getTrip,
  getMembers,
  addMember,
  deleteMember,
  getExpenses,
  createExpense,
  getSettlements,
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getFlights,
  createFlight,
  updateFlight,
  deleteFlight,
  getMemos,
  createMemo,
  updateMemo,
  deleteMemo,
  uploadTripPhoto,
  getTripPhotos,
  deletePhoto,
  getPhotoImage,
} from "../services/api";
import "../styles/TripDetail.css";

function TripDetail() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileNickname, setProfileNickname] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);

  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState("");
  const [paidByMemberId, setPaidByMemberId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);

  const [settlements, setSettlements] = useState([]);

  const [itineraries, setItineraries] = useState([]);

  const [itineraryDate, setItineraryDate] = useState("");
  const [itineraryTime, setItineraryTime] = useState("");
  const [itineraryLocation, setItineraryLocation] = useState("");
  const [itineraryMapsUrl, setItineraryMapsUrl] = useState("");
  const [itineraryNote, setItineraryNote] = useState("");
  const [itineraryCost, setItineraryCost] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [showItineraryForm, setShowItineraryForm] = useState(false);
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);

  // Photos
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoCaption, setPhotoCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUrls, setPhotoUrls] = useState({});

  

  const emptyFlight = {
    segment: "Outbound",
    airline: "",
    flightNumber: "",
    departureAirport: "",
    arrivalAirport: "",
    departureTime: "",
    arrivalTime: "",
    bookingReference: "",
    bookingUrl: "",
    note: "",
  };

  const [flights, setFlights] = useState([]);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [editingFlightId, setEditingFlightId] = useState(null);
  const [flightForm, setFlightForm] = useState(emptyFlight);
  
  const [memos, setMemos] = useState([]);
  const [showMemoForm, setShowMemoForm] = useState(false);
  const [editingMemoId, setEditingMemoId] = useState(null);

  const emptyMemo = {
    title: "",
    content: "",
    completed: false,
  };

  const [memoForm, setMemoForm] = useState({ ...emptyMemo });
    

  const [loading, setLoading] = useState(true);

  // Dashboard statistics

  // Trip duration
  const tripDuration =
    trip?.startDate && trip?.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(trip.endDate) - new Date(trip.startDate)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  // Total budget
  const totalBudget = Number(trip?.budget ?? 0);

  // Total expenses
  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount ?? 0),
    0
  );

  // Remaining budget
  const remainingBudget = totalBudget - totalExpenses;

  // Budget usage percentage
  const budgetUsage =
    totalBudget > 0
      ? Math.round((totalExpenses / totalBudget) * 100)
      : 0;

  // Memo statistics
  const completedMemoCount = memos.filter(
    (memo) => memo.completed
  ).length;

  const pendingMemoCount = memos.length - completedMemoCount;

  useEffect(() => {
      loadTrip();
      loadMembers();
      loadExpenses();
      loadSettlements();
      loadItineraries();
      loadFlights();
      loadMemos();
      loadPhotos();
  }, [tripId]);

  useEffect(() => {
  let isMounted = true;
  const objectUrls = [];

  async function loadPhotoImages() {
    try {
      const urlEntries = await Promise.all(
        photos.map(async (photo) => {
          const blob = await getPhotoImage(photo.id);
          const url = URL.createObjectURL(blob);

          objectUrls.push(url);

          return [photo.id, url];
        })
      );

      if (isMounted) {
        setPhotoUrls(Object.fromEntries(urlEntries));
      }
    } catch (error) {
      console.error("Error loading photo images:", error);
    }
  }

  if (photos.length > 0) {
    loadPhotoImages();
  } else {
    setPhotoUrls({});
  }

  return () => {
    isMounted = false;
    objectUrls.forEach((url) => URL.revokeObjectURL(url));
  };
}, [photos]);

  async function loadTrip() {
    try {
      const data = await getTrip(tripId);
      setTrip(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function loadMembers() {
    try {
      const data = await getMembers(tripId);
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadMemos() {
  try {
    const data = await getMemos(tripId);
    setMemos(data);
  } catch (error) {
    console.error("Error loading memos:", error);
  }
}




function handleMemoInputChange(event) {
  const { name, value } = event.target;

  setMemoForm((prev) => ({
    ...prev,
    [name]: value,
  }));
}

function resetMemoForm() {
  setMemoForm({ ...emptyMemo });
  setEditingMemoId(null);
  setShowMemoForm(false);
}

function handleEditMemo(memo) {
  setEditingMemoId(memo.id);
  setMemoForm({
    title: memo.title || "",
    content: memo.content || "",
    completed: memo.completed ?? false,
  });
  setShowMemoForm(true);
}

async function handleSaveMemo(event) {
  event.preventDefault();

  try {
    if (editingMemoId) {
      await updateMemo(tripId, editingMemoId, memoForm);
    } else {
      await createMemo(tripId, memoForm);
    }

    await loadMemos();
    resetMemoForm();
  } catch (error) {
    console.error("Error saving memo:", error);
    alert(`儲存 Memo 失敗：${error.message}`);
  }
}

async function handleDeleteMemo(memoId) {
  if (!window.confirm("確定要刪除這則備忘錄嗎？")) {
    return;
  }

  try {
    await deleteMemo(tripId, memoId);
    await loadMemos();
  } catch (error) {
    console.error("Error deleting memo:", error);
    alert(`刪除 Memo 失敗：${error.message}`);
  }
}

  async function handleToggleMemo(memo) {
    try {
      await updateMemo(tripId, memo.id, {
        title: memo.title,
        content: memo.content,
        completed: !memo.completed,
      });

      await loadMemos();
    } catch (error) {
      console.error("Error updating memo:", error);
      alert(`更新 Memo 失敗：${error.message}`);
    }
  }

  async function loadPhotos() {
  try {
    const data = await getTripPhotos(tripId);
    setPhotos(data);
  } catch (error) {
    console.error("Error loading photos:", error);
  }
}

  async function handlePhotoUpload(event) {
  event.preventDefault();

  if (!selectedFile) {
    alert("Please select a photo first.");
    return;
  }

  try {
    setUploadingPhoto(true);

    await uploadTripPhoto(
      tripId,
      selectedFile,
      photoCaption
    );

    await loadPhotos();

    setSelectedFile(null);
    setPhotoCaption("");

    // Reset file input
    event.target.reset();

    alert("Photo uploaded successfully!");
  } catch (error) {
    console.error("Error uploading photo:", error);
    alert(`Photo upload failed: ${error.message}`);
  } finally {
    setUploadingPhoto(false);
  }
}

async function handleDeletePhoto(photoId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this photo?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deletePhoto(photoId);
    await loadPhotos();

    alert("Photo deleted successfully!");
  } catch (error) {
    console.error("Error deleting photo:", error);
    alert(`Failed to delete photo: ${error.message}`);
  }
}

  async function loadFlights() {
    try {
      const data = await getFlights(tripId);
      setFlights(data);
    } catch (error) {
      console.error("Error loading flights:", error);
    }
  }

  async function loadExpenses() {
    try {
      const data = await getExpenses(tripId);
      setExpenses(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadItineraries() {
    try {
      const data = await getItineraries(tripId);
      setItineraries(data);
    } catch (error) {
      console.error(error);
    }
  }

  

  async function handleAddMember(event) {
    event.preventDefault();

    try {
      const newMember = await addMember(tripId, {
        name: memberName,
        email: memberEmail,
      });

      setMembers((prev) => [...prev, newMember]);

      setMemberName("");
      setMemberEmail("");
    } catch (error) {
      console.error(error);
      alert("Failed to add member.");
    }
  }

  const handleDeleteMember = async (memberId) => {
  const confirmed = window.confirm(
    "Are you sure you want to remove this member?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteMember(tripId, memberId);

    setMembers((prevMembers) =>
      prevMembers.filter(
        (member) => member.id !== memberId
      )
    );
  } catch (error) {
    console.error(
      "Failed to delete member:",
      error
    );

    alert("Failed to remove member.");
  }
};

  async function handleCreateItinerary(event) {
    event.preventDefault();

    try {
      const itinerary = {
        date: itineraryDate,
        time: itineraryTime,
        location: itineraryLocation,
        googleMapsUrl: itineraryMapsUrl,
        note: itineraryNote,
        cost: itineraryCost
          ? Number(itineraryCost)
          : 0,
      };

      const newItinerary =
        await createItinerary(
          tripId,
          itinerary
        );

      setItineraries((prev) => [
        ...prev,
        newItinerary,
      ]);

      setItineraryDate("");
      setItineraryTime("");
      setItineraryLocation("");
      setItineraryMapsUrl("");
      setItineraryNote("");
      setItineraryCost("");

      setShowItineraryForm(false);

    } catch (error) {
      console.error(error);
      alert("Failed to create itinerary.");
    }
  }

  function handleFlightInputChange(event) {
  const { name, value } = event.target;

  setFlightForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditFlight(flight) {
    setEditingFlightId(flight.id);

    setFlightForm({
      segment: flight.segment || "Outbound",
      airline: flight.airline || "",
      flightNumber: flight.flightNumber || "",
      departureAirport: flight.departureAirport || "",
      arrivalAirport: flight.arrivalAirport || "",
      departureTime: flight.departureTime?.slice(0, 16) || "",
      arrivalTime: flight.arrivalTime?.slice(0, 16) || "",
      bookingReference: flight.bookingReference || "",
      bookingUrl: flight.bookingUrl || "",
      note: flight.note || "",
    });

    setShowFlightForm(true);
  }

  function resetFlightForm() {
    setFlightForm({ ...emptyFlight });
    setEditingFlightId(null);
    setShowFlightForm(false);
  }

  async function handleSaveFlight(event) {
    event.preventDefault();

    const flightData = {
      ...flightForm,
      departureTime: flightForm.departureTime || null,
      arrivalTime: flightForm.arrivalTime || null,
    };

    try {
      if (editingFlightId) {
        await updateFlight(tripId, editingFlightId, flightData);
      } else {
        await createFlight(tripId, flightData);
      }

      await loadFlights();
      resetFlightForm();
    } catch (error) {
      console.error("Error saving flight:", error);
      alert(`儲存航班失敗：${error.message}`);
    }
  }

  async function handleDeleteFlight(flightId) {
    if (!window.confirm("確定要刪除這筆航班資訊嗎？")) {
      return;
    }

    try {
      await deleteFlight(tripId, flightId);
      await loadFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
      alert(`刪除航班失敗：${error.message}`);
    }
  }

    const handleUpdateItinerary = async (event) => {
    event.preventDefault();

    try {
      const updatedItinerary =
        await updateItinerary(
          tripId,
          editingItineraryId,
          {
            date: itineraryDate,
            time: itineraryTime,
            location: itineraryLocation,
            googleMapsUrl: itineraryMapsUrl,
            note: itineraryNote,
            cost: itineraryCost
              ? Number(itineraryCost)
              : 0,
          }
        );

      setItineraries((prev) =>
        prev.map((item) =>
          item.id === editingItineraryId
            ? updatedItinerary
            : item
        )
      );

      setEditingItineraryId(null);
      setShowItineraryForm(false);

      setItineraryDate("");
      setItineraryTime("");
      setItineraryLocation("");
      setItineraryMapsUrl("");
      setItineraryNote("");
      setItineraryCost("");

    } catch (error) {
      console.error(
        "Failed to update itinerary:",
        error
      );

      alert("Failed to update activity.");
    }
  };

const handleEditItinerary = (itinerary) => {
  setEditingItineraryId(itinerary.id);

  setItineraryDate(itinerary.date || "");
  setItineraryTime(itinerary.time?.slice(0, 5) || "");
  setItineraryLocation(itinerary.location || "");
  setItineraryMapsUrl(itinerary.googleMapsUrl || "");
  setItineraryNote(itinerary.note || "");
  setItineraryCost(itinerary.cost ?? "");

  setShowItineraryForm(true);
};

const handleDeleteItinerary = async (itineraryId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this activity?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteItinerary(
      tripId,
      itineraryId
    );

    setItineraries((prev) =>
      prev.filter(
        (item) => item.id !== itineraryId
      )
    );

  } catch (error) {
    console.error(
      "Failed to delete itinerary:",
      error
    );

    alert("Failed to delete activity.");
  }
};
const handleCreateExpense = async (event) => {
  event.preventDefault();

  try {
    await createExpense(tripId, {
      description,
      amount: Number(amount),
      date: expenseDate,
      paidByMemberId: Number(paidByMemberId),
      participantIds,
    });

    // 重新載入費用列表
    await loadExpenses();

    // 清空表單
    setDescription("");
    setAmount("");
    setExpenseDate("");
    setPaidByMemberId("");
    setParticipantIds([]);

  } catch (error) {
    console.error("Failed to create expense:", error);
    alert("Failed to create expense. Please try again.");
  }
};

  async function loadSettlements() {
  try {
    const data = await getSettlements(tripId);
    setSettlements(data);
  } catch (error) {
    console.error(error);
  }
}

  function handleParticipantChange(memberId) {
    if (participantIds.includes(memberId)) {
      setParticipantIds(
        participantIds.filter((id) => id !== memberId)
      );
    } else {
      setParticipantIds([
        ...participantIds,
        memberId,
      ]);
    }
  }

  function getMemberName(memberId) {
    const member = members.find(
      (member) => member.id === memberId
    );

    return member ? member.name : "Unknown";
  }

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (!trip) {
    return <p className="loading">Trip not found.</p>;
  }

  const getTripDates = () => {
  if (!trip?.startDate || !trip?.endDate) {
    return [];
  }

  const dates = [];

  const currentDate = new Date(`${trip.startDate}T00:00:00`);
  const endDate = new Date(`${trip.endDate}T00:00:00`);

  while (currentDate <= endDate) {
    const date = currentDate.toISOString().split("T")[0];

    dates.push(date);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const tripDates = getTripDates();

const selectedDate = tripDates[selectedDay];

const selectedItineraries = itineraries
  .filter((itinerary) => itinerary.date === selectedDate)
  .sort((a, b) =>
    (a.time || "").localeCompare(b.time || "")
  );

  return (
    <div className="trip-detail">

      {/* Back */}
      <Link to="/" className="back-link">
        ← Back to Trips
      </Link>

            {/* Trip Header */}
      <div className="trip-header">
        <div>
          <h1>{trip.name}</h1>

          <div className="trip-info">
            <span>📍 {trip.destination}</span>

            <span>
              📅 {trip.startDate} ~ {trip.endDate}
            </span>

            <span>
              💰 Budget: ${trip.budget}
            </span>
          </div>
        </div>
      </div>

      {/* Feature Tabs */}
      <div className="trip-tabs">


        <button
          className={activeSection === "overview" ? "active" : ""}
          onClick={() => setActiveSection("overview")}
        >
          📊 Overview
        </button>

        <button
          className={activeSection === "members" ? "active" : ""}
          onClick={() => setActiveSection("members")}
        >
          👥 Members
        </button>

        <button
          className={activeSection === "memos" ? "active" : ""}
          onClick={() => setActiveSection("memos")}
        >
          Memo
        </button>

        <button
          type="button"
          className={activeSection === "flights" ? "active" : ""}
          onClick={() => setActiveSection("flights")}
        >
          ✈️ Flights
        </button>

        <button
          className={activeSection === "itinerary" ? "active" : ""}
          onClick={() => setActiveSection("itinerary")}
        >
          🗓️ Itinerary
        </button>

        
        <button
          className={activeSection === "expenses" ? "active" : ""}
          onClick={() => setActiveSection("expenses")}
        >
          💰 Expenses
        </button>

        <button
          className={activeSection === "settlement" ? "active" : ""}
          onClick={() => setActiveSection("settlement")}
        >
          💸 Settlement
        </button>

        <button
          className={activeSection === "photos" ? "active" : ""}
          onClick={() => setActiveSection("photos")}
        >
          📸 Photos
        </button>

      </div>

      {/* Overview */}
{activeSection === "overview" && (
  <section className="section overview-section">
    <div className="section-header">
      <div>
        <h2>📊 Trip Overview</h2>
        <p className="section-description">
          Your trip at a glance
        </p>
      </div>
    </div>

    {/* Trip Statistics */}
    <div className="overview-grid">
      <div className="overview-card">
        <div className="overview-card-icon">📅</div>
        <div className="overview-card-label">Trip Duration</div>
        <div className="overview-card-value">
          {tripDuration} {tripDuration === 1 ? "day" : "days"}
        </div>
        <div className="overview-card-description">
          {trip.startDate} – {trip.endDate}
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-icon">👥</div>
        <div className="overview-card-label">Travel Members</div>
        <div className="overview-card-value">
          {members.length}
        </div>
        <div className="overview-card-description">
          {members.length === 1 ? "member" : "members"} joining
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-icon">🗓️</div>
        <div className="overview-card-label">Itinerary</div>
        <div className="overview-card-value">
          {itineraries.length}
        </div>
        <div className="overview-card-description">
          Planned activities
        </div>
      </div>

      <div className="overview-card">
        <div className="overview-card-icon">✈️</div>
        <div className="overview-card-label">Flights</div>
        <div className="overview-card-value">
          {flights.length}
        </div>
        <div className="overview-card-description">
          Saved flight segments
        </div>
      </div>
    </div>

    {/* Budget Overview */}
    <div className="overview-budget-card">
      <div className="overview-budget-header">
        <div>
          <h3>💰 Budget Overview</h3>
          <p className="section-description">
            Track your travel expenses
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection("expenses")}
        >
          View Expenses →
        </button>
      </div>

      <div className="overview-budget-grid">
        <div>
          <div className="overview-card-label">Total Budget</div>
          <div className="overview-money">
            ${totalBudget.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="overview-card-label">Total Expenses</div>
          <div className="overview-money">
            ${totalExpenses.toLocaleString()}
          </div>
        </div>

        <div>
          <div className="overview-card-label">Remaining Budget</div>
          <div
            className={`overview-money ${
              remainingBudget < 0 ? "over-budget" : ""
            }`}
          >
            ${remainingBudget.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="overview-progress-info">
        <span>Budget used</span>
        <span>{budgetUsage}%</span>
      </div>

      <div
        className="overview-progress-track"
        role="progressbar"
        aria-label="Budget used"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.min(budgetUsage, 100)}
      >
        <div
          className={`overview-progress-fill ${
            budgetUsage > 100 ? "over-budget" : ""
          }`}
          style={{
            width: `${Math.min(budgetUsage, 100)}%`,
          }}
        />
      </div>

      {totalBudget === 0 ? (
        <p className="overview-budget-note">
          No budget set for this trip yet.
        </p>
      ) : budgetUsage > 100 ? (
        <p className="overview-budget-note over-budget">
          You have exceeded your budget by $
          {Math.abs(remainingBudget).toLocaleString()}.
        </p>
      ) : (
        <p className="overview-budget-note">
          {budgetUsage}% of your budget has been used.
        </p>
      )}
    </div>

    {/* Memo Overview */}
    <div className="overview-memo-card">
      <div className="overview-memo-header">
        <div>
          <h3>📝 Travel Memos</h3>
          <p className="section-description">
            Keep track of your travel notes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection("memos")}
        >
          View Memos →
        </button>
      </div>

      <div className="overview-memo-stats">
        <div>
          <span className="overview-memo-number">
            {pendingMemoCount}
          </span>
          <span>Pending</span>
        </div>

        <div>
          <span className="overview-memo-number">
            {completedMemoCount}
          </span>
          <span>Completed</span>
        </div>
      </div>
    </div>
  </section>
)}

      {/* Members */}
      {activeSection === "members" && (
  <section className="section">

        <div className="section-header">
          <div>
            <h2>👥 Members</h2>
            <p className="section-description">
              People joining this trip
            </p>
          </div>
        </div>

        {members.length === 0 ? (
          <p className="empty-message">
            No members yet.
          </p>
        ) : (
          <div className="member-list">
            {members.map((member) => (
              <div
                className="member-card"
                key={member.id}
              >
                <div className="member-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <div className="member-name">
                    {member.name}
                  </div>

                  <div className="member-email">
                    {member.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="remove-member-button"
                  onClick={() => handleDeleteMember(member.id)}
                  title={`Remove ${member.name}`}
                >
                  −
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Member */}
        <form
          className="form"
          onSubmit={handleAddMember}
        >
          <h3>Add Member</h3>

          <div className="form-row">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="e.g. Alice"
                value={memberName}
                onChange={(event) =>
                  setMemberName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="e.g. alice@gmail.com"
                value={memberEmail}
                onChange={(event) =>
                  setMemberEmail(event.target.value)
                }
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="primary-button"
          >
            ＋ Add Member
          </button>
        </form>

      </section>
      )}

      
{activeSection === "memos" && (
  <div className="memo-section">
    <div className="memo-header">
      <div>
        <h2>Travel Memo</h2>
        <p>Keep your travel plans and important notes in one place.</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setMemoForm({ ...emptyMemo });
          setEditingMemoId(null);
          setShowMemoForm((prev) => !prev);
        }}
      >
        {showMemoForm ? "Close" : "+ Add Memo"}
      </button>
    </div>

    {showMemoForm && (
      <form className="memo-form" onSubmit={handleSaveMemo}>
        <label htmlFor="memo-title">Title</label>
        <input
          id="memo-title"
          name="title"
          value={memoForm.title}
          onChange={handleMemoInputChange}
          placeholder="e.g. Things to bring"
          required
        />

        <label htmlFor="memo-content">Content</label>
        <textarea
          id="memo-content"
          name="content"
          value={memoForm.content}
          onChange={handleMemoInputChange}
          placeholder="Write down your travel notes..."
          rows={5}
        />

        <div className="memo-form-actions">
          <button type="submit">
            {editingMemoId ? "Save Changes" : "Create Memo"}
          </button>
          <button type="button" onClick={resetMemoForm}>
            Cancel
          </button>
        </div>
      </form>
    )}

    <div className="memo-list">
      {memos.length === 0 ? (
        <div className="memo-empty">
          <h3>No memos yet</h3>
          <p>Add a memo to keep important travel information handy.</p>
        </div>
      ) : (
        memos.map((memo) => (
          <article
            key={memo.id}
            className={`memo-card ${memo.completed ? "completed" : ""}`}
          >
            <div className="memo-card-content">
              <label className="memo-completed">
                <input
                  type="checkbox"
                  checked={memo.completed}
                  onChange={() => handleToggleMemo(memo)}
                />
                <span>{memo.title}</span>
              </label>

              {memo.content && (
                <p className="memo-content">{memo.content}</p>
              )}
            </div>

            <div className="memo-card-actions">
              <button
                type="button"
                onClick={() => handleEditMemo(memo)}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMemo(memo.id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  </div>
)}


      {activeSection === "flights" && (
  <section className="section flight-section">
    <div className="section-header">
      <h2>✈️ Flight Information</h2>

      <button
        type="button"
        className="primary-button"
        onClick={() => {
          if (showFlightForm) {
            resetFlightForm();
          } else {
            setFlightForm({ ...emptyFlight });
            setEditingFlightId(null);
            setShowFlightForm(true);
          }
        }}
      >
        {showFlightForm ? "Cancel" : "+ Add Flight"}
      </button>
    </div>

    {showFlightForm && (
      <form className="form flight-form" onSubmit={handleSaveFlight}>
        <div className="form-row">
          <div className="form-group">
            <label>Flight Type</label>
            <select
              name="segment"
              value={flightForm.segment}
              onChange={handleFlightInputChange}
            >
              <option value="Outbound">Outbound</option>
              <option value="Transfer">Transfer</option>
              <option value="Return">Return</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Airline</label>
            <input
              name="airline"
              value={flightForm.airline}
              onChange={handleFlightInputChange}
              placeholder="e.g. Finnair"
            />
          </div>

          <div className="form-group">
            <label>Flight Number</label>
            <input
              name="flightNumber"
              value={flightForm.flightNumber}
              onChange={handleFlightInputChange}
              placeholder="e.g. AY100"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Departure Airport</label>
            <input
              name="departureAirport"
              value={flightForm.departureAirport}
              onChange={handleFlightInputChange}
              placeholder="e.g. TPE"
              required
            />
          </div>

          <div className="form-group">
            <label>Arrival Airport</label>
            <input
              name="arrivalAirport"
              value={flightForm.arrivalAirport}
              onChange={handleFlightInputChange}
              placeholder="e.g. HEL"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Departure Time</label>
            <input
              type="datetime-local"
              name="departureTime"
              value={flightForm.departureTime}
              onChange={handleFlightInputChange}
            />
          </div>

          <div className="form-group">
            <label>Arrival Time</label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={flightForm.arrivalTime}
              onChange={handleFlightInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Booking Reference</label>
            <input
              name="bookingReference"
              value={flightForm.bookingReference}
              onChange={handleFlightInputChange}
              placeholder="Booking reference"
            />
          </div>

          <div className="form-group">
            <label>Booking URL</label>
            <input
              type="url"
              name="bookingUrl"
              value={flightForm.bookingUrl}
              onChange={handleFlightInputChange}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="note"
            value={flightForm.note}
            onChange={handleFlightInputChange}
            placeholder="Baggage allowance, check-in notes..."
          />
        </div>

        <button type="submit" className="primary-button">
          {editingFlightId ? "Save Changes" : "Save Flight"}
        </button>
      </form>
    )}

    <div className="flight-list">
      {flights.length === 0 ? (
        <p className="empty-state">
          No flight information yet. Add your first flight!
        </p>
      ) : (
        flights.map((flight) => (
          <article className="flight-card" key={flight.id}>
            <div className="flight-card-header">
              <span className="flight-segment">{flight.segment}</span>
              <div className="flight-actions">
                <button
                  type="button"
                  onClick={() => handleEditFlight(flight)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteFlight(flight.id)}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="flight-route">
              <div>
                <strong>{flight.departureAirport}</strong>
                <p>{flight.departureTime?.replace("T", " ").slice(0, 16) || "Time not set"}</p>
              </div>

              <div className="flight-route-line">
                <span>✈</span>
              </div>

              <div>
                <strong>{flight.arrivalAirport}</strong>
                <p>{flight.arrivalTime?.replace("T", " ").slice(0, 16) || "Time not set"}</p>
              </div>
            </div>

            <div className="flight-details">
              {flight.airline && <p>Airline: {flight.airline}</p>}
              {flight.flightNumber && <p>Flight: {flight.flightNumber}</p>}
              {flight.bookingReference && (
                <p>Booking Reference: {flight.bookingReference}</p>
              )}
              {flight.bookingUrl && (
                <p>
                  <a
                    href={flight.bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Booking Website ↗
                  </a>
                </p>
              )}
              {flight.note && <p>Notes: {flight.note}</p>}
            </div>
          </article>
        ))
      )}
    </div>
  </section>
)}

      {/* Expenses */}
{activeSection === "expenses" && (
  <section className="section">

        <div className="section-header">
          <div>
            <h2>💰 Expenses</h2>

            <p className="section-description">
              Track and split your trip expenses
            </p>
          </div>
        </div>

        {/* Add Expense */}
        <form
          className="form"
          onSubmit={handleCreateExpense}
        >
          <h3>Add Expense</h3>

          <div className="form-row">

            <div className="form-group">
              <label>Description</label>

              <input
                type="text"
                placeholder="e.g. Dinner"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                placeholder="e.g. 2000"
                min="0"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                required
              />
            </div>

          </div>

          <div className="form-row">

            <div className="form-group">
              <label>Date</label>

              <input
                type="date"
                value={expenseDate}
                onChange={(event) =>
                  setExpenseDate(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Paid By</label>

              <select
                value={paidByMemberId}
                onChange={(event) => {
                  const memberId = Number(event.target.value);

                  setPaidByMemberId(event.target.value);

                  if (memberId) {
                    setParticipantIds([memberId]);
                  } else {
                    setParticipantIds([]);
                  }
                }}
                required
              >
                <option value="">
                  Select member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>Split Between</label>

            <div className="participant-list">

              {members.map((member) => (
                <label
                  className="participant"
                  key={member.id}
                >
                  <input
                    type="checkbox"
                    checked={participantIds.includes(
                      member.id
                    )}
                    onChange={() =>
                      handleParticipantChange(
                        member.id
                      )
                    }
                  />

                  <span>{member.name}</span>
                </label>
              ))}

            </div>
          </div>

          <button
            type="submit"
            className="primary-button"
          >
            ＋ Add Expense
          </button>

        </form>

        {/* Expense List */}
        <div className="expense-list">

          {expenses.length === 0 ? (
            <p className="empty-message">
              No expenses yet.
            </p>
          ) : (
            expenses.map((expense) => (
              <div
                className="expense-card"
                key={expense.id}
              >
                <div>
                  <div className="expense-description">
                    {expense.description}
                  </div>

                  <div className="expense-meta">
                    {expense.date}
                    {" · "}
                    Paid by{expense.paidBy?.name}
                  </div>
                </div>

                <div className="expense-amount">
                  ${expense.amount}
                </div>
              </div>
            ))
          )}

        </div>

      </section>
    )}  
      {activeSection === "settlement" && (
  <section className="section">

        <div className="section-header">
            <div>
            <h2>💸 Settlement</h2>

            <p className="section-description">
                Here's how everyone can settle up
            </p>
            </div>
        </div>

        {settlements.length === 0 ? (

            <div className="settlement-empty">
            <div className="settlement-icon">
                🎉
            </div>

            <p>
                Everyone is settled up!
            </p>
            </div>

        ) : (

            <div className="settlement-list">

            {settlements.map((settlement, index) => (

                <div
                className="settlement-card"
                key={index}
                >

                <div className="settlement-members">

                    <span className="settlement-person">
                    {settlement.fromMemberName}
                    </span>

                    <span className="settlement-arrow">
                    →
                    </span>

                    <span className="settlement-person">
                    {settlement.toMemberName}
                    </span>

                </div>

                <div className="settlement-amount">
                    ${settlement.amount.toFixed(2)}
                </div>

                </div>

            ))}

            </div>

        )}
 </section>
)}
        {/* Itinerary */}


{activeSection === "itinerary" && (

<section className="section">

  <div className="section-header">
    <h2>Itinerary</h2>

    <button
      type="button"
      className="primary-button"
      onClick={() => setShowItineraryForm(!showItineraryForm)}
    >
      {showItineraryForm ? "✕ Cancel" : "＋ Add Activity"}
    </button>
  </div>


  {/* Day Selector */}

  {tripDates.length > 0 && (
  <div className="day-selector">

    <label htmlFor="day-select">
      Select Day
    </label>

    <select
      id="day-select"
      value={selectedDay}
      onChange={(event) => {
        setSelectedDay(Number(event.target.value));
        setShowItineraryForm(false);
      }}
    >
      {tripDates.map((date, index) => {

        const dateObject = new Date(`${date}T00:00:00`);

        return (
          <option
            key={date}
            value={index}
          >
            Day {index + 1} ·{" "}
            {dateObject.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </option>
        );

      })}
    </select>

  </div>
)}


  {/* Selected Day */}

  {selectedDate && (
    <div className="selected-day-title">

      <h3>
        Day {selectedDay + 1}
      </h3>

      <span>
        {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
          }
        )}
      </span>

    </div>
  )}


  {/* Add Itinerary Form */}

  {showItineraryForm && (
    <form
  className="form"
  onSubmit={
    editingItineraryId
      ? handleUpdateItinerary
      : handleCreateItinerary
  }
>
  <h3>
    {editingItineraryId
      ? "Edit Activity"
      : "Add Activity"}
  </h3>

      <div className="form-row">

        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={itineraryDate}
            onChange={(event) =>
              setItineraryDate(event.target.value)
            }
            required
          />
        </div>


        <div className="form-group">
          <label>Time</label>

          <input
            type="time"
            value={itineraryTime}
            onChange={(event) =>
              setItineraryTime(event.target.value)
            }
            required
          />
        </div>

      </div>


      <div className="form-group">
        <label>Location</label>

        <input
          type="text"
          placeholder="e.g. Blue Lagoon"
          value={itineraryLocation}
          onChange={(event) =>
            setItineraryLocation(event.target.value)
          }
          required
        />
      </div>


      <div className="form-group">
        <label>Google Maps Link</label>

        <input
          type="url"
          placeholder="https://maps.google.com/..."
          value={itineraryMapsUrl}
          onChange={(event) =>
            setItineraryMapsUrl(event.target.value)
          }
        />
      </div>


      <div className="form-group">
        <label>Note</label>

        <input
          type="text"
          placeholder="e.g. Remember to bring swimsuit"
          value={itineraryNote}
          onChange={(event) =>
            setItineraryNote(event.target.value)
          }
        />
      </div>


      <div className="form-group">
        <label>Cost</label>

        <input
          type="number"
          placeholder="e.g. 120"
          min="0"
          step="0.01"
          value={itineraryCost}
          onChange={(event) =>
            setItineraryCost(event.target.value)
          }
        />
      </div>


      <button
  type="submit"
  className="primary-button"
>
  {editingItineraryId
    ? "Save Changes"
    : "＋ Add Activity"}
</button>

{editingItineraryId && (
  <button
    type="button"
    className="secondary-button"
    onClick={() => {
      setEditingItineraryId(null);
      setShowItineraryForm(false);

      setItineraryDate("");
      setItineraryTime("");
      setItineraryLocation("");
      setItineraryMapsUrl("");
      setItineraryNote("");
      setItineraryCost("");
    }}
  >
    Cancel
  </button>
)}

    </form>
  )}


  {/* Itinerary List */}

<div className="itinerary-list">

  {selectedItineraries.length === 0 ? (

    <p className="empty-message">
      No activities planned for this day.
    </p>

  ) : (

    selectedItineraries.map((itinerary) => (

      <div
        className="itinerary-card"
        key={itinerary.id}
      >

        <div className="itinerary-time">
          {itinerary.time?.slice(0, 5)}
        </div>


        <div className="itinerary-content">

          <div className="itinerary-location">
            {itinerary.location}
          </div>


          {itinerary.note && (
            <div className="itinerary-note">
              📝 {itinerary.note}
            </div>
          )}


          {itinerary.googleMapsUrl && (
            <a
              href={itinerary.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              🗺️ Open in Google Maps →
            </a>
          )}

        </div>


        <div className="itinerary-cost">
          ${Number(itinerary.cost || 0).toFixed(2)}
        </div>


        {/* Edit / Delete */}

        <div className="itinerary-actions">

          <button
            type="button"
            className="edit-button"
            onClick={() => handleEditItinerary(itinerary)}
          >
            ✏ Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeleteItinerary(itinerary.id)}
          >
            🗑 Delete
          </button>

        </div>

      </div>

    ))

  )}

</div>

</section>
)}

{activeSection === "photos" && (
  <section className="photos-section">
    <div className="section-header">
      <div>
        <h2>📸 Travel Photos</h2>
        <p>Keep your favorite memories from this trip.</p>
      </div>
    </div>

    {/* Upload Form */}
    <form
      className="photo-upload-form"
      onSubmit={handlePhotoUpload}
    >
      <h3>Upload a Photo</h3>

      <div className="form-group">
        <label>Select Photo</label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(event) =>
            setSelectedFile(event.target.files?.[0] || null)
          }
          required
        />
      </div>

      <div className="form-group">
        <label>Caption</label>
        <input
          type="text"
          placeholder="Add a caption..."
          value={photoCaption}
          onChange={(event) =>
            setPhotoCaption(event.target.value)
          }
        />
      </div>

      <button type="submit" disabled={uploadingPhoto}>
        {uploadingPhoto ? "Uploading..." : "Upload Photo"}
      </button>
    </form>

    {/* Photo Gallery */}
    <div className="photo-gallery">
      <h3>Your Photos</h3>

      {photos.length === 0 ? (
        <p className="empty-photos">
          No photos yet. Upload your first travel memory!
        </p>
      ) : (
        <div className="photo-grid">
          {photos.map((photo) => (
            <div className="photo-card" key={photo.id}>
              {photoUrls[photo.id] && (
                <img
                  src={photoUrls[photo.id]}
                  alt={photo.caption || "Travel photo"}
                  onClick={() => setSelectedPhoto(photo)}
                  className="gallery-photo"
                />
              )}

              <div className="photo-card-info">
                <p>{photo.caption || "Untitled photo"}</p>

                <button
                  type="button"
                  className="delete-photo-btn"
                  onClick={() => handleDeletePhoto(photo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
  
)}
{selectedPhoto && (
  <div
    className="photo-lightbox"
    onClick={() => setSelectedPhoto(null)}
  >
    <div
      className="photo-lightbox-content"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={() => setSelectedPhoto(null)}
      >
        ×
      </button>
      {photos.length > 1 && (
        <button
          type="button"
          className="lightbox-nav prev"
          onClick={() => {
            const currentIndex = photos.findIndex(
              (photo) => photo.id === selectedPhoto.id
            );

            const prevIndex =
              (currentIndex - 1 + photos.length) % photos.length;

            setSelectedPhoto(photos[prevIndex]);
          }}
        >
          ‹
        </button>
      )}
      <img
        src={photoUrls[selectedPhoto.id]}
        alt={selectedPhoto.caption || "Travel photo"}
      />
      {photos.length > 1 && (
        <button
          type="button"
          className="lightbox-nav next"
          onClick={() => {
            const currentIndex = photos.findIndex(
              (photo) => photo.id === selectedPhoto.id
            );

            const nextIndex = (currentIndex + 1) % photos.length;

            setSelectedPhoto(photos[nextIndex]);
          }}
        >
          ›
        </button>
      )}
<div className="lightbox-actions">
  <p>{selectedPhoto.caption || "Untitled photo"}</p>

  <a
    href={photoUrls[selectedPhoto.id]}
    download={`travel-photo-${selectedPhoto.id}.jpg`}
    className="download-photo-btn"
  >
    ↓ Download
  </a>
</div>
    </div>
  </div>
)}
    </div>
  );
}

export default TripDetail;