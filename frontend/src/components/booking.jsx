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
    checkIn: "",
    checkOut: "",
    nights: 1,
    guests: 1,
    name: "",
    email: "",
    phone: "",
    notes: "",
    // dynamic other guest names will be added like guest2, guest3
  });

  
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState({ ok: false, msg: "" })
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  
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

   // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

   // ✅ Handle form submission
  const onSubmit = (e) => {
  e.preventDefault();
  setSubmitting(true);

  if (!window.Razorpay) {
    alert("Razorpay SDK failed to load. Are you online?");
    setSubmitting(false);
    return;
  }

  // Example amount in paise (₹1000 = 100000 paise)
  const amount = 1000 * 100;

  const options = {
    key: "rzp_test_ROhSciWgaZYOEk", // Your Razorpay test key
    amount: amount,
    currency: "INR",
    name: "Booking Payment",
    description: "Payment for booking",
    prefill: {
      name: form.name,
      email: form.email,
      contact: form.phone,
    },
    handler: async function (response) {
      // Payment successful
      console.log("Payment ID:", response.razorpay_payment_id);

      // Add paymentId to payload
      const payload = { ...form, paymentId: response.razorpay_payment_id };

      try {
        const res = await fetch("http://localhost:5000/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
  setResult({ ok: true, msg: "Booking confirmed!" });

  // Save confirmed booking to state
  setConfirmedBooking(payload);

  // Optionally clear the form
  setForm({
    checkIn: "",
    checkOut: "",
    nights: 1,
    guests: 1,
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
} else {
  setResult({ ok: false, msg: data.message || "Booking failed!" });
}

      } catch (err) {
        console.error(err);
        setResult({ ok: false, msg: "Server error after payment!" });
      }

      setSubmitting(false);
    },
    modal: {
      ondismiss: function () {
        setSubmitting(false); // Reset submitting if user closes Razorpay modal
      },
    },
    theme: { color: "#ff385c" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  


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
                      <button className="dropdown-item" onClick={() => navigate("/profile")}>
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
<form 
className={`booking-form ${confirmedBooking ? "hidden" : ""}`} 
  onSubmit={onSubmit}
>
  
  {/* Dates and Guests */}
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
      <label htmlFor="nights">Number of Nights</label>
      <input
        id="nights"
        type="number"
        name="nights"
        min={1}
        value={form.nights || ""}
        onChange={onChange}
        required
      />
    </div>
    <div className="field">
      <label htmlFor="guests">Guests</label>
      <input
        id="guests"
        type="number"
        name="guests"
        min={1}
        max={3}   // ✅ Limit guests to 3
        value={form.guests}
        onChange={(e) => {
          const value = Math.min(3, Math.max(1, Number(e.target.value))) // enforce range
          setForm((f) => ({ ...f, guests: value }))
        }}
        required
      />
      <small className="guest-note">Maximum 3 guests allowed</small>
    </div>
  </div>

  {/* Main Guest */}
  <h3 className="bk-subtitle">Main Guest Details</h3>
  <div className="grid">
    <div className="field">
      <label htmlFor="name">Full Name</label>
      <input id="name" name="name" value={form.name} onChange={onChange} placeholder="John Doe" required />
    </div>
    <div className="field">
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" value={form.email} onChange={onChange} placeholder="you@example.com" required />
    </div>
    <div className="field">
      <label htmlFor="phone">Phone</label>
      <input id="phone" name="phone" value={form.phone} onChange={onChange} placeholder="+91 9876543210" />
    </div>
  </div>

  {/* Additional Guests */}
  {form.guests > 1 && (
    <>
      <h3 className="bk-subtitle">Other Guest Names</h3>
      {[...Array(form.guests - 1)].map((_, i) => (
        <div className="field" key={i}>
          <label htmlFor={`guest-${i + 2}`}>Guest {i + 2} Name</label>
          <input
            id={`guest-${i + 2}`}
            name={`guest${i + 2}`}
            value={form[`guest${i + 2}`] || ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
            }
            placeholder={`Guest ${i + 2} Name`}
            required
          />
        </div>
      ))}
    </>
  )}

  {/* Notes */}
  <div className="field">
    <label htmlFor="notes">Notes</label>
    <textarea
      id="notes"
      name="notes"
      rows={4}
      value={form.notes}
      onChange={onChange}
      placeholder="Anything else we should know?"
    />
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
{!confirmedBooking ? (
  <form className="booking-form" onSubmit={onSubmit}>
    {/* ... your form fields ... */}
    <button className="booking-submit" disabled={submitting}>
      {submitting ? "Sending..." : "Request Booking"}
    </button>
    {result.msg && <p className={`booking-result ${result.ok ? "ok" : "err"}`}>{result.msg}</p>}
  </form>
) : (
  <div className="booking-details">
    <h2>Booking Confirmed!</h2>
    <p><strong>Payment ID:</strong> {confirmedBooking.paymentId}</p>
    <p><strong>Name:</strong> {confirmedBooking.name}</p>
    <p><strong>Email:</strong> {confirmedBooking.email}</p>
    <p><strong>Phone:</strong> {confirmedBooking.phone}</p>
    <p><strong>Check-in:</strong> {confirmedBooking.checkIn}</p>
    <p><strong>Check-out:</strong> {confirmedBooking.checkOut}</p>
    <p><strong>Number of Nights:</strong> {confirmedBooking.nights}</p>
    <p><strong>Guests:</strong> {confirmedBooking.guests}</p>
    {confirmedBooking.notes && <p><strong>Notes:</strong> {confirmedBooking.notes}</p>}
  </div>
)}


      </main>
      <div>
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
      </div>
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
