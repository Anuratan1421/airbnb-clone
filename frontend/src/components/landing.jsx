"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AirbnbLogo from "./airbnb.webp"
import "./landing.css"
import { Heart, Globe, Menu, User, Star } from "lucide-react"
import Details from "./details"

export default function Landing() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type }), 3000)
  }

  const [formData, setFormData] = useState({
    name: "",
    contact_no: "",
    email: "",
    password: "",
  })

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
        showToast(isSignUp ? "Signup successful!" : "Login successful!", "success")
        setShowLogin(false)
      }
    } catch (error) {
      console.error("Error:", error)
      showToast(error.message, "error")
    }
  }

  const categories = [
    { icon: "🏠", label: "Icons" },
    { icon: "🗻", label: "Adventure" },
    { icon: "🏊", label: "Amazing pools" },
    { icon: "🚜", label: "Farmside" },
    { icon: "🏠", label: "Cabins" },
    { icon: "🏖️", label: "Beachfront" },
    { icon: "🌲", label: "Treehouse" },
    { icon: "🎯", label: "Luxe" },
  ]

 

  const amenities = [
    { iconName: "Wifi", label: "Wifi" },
    { iconName: "Car", label: "Free parking" },
    { iconName: "Tv", label: "TV" },
    { iconName: "AirVent", label: "Air conditioning" },
    { iconName: "Users", label: "Suitable for families" },
  ]

  const inspirationCategories = [
    "Popular",
    "Arts & culture",
    "Outdoors",
    "Mountains",
    "Beach",
    "Unique stays",
    "Categories",
    "Things to do",
  ]

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

  

  const handlePropertyClick = (property) => {
    navigate("/details")
  }

  useEffect(() => {
    fetch("http://localhost:5000/properties")
      .then((res) => res.json())
      .then((data) => setProperties(data))
      .catch((err) => console.error("Error fetching properties:", err))
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".user-menu-wrapper")) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  if (currentPage === "property" && selectedProperty) {
    return (
      <Details
        selectedProperty={selectedProperty}
        additionalImages={additionalImages}
        amenities={amenities}
        onBack={handleBackToHome}
      />
    )
  }

  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img id="logo" src={AirbnbLogo || "/placeholder.svg"} alt="Airbnb Logo" className="logo-image" onClick={()=>handleLogoClick()} />
          </div>

          <nav className="main-nav" aria-label="Primary">
            <a href="#" className="nav-link">
              Stay
            </a>
            <a href="#" className="nav-link">
              Experiences
            </a>
            <a href="#" className="nav-link">
              Online Experiences
            </a>
          </nav>

          <div className="header-right">
            <a href="#" className="host-link">
              Airbnb your home
            </a>
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
                      <button className="dropdown-item" onClick={() => alert("Go to Profile")}>
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

      {/* Categories */}
      <section className="categories-section" aria-label="Categories">
        <div className="categories-content">
          <div className="categories-list">
            {categories.map((category, index) => (
              <div key={index} className="category-item" role="button" tabIndex={0}>
                <span className="category-icon">{category.icon}</span>
                <span className="category-label">{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Grid */}
      <main className="main-content-section">
        <div className="properties-container">
          <div className="properties-grid">
            {properties.map((property) => (
              <div
                key={property.id}
                className="property-card"
                onClick={() => handlePropertyClick(property)}
                role="button"
                tabIndex={0}
              >
                <div className="property-image-container">
                  <img src={property.image || "/placeholder.svg"} alt={property.title} className="property-image" />
                  {property.badge && <div className="property-badge-overlay">{property.badge}</div>}
                  <button
                    className="favorite-button"
                    aria-label="Save to favorites"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="icon-sm" />
                  </button>
                </div>
                <div className="property-info">
                  <div className="property-header">
                    <h3 className="property-name">{property.title}</h3>
                    <div className="property-rating">
                      <Star className="icon-xs star-filled" />
                      <span className="rating-text">{property.rating}</span>
                    </div>
                  </div>
                  <p className="property-distance">{property.distance}</p>
                  <p className="property-price">
                    <span className="price-amount">{property.price}</span> {property.period}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Inspiration Section */}
      <section className="inspiration-section" aria-labelledby="inspiration-title">
        <div className="inspiration-container">
          <h2 id="inspiration-title" className="inspiration-title">
            Inspiration for future getaways
          </h2>
          <div className="inspiration-tabs" role="tablist" aria-label="Inspiration categories">
            {inspirationCategories.map((cat, idx) => (
              <button
                key={idx}
                className={`tab-button ${idx === 0 ? "tab-active" : ""}`}
                role="tab"
                aria-selected={idx === 0}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="destinations-grid">
            {Array.from({ length: 18 }, (_, i) => (
              <div key={i} className="destination-item">
                <p className="destination-name">Canmore</p>
                <p className="destination-type">Apartment rentals</p>
              </div>
            ))}
          </div>
          <div className="show-more-container">
            <button className="text-button">Show more</button>
          </div>
        </div>
      </section>

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

      <div className="toast-wrapper" aria-live="polite" aria-atomic="true">
        {toast.show && (
          <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"} show`} role="status">
            <span className="toast-icon" aria-hidden="true">
              {toast.type === "success" ? "✓" : "!"}
            </span>
            <span className="toast-message">{toast.message}</span>
          </div>
        )}
      </div>
    </div>
  )
}
