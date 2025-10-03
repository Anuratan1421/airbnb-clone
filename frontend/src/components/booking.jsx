"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AirbnbLogo from "./airbnb.webp"
import { ArrowLeft, Share, Heart, Star, Wifi, Car, Tv, AirVent, Users, Globe, Menu, User } from "lucide-react"
import "./landing.css"
import "./booking.css"

export default function Booking({ property, additionalImages = [], amenities = [], onBack }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    propertyId: property?.id || "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    name: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState({ ok: false, msg: "" })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (property?.id) {
      setForm((f) => ({ ...f, propertyId: property.id }))
    }
  }, [property?.id])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: name === "guests" ? Number(value) : value }))
  }

  const handleBack = () => {
    navigate("/details") // Go back to the previous page
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/") // Navigate first
    setTimeout(() => {
      showToast("Logged out", "success")
    }, 100) // Show toast after navigation
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setResult({ ok: false, msg: "" })
    try {
      await new Promise((r) => setTimeout(r, 600)) // demo delay
      setResult({ ok: true, msg: "Booking request sent!" })
      setForm({
        propertyId: property?.id || "",
        checkIn: "",
        checkOut: "",
        guests: 1,
        name: "",
        email: "",
        phone: "",
        notes: "",
      })
    } catch (err) {
      setResult({ ok: false, msg: err.message || "Something went wrong" })
    } finally {
      setSubmitting(false)
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

  const handleLogoClick = () => {
    navigate("/")
  }

  return (
    <div className="booking-page-container">
      {/* Navbar (same as landing) */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <img id="logo" src={AirbnbLogo || "/placeholder.svg"} alt="Airbnb Logo" className="logo-image" onClick={()=>handleLogoClick()}/>
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
              <div className="user-menu" role="button" aria-label="User menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
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
                        onClick={() => handleLogout()}
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

      <main className="booking-container">
        {onBack && (
          <button className="bk-back" onClick={onBack} aria-label="Back to Home">
            ← Back
          </button>
        )}

        {property && (
          <section className="bk-property">
            <div className="bk-media">
              <img className="bk-hero" src={property.image || "/placeholder.svg"} alt={property.title} />
              <div className="bk-thumbs">
                {additionalImages.slice(0, 3).map((src, i) => (
                  <img key={i} className="bk-thumb" src={src || "/placeholder.svg"} alt={`${property.title} ${i + 1}`} />
                ))}
              </div>
            </div>
            <div className="bk-info">
              <h1 className="bk-title">{property.title}</h1>
              <p className="bk-muted">{property.distance}</p>
              <p className="bk-price"><strong>{property.price}</strong> {property.period}</p>
              {!!amenities.length && (
                <>
                  <h2 className="bk-subtitle">Amenities</h2>
                  <ul className="bk-amenities">
                    {amenities.map((a, i) => <li key={i} className="bk-amenity">{a.label}</li>)}
                  </ul>
                </>
              )}
            </div>
          </section>
        )}

        <h2 className="booking-title">Book Your Stay</h2>
        <form className="booking-form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="propertyId">Property ID</label>
            <input id="propertyId" name="propertyId" value={form.propertyId} onChange={onChange} required />
          </div>

          <div className="grid">
            <div className="field">
              <label htmlFor="checkIn">Check-in</label>
              <input id="checkIn" type="date" name="checkIn" value={form.checkIn} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="checkOut">Check-out</label>
              <input id="checkOut" type="date" name="checkOut" value={form.checkOut} onChange={onChange} required />
            </div>
            <div className="field">
              <label htmlFor="guests">Guests</label>
              <input id="guests" type="number" name="guests" min={1} value={form.guests} onChange={onChange} required />
            </div>
          </div>

          <div className="grid">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={onChange} placeholder="John Doe" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+1 555 0100" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea id="notes" name="notes" rows={4} value={form.notes} onChange={onChange} placeholder="Anything else we should know?" />
          </div>

          <button className="booking-submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Sending..." : "Request Booking"}
          </button>

          {result.msg && (
            <p className={`booking-result ${result.ok ? "ok" : "err"}`} role="status">
              {result.msg}
            </p>
          )}
        </form>
      </main>

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
