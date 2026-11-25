
import { useEffect, useState } from "react";
import "../styles/Profile.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getMyProfile,
  updateMyProfile,
  getMyTravelStats,
  getMyTravelHistory,
  getMyPhotos,
  getPhotoImage
} from "../services/api";

function Profile() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [stats, setStats] = useState(null);
  const [travelHistory, setTravelHistory] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState({});

  useEffect(() => {
    const loadProfile = async () => {
        try {
        const [
          profileData,
          statsData,
          historyData,
          photosData
        ] = await Promise.all([
          getMyProfile(),
          getMyTravelStats(),
          getMyTravelHistory(),
          getMyPhotos()
        ]);

        setProfile(profileData);
        setStats(statsData);
        setTravelHistory(historyData);
        setPhotos(photosData);

        setNickname(profileData.nickname || "");
        setBio(profileData.bio || "");
        setLocation(profileData.location || "");

        } catch (error) {
        console.error("Failed to load profile:", error);
        }
    };

    loadProfile();
  }, []);

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
        console.error("Failed to load profile photos:", error);
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

  const handleEdit = () => {
    setIsEditing(true);
    };

    const handleCancel = () => {
    setNickname(profile.nickname || "");
    setBio(profile.bio || "");
    setLocation(profile.location || "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
        const updatedProfile = await updateMyProfile({
        nickname,
        bio,
        location
        });

        setProfile(updatedProfile);
        setIsEditing(false);

        alert("Profile updated successfully!");

    } catch (error) {
        console.error("Failed to update profile:", error);
        alert("Failed to update profile.");
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  
return (
  <div className="profile-page">
    <div className="profile-container">
      <header className="profile-nav">
        <Link to="/" className="profile-nav-brand">
          <span className="profile-nav-icon">✈</span>
          <span>Travel Planner</span>
        </Link>

        <nav className="profile-nav-links">
          <Link to="/" className="profile-nav-link">
            Home
          </Link>

          <Link
            to="/profile"
            className="profile-nav-link active profile-icon-link"
          >
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

          <Link to="/trips/new" className="profile-nav-create">
            ＋ Create Trip
          </Link>

          <button
            type="button"
            className="profile-nav-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      </header>

      <div className="profile-cover"></div>

      <div className="profile-header">
        <img
          className="profile-avatar"
          src="https://ui-avatars.com/api/?name=Traveler&background=526b58&color=fff&size=200"
          alt="Profile Avatar"
        />

        <div className="profile-info">

          {isEditing ? (
            <div className="profile-edit-form">

              <div className="profile-form-heading">
                <h2>Edit Personal Information</h2>
                <p>Update your profile and let others know more about you.</p>
              </div>

              <div className="profile-form-group">
                <label>Nickname</label>
                <input
                  className="profile-input"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Enter your nickname"
                />
              </div>

              <div className="profile-form-group">
                <label>Email Address</label>
                <div className="profile-email-display">
                  {profile.email}
                </div>
                <span className="profile-hint">
                  Your email address cannot be changed here.
                </span>
              </div>

              <div className="profile-form-group">
                <label>Location</label>
                <input
                  className="profile-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where do you live?"
                />
              </div>

              <div className="profile-form-group">
                <label>About Me</label>
                <textarea
                  className="profile-textarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself and your travel experiences..."
                  rows={5}
                />
                <span className="profile-hint">
                  Share a little about yourself with other travelers.
                </span>
              </div>

              <div className="profile-form-actions">
                <button
                  className="profile-save-button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>

                <button
                  className="profile-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

            </div>
          ) : (
            <>
              <h1>{profile.nickname}</h1>

              <p className="profile-email">
                {profile.email}
              </p>

              <p className="profile-location">
                📍 {profile.location || "Add your location"}
              </p>

              <div className="profile-bio">
                <p>{profile.bio || "Write something about yourself..."}</p>
              </div>

              <button
                className="profile-edit-button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </>
          )}

        </div>
      </div>
      {/* Travel Statistics */}
    <div className="travel-stats-section">

    <div className="travel-stats-heading">
        <h2>My Travel Statistics</h2>
        <p>A little summary of your travel journey.</p>
    </div>

    <div className="travel-stats-grid">

        <div className="travel-stat-card">
        <div className="travel-stat-icon">✈️</div>
        <p className="travel-stat-label">Total Trips</p>
        <h3>{stats ? stats.totalTrips : "--"}</h3>
        <span>Trips planned</span>
        </div>

        <div className="travel-stat-card">
        <div className="travel-stat-icon">📍</div>
        <p className="travel-stat-label">Destinations</p>
        <h3>{stats ? stats.destinations : "--"}</h3>
        <span>Unique destinations</span>
        </div>

        <div className="travel-stat-card">
        <div className="travel-stat-icon">📅</div>
        <p className="travel-stat-label">Travel Days</p>
        <h3>{stats ? stats.travelDays : "--"}</h3>
        <span>Days of adventure</span>
        </div>

        <div className="travel-stat-card">
        <div className="travel-stat-icon">💰</div>
        <p className="travel-stat-label">Total Expenses</p>
        <h3>
            {stats
            ? stats.totalExpenses.toLocaleString("en-US", {
                maximumFractionDigits: 2
                })
            : "--"}
        </h3>
        <span>Total trip expenses</span>
        </div>

    </div>
    </div>
    {/* Travel History */}
<div className="travel-history-section">
  <div className="travel-history-heading">
    <h2>My Travel History</h2>
    <p>Every trip tells a story.</p>
  </div>

  {travelHistory.length === 0 ? (
    <div className="travel-history-empty">
      <p>No trips yet. Start planning your next adventure!</p>
    </div>
  ) : (
    <div className="travel-history-grid">
      {travelHistory.map((trip) => (
        <div
          className="travel-history-card"
          key={trip.id}
          onClick={() => navigate(`/trips/${trip.id}`)}
        >
          <div className="travel-history-card-top">
            <span className={`trip-status ${trip.status.toLowerCase()}`}>
              {trip.status}
            </span>
          </div>

          <h3>{trip.name}</h3>

          <p className="travel-history-destination">
            📍 {trip.destination || "Destination not specified"}
          </p>

          <p className="travel-history-date">
            {trip.startDate || "TBD"} — {trip.endDate || "TBD"}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

{/* Travel Gallery */}
<div className="travel-gallery-section">

  <div className="travel-gallery-heading">
    <h2>My Travel Gallery</h2>
    <p>A collection of memories from all your trips.</p>
  </div>

  {photos.length === 0 ? (
    <div className="travel-gallery-empty">
      <p>No photos yet. Upload your first travel memory!</p>
    </div>
  ) : (
    <div className="travel-gallery-grid">

      {photos.map((photo) => (
        <div
          className="travel-gallery-card"
          key={photo.id}
          onClick={() => navigate(`/trips/${photo.tripId}`)}
        >

          {photoUrls[photo.id] && (
            <img
              src={photoUrls[photo.id]}
              alt={photo.caption || "Travel photo"}
            />
          )}

          <div className="travel-gallery-info">

            <h3>
              {photo.caption || "Untitled photo"}
            </h3>

            <p>
              ✈️ {photo.tripName}
            </p>

            <span>
              View Trip →
            </span>

          </div>

        </div>
      ))}

    </div>
  )}

</div>

    </div>
  </div>
);

}

export default Profile;
