"use client"
import { useState, useEffect } from "react"
import "./details.css"
import { ArrowLeft, Share, Heart, Star, Wifi, Car, Tv, AirVent, Users, Globe, Menu, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import AirbnbLogo from "./airbnb.webp"

const amenityIconMap = { Wifi, Car, Tv, AirVent, Users }

export default function Details({ showToast }) {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  

  const [formData, setFormData] = useState({
      name: "",
      contact_no: "",
      email: "",
      password: "",
    })

  // Hardcoded property data
  const selectedProperty = {
    title: "Luxury Villa in Goa",
    rating: 4.9,
    distance: "2 km from city center",
    badge: "Superhost",
    image: "https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg",
    price: "₹14,213",
    period: "per night",
  }

  // Additional gallery images
  const additionalImages = [
    "https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTQxMjAzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1729606188713-814d1b7bf893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGJlZHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzU5Mzc1ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1750271335304-8640633f5cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGJhdGhyb29tJTIwbW9kZXJufGVufDF8fHx8MTc1OTQyNDg1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1757262798620-ea10e2edd875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU5Mzc1ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  ]

  const amenities = [
    { iconName: "Wifi", label: "Wifi" },
    { iconName: "Car", label: "Free Parking" },
    { iconName: "Tv", label: "TV" },
    { iconName: "AirVent", label: "Air Conditioning" },
    { iconName: "Users", label: "Suitable for Groups" },
  ]

  const handleBack = () => {
    navigate("/") // Go back to the previous page
  }

  const handleReserve = () => {
  if (token) {
    // User is logged in → go directly to booking
    navigate("/booking");
  } else {
    // User is not logged in → open login modal
    setShowLogin(true);
  }
};



  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/") // Navigate first
    setTimeout(() => {
      showToast("Logged out", "success")
    }, 100) // Show toast after navigation
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    setFormData({
      name: "",
      contact_no: "",
      email: "",
      password: "",
    })
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let url = ""
      let payload = {}

      if (isSignUp) {
        url = "http://localhost:5000/register"
        payload = {
          name: formData.name,
          contact_no: formData.contact_no,
          email: formData.email,
          password: formData.password,
        }
      } else {
        url = "http://localhost:5000/login"
        payload = {
          email: formData.email,
          password: formData.password,
        }
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || response.statusText || (isSignUp ? "Signup failed" : "Login failed"))
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
        setShowLogin(false)
        navigate("/booking") // Navigate after successful login/signup
      }
    } catch (error) {
      console.error("Error:", error)
      showToast(error.message, "error")
    }
  }

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-wrapper")) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

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

  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <div className="app-container">
      {/* Navbar (same as landing) */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img id="logo" src={AirbnbLogo || "/placeholder.svg"} alt="Airbnb Logo" className="logo-image" onClick={()=>handleLogoClick()} />
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
                      <button className="dropdown-item" onClick={() => navigate("/profile")}>Profile</button>
                      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </>
                  ) : (
                    <button className="dropdown-item" onClick={() => alert("Show login modal")}>Log in or Sign up</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Details Header */}
      <header className="details-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button" aria-label="Back">
            <ArrowLeft className="icon-sm" />
            <span>Back</span>
          </button>

          <div className="header-actions">
            <button className="action-button">
              <Share className="icon-sm" />
              <span className="underline">Share</span>
            </button>
            <button className="action-button">
              <Heart className="icon-sm" />
              <span className="underline">Save</span>
            </button>
          </div>
        </div>
      </header>

      {/* Details Content */}
      <div className="details-content">
        {/* Property Title */}
        <div className="property-title-section">
          <h1 className="property-title">{selectedProperty.title}</h1>
          <div className="property-meta">
            <div className="rating-section">
              <Star className="icon-xs star-filled" />
              <span>{selectedProperty.rating}</span>
              <span className="text-muted">• 127 reviews</span>
            </div>
            <span className="text-muted">• {selectedProperty.distance}</span>
            {selectedProperty.badge && <span className="property-badge">{selectedProperty.badge}</span>}
          </div>
        </div>

        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              className="gallery-image"
            />
          </div>
          {additionalImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <img src={image} alt={`View ${index + 1}`} className="gallery-image" />
              {index === 3 && (
                <div className="overlay">
                  <span className="overlay-text">Show all photos</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="details-layout">
          {/* Main Content */}
          <div className="main-content">
            {/* Property Info */}
            <div className="info-section">
              <div className="host-info">
                <div>
                  <h2 className="section-title">Entire villa hosted by Sarah</h2>
                  <div className="property-details">
                    <span>8 guests</span>
                    <span>•</span>
                    <span>4 bedrooms</span>
                    <span>•</span>
                    <span>4 beds</span>
                    <span>•</span>
                    <span>3 bathrooms</span>
                  </div>
                </div>
                <div className="host-avatar" aria-hidden="true"></div>
              </div>
            </div>

            {/* Amenities */}
            <div className="info-section">
              <h3 className="section-title">What this place offers</h3>
              <div className="amenities-grid">
                {amenities.map((amenity, index) => {
                  const Icon = amenityIconMap[amenity.iconName] || Wifi
                  return (
                    <div key={index} className="amenity-item">
                      <Icon className="icon-sm text-muted" />
                      <span>{amenity.label}</span>
                    </div>
                  )
                })}
              </div>
              <button className="show-more-button">Show all 25 amenities</button>
            </div>

            {/* Description */}
            <div className="info-section">
              <p className="description">
                Welcome to our stunning luxury villa with breathtaking views and modern amenities. This spacious
                property features elegant design, premium furnishings, and everything you need for an unforgettable
                stay. Perfect for families and groups looking for comfort and style in a beautiful location.
              </p>
              <button className="text-button">Show more</button>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <div className="reviews-header">
                <Star className="icon-sm star-filled" />
                <span className="reviews-title">{selectedProperty.rating} • 127 reviews</span>
              </div>

              <div className="reviews-grid">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="review-item">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar"></div>
                      <div>
                        <p className="reviewer-name">Guest {i + 1}</p>
                        <p className="review-date">October 2024</p>
                      </div>
                    </div>
                    <p className="review-text">
                      Amazing place with beautiful views and excellent amenities. The host was very responsive and
                      helpful. Highly recommended!
                    </p>
                  </div>
                ))}
              </div>

              <button className="show-more-button">Show all reviews</button>
            </div>
          </div>

          {/* Booking Card */}
          <aside className="booking-card-container" aria-label="Booking">
            <div className="booking-card">
              <div className="price-section">
                <span className="price">{selectedProperty.price}</span>
                <span className="price-period">{selectedProperty.period}</span>
              </div>

              <div className="date-inputs">
                <div className="date-input">
                  <label className="input-label">Check-in</label>
                  <p className="input-placeholder">Add date</p>
                </div>
                <div className="date-input">
                  <label className="input-label">Check-out</label>
                  <p className="input-placeholder">Add date</p>
                </div>
              </div>

              <div className="guest-input">
                <label className="input-label">Guests</label>
                <p className="input-placeholder">1 guest</p>
              </div>

              <button className="reserve-button" onClick={handleReserve}>
                Reserve
              </button>

              <p className="booking-note">You won't be charged yet</p>

              <div className="pricing-breakdown">
                <div className="pricing-row">
                  <span className="pricing-label">{selectedProperty.price} x 5 nights</span>
                  <span>₹71,065</span>
                </div>
                <div className="pricing-row">
                  <span className="">Cleaning fee</span>
                  <span>₹3,555</span>
                </div>
                <div className="pricing-row">
                  <span className="">Service fee</span>
                  <span>₹10,659</span>
                </div>
                <div className="pricing-total">
                  <span>Total before taxes</span>
                  <span>₹85,279</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
        {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-sections">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-links">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#" className="footer-link">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-bottom-left">
              <span>© 2025 Airbnb, Inc.</span> <span>•</span>
              <a href="#" className="footer-link">
                Privacy
              </a>{" "}
              <span>•</span>
              <a href="#" className="footer-link">
                Terms
              </a>{" "}
              <span>•</span>
              <a href="#" className="footer-link">
                Sitemap
              </a>{" "}
              <span>•</span>
              <a href="#" className="footer-link">
                Company details
              </a>{" "}
              <span>•</span>
              <span>Clone by anuratan1421</span>
            </div>
            <div className="footer-bottom-right">
              <div className="language-selector">
                <Globe className="icon-sm" />
                <span className="selector-text">English</span>
              </div>
              <span className="selector-text">₹ INR</span>
              <div className="social-links" aria-label="Social links"></div>
            </div>
          </div>
        </div>
      </footer>
        {/* Auth Modal */}
      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-tabs">
              <button className={isSignUp ? "active" : ""} onClick={() => setIsSignUp(true)}>
                Sign Up
              </button>
              <button className={!isSignUp ? "active" : ""} onClick={() => setIsSignUp(false)}>
                Login
              </button>
            </div>

            {isSignUp ? (
              <>
                <h2 className="login-title">Create an Account</h2>
                <form className="login-form">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <input
                    type="tel"
                    name="contact_no"
                    placeholder="Contact Number"
                    required
                    value={formData.contact_no}
                    onChange={handleInputChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="login-btn" onClick={handleSubmit}>
                    Sign Up
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="login-title">Welcome Back</h2>
                <form className="login-form">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button type="submit" className="login-btn" onClick={handleSubmit}>
                    Login
                  </button>
                </form>
              </>
            )}

            <div className="divider">
              <span>or</span>
            </div>

            <div className="social-logins">
              <button className="social-btn google">Continue with Google</button>
              <button className="social-btn microsoft">Continue with Microsoft</button>
              <button className="social-btn apple">Continue with Apple</button>
              <button className="social-btn facebook">Continue with Facebook</button>
            </div>

            <button className="close-btn" onClick={() => setShowLogin(false)}>
              ×
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
