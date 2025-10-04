import "./profile.css"
import AirbnbLogo from "./airbnb.webp"
import { ArrowLeft, Share, Heart, Star, Wifi, Car, Tv, AirVent, Users, Globe, Menu, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

function SuitcaseIcon() {
  return (
    <svg className="icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a2 2 0 0 1 2-2h4Zm2 0h2V5h-2v1Z"
        fill="#8a8a8a"
      />
    </svg>
  )
}

function ConnectionsIcon() {
  return (
    <svg className="icon" width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8" cy="8" r="3.5" fill="#8a8a8a" />
      <circle cx="16.5" cy="9.5" r="2.5" fill="#b6b6b6" />
      <path d="M3.5 18.5c0-2.76 2.69-5 6-5s6 2.24 6 5v.5H3.5v-.5Z" fill="#cfcfcf" />
      <path d="M14 18.5c.2-1.76 1.86-3.5 4-3.5s4 1.74 4 3.5v.5h-8v-.5Z" fill="#e1e1e1" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg className="icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4.5 3.2A1 1 0 0 1 3 19.4V6a2 2 0 0 1 1-2Z"
        fill="none"
        stroke="#222222"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="10" r="1.1" fill="#222222" />
      <circle cx="12" cy="10" r="1.1" fill="#222222" />
      <circle cx="16" cy="10" r="1.1" fill="#222222" />
    </svg>
  )
}

     const footerSections = [
    {
      title: "Support",
      links: ["Help Centre", "Get help with a safety issue", "AirCover", "Anti-discrimination", "Disability support", "Cancellation options"],
    },
    {
      title: "Hosting",
      links: ["Airbnb your home", "Airbnb your experience", "Airbnb your service", "AirCover for Hosts", "Hosting resources", "Community Forum"],
    },
    {
      title: "Airbnb",
      links: ["2025 Summer Release", "Newsroom", "Careers", "Investors", "Airbnb.org emergency stays", "Help Centre"],
    },
  ]


export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [activeSection, setActiveSection] = useState("about") // <-- added
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    email: "",
    password: "",
  })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5000/bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
a
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data);
        console.log(data)
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type }), 3000)
  }

  const handleLogoClick = () => navigate("/")

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-wrapper")) setDropdownOpen(false)
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data); // your React state to display name/address etc.
    } catch (error) {
      console.error(error);
    }
  };


  fetchProfile();
}, []);

    useEffect(() => {
  console.log("Profile updated:", profile);
}, [profile]);

    const handleProfileSubmit = async () => {
         let url = "http://localhost:5000/profile";
         const payload = {
            name: profile.name,
            address: profile.address,
            contact_no: profile.contact_no,
            email: profile.email,
            date_of_birth: profile.date_of_birth,
         };
         const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
         })

         const data = await response.json();
            if (response.ok) {
                showToast("Profile updated successfully", "success");
                navigate("/profile");
            } else {
                showToast(data.message || "Failed to update profile", "error");
            }
    }

  return (
    <div className="airbnb-profile">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              id="logo"
              src={AirbnbLogo || "/placeholder.svg"}
              alt="Airbnb Logo"
              className="logo-image"
              onClick={handleLogoClick}
            />
          </div>

          <nav className="main-nav" aria-label="Primary">
            <a href="#" className="nav-link">Stay</a>
            <a href="#" className="nav-link">Experiences</a>
            <a href="#" className="nav-link">Online Experiences</a>
          </nav>

          <div className="header-right">
            <a href="#" className="host-link">Airbnb your home</a>
            <button className="icon-button" aria-label="Change language">
              <Globe className="icon-sm" />
            </button>

            <div className="user-menu-wrapper">
              <div
                className="user-menu"
                role="button"
                aria-label="User menu"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Menu className="icon-sm" />
                <User className="user-icon" />
              </div>

              {dropdownOpen && (
                <div className="user-dropdown">
                  {token ? (
                    <>
                      <button className="dropdown-item" onClick={() => navigate("/profile")}>
                        Profile
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          localStorage.removeItem("token")
                          showToast("Logged out", "success")
                          navigate("/")
                        }}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setShowLogin(true)
                        setDropdownOpen(false)
                      }}
                    >
                      Log in or Sign up
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Page */}
      <div className="page">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="sidebar-title">Profile</h2>
          <nav className="sidebar-nav" aria-label="Profile navigation">
            <button
              className={`nav-item ${activeSection === "about" ? "nav-item--active" : ""}`}
              onClick={() => setActiveSection("about")}
            >
              <span className="nav-icon avatar avatar--chip">{profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}</span>
              <span className="nav-label">About me</span>
            </button>

            <button
              className={`nav-item ${activeSection === "trips" ? "nav-item--active" : ""}`}
              onClick={() => setActiveSection("trips")}
            >
              <span className="nav-icon">
                <SuitcaseIcon />
              </span>
              <span className="nav-label">Past trips</span>
            </button>

            <button
              className={`nav-item ${activeSection === "connections" ? "nav-item--active" : ""}`}
              onClick={() => setActiveSection("connections")}
            >
              <span className="nav-icon">
                <ConnectionsIcon />
              </span>
              <span className="nav-label">Connections</span>
            </button>
          </nav>
        </aside>

        <div className="divider" aria-hidden="true" />

        {/* Main content changes here */}
        <main className="main" role="main">
          {activeSection === "about" && (
            <>
              <div className="main-header-profile">
                <h1>About me</h1>
                <button className="edit-btn" type="button" aria-label="Edit">
                  Edit
                </button>
              </div>

              <section className="grid">
                <div className="profile-card" aria-label="Profile card">
                  <div className="avatar avatar--lg">{profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}</div>
                  <div className="profile-name">{profile?.name || " "}</div>
                  <div className="profile-role">Guest</div>
                </div>

                <div className="cta">
                  <h3 className="cta-title">Complete your profile</h3>
                  <p className="cta-desc">
                    Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and
                    guests get to know you.
                  </p>
                  <button className="cta-btn" type="button" onClick={() => setActiveSection("profileChanges")}>Get started</button>
                </div>
              </section>

              <hr className="rule" />

              <section className="reviews">
                <div className="reviews-title">
                  <ChatIcon />
                  <span>Reviews I&apos;ve written</span>
                </div>
              </section>
            </>
          )}
          {activeSection === "profileChanges" && (
            <>
              <div className="main-header-profile">
                <h1>About me</h1>
                
              </div>

              <section className="grid">
                <div className="profile-form">
  <form onSubmit={(e) => e.preventDefault()}>
    {/* Name */}
    <div className="form-field full-width">
      <label className="form-label" htmlFor="name">Name:</label>
      <input
        className="profile-input"
        type="text"
        id="name"
        value={profile?.name || ""}
        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
        placeholder="Enter your name"
      />
    </div>

    {/* Contact & Email */}
    <div className="form-row">
      <div className="form-field">
        <label className="form-label" htmlFor="contact_no">Contact Number:</label>
        <input
          className="profile-input"
          type="text"
          id="contact_no"
          value={profile?.contact_no || ""}
          onChange={(e) => setProfile({ ...profile, contact_no: e.target.value })}
          placeholder="Enter contact number"
        />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="email">Email:</label>
        <input
          className="profile-input"
          type="email"
          id="email"
          value={profile?.email || ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          placeholder="Enter email"
        />
      </div>
    </div>

    {/* Address */}
    <div className="form-row">
      <div className="form-field">
        <label className="form-label" htmlFor="City">City:</label>
        <input
          className="profile-input"
          type="text"
          id="City"
          value={profile?.address?.City || ""}
          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, City: e.target.value } })}
          placeholder="Enter city"
        />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="State">State:</label>
        <input
          className="profile-input"
          type="text"
          id="State"
          value={profile?.address?.State || ""}
          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, State: e.target.value } })}
          placeholder="Enter state"
        />
      </div>
    </div>

    <div className="form-row">
      <div className="form-field">
        <label className="form-label" htmlFor="Country">Country:</label>
        <input
          className="profile-input"
          type="text"
          id="Country"
          value={profile?.address?.Country || ""}
          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, Country: e.target.value } })}
          placeholder="Enter country"
        />
      </div>
      <div className="form-field">
        <label className="form-label" htmlFor="Zipcode">Zip Code:</label>
        <input
          className="profile-input"
          type="text"
          id="Zipcode"
          value={profile?.address?.Zipcode || ""}
          onChange={(e) => setProfile({ ...profile, address: { ...profile.address, Zipcode: e.target.value } })}
          placeholder="Enter zip code"
        />
      </div>
    </div>

    {/* Date of Birth */}
    <div className="form-field full-width">
      <label className="form-label" htmlFor="date_of_birth">Date of Birth:</label>
      <input
        className="profile-input"
        type="date"
        id="date_of_birth"
        value={profile?.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : ""}
        onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
      />
    </div>

    <button type="submit" className="save-btn" onClick={()=>handleProfileSubmit()}>Save Changes</button>
  </form>
</div>
              </section>
            </>
          )}

          {activeSection === "trips" && (
            <>
              <div className="main-header-profile">
                <h1>Past trips</h1>
              </div>

              <section className="grid">
                 <div className="booking-page">
      {/* Floating bookings */}
      <div className="user-bookings">
        {loading ? (
          <p>Loading your bookings...</p>
        ) : bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((booking, index) => (
            <div key={index} className="booking-card">
              <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p><strong>Guests:</strong> {booking.guests}</p>
              <p><strong>Name:</strong> {booking.name}</p>
              <p><strong>Email:</strong> {booking.email}</p>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Notes:</strong> {booking.notes}</p>
              <p><strong>Payment ID:</strong> {booking.paymentId}</p>
            </div>
          ))
        )}
      </div>

      {/* Your booking form goes here */}
    </div>
              </section>
            </>
          )}

          {activeSection === "connections" && (
            <>
              <div className="main-header-profile">
                <h1>Connections</h1>
              </div>
              <section className="grid">
                <p>Show connections or followers data here...</p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

