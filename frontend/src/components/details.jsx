"use client"
import { useState } from "react"
import "./details.css"
import { ArrowLeft, Share, Heart, Star } from "lucide-react"
import { Wifi, Car, Tv, AirVent, Users } from "lucide-react"

const amenityIconMap = { Wifi, Car, Tv, AirVent, Users }

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handlePayment = async () => {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
  const amount = 85279; // Total before taxes from your state
  const response = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const order = await response.json();

  const options = {
    key: "rzp_test_ROhSciWgaZYOEk", // from Razorpay dashboard
    amount: order.amount,
    currency: "INR",
    name: "Stay Booking",
    description: "Payment for booking",
    order_id: order.id,
    handler: function (response) {
      alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
      // ✅ Save booking details in DB here
    },
    prefill: {
      name: "Vedant",
      email: "vedant@example.com",
      contact: "9876543210",
    },
    theme: {
      color: "#ff5a5f",
    },
  };

  const razor = new window.Razorpay(options);
  razor.open();
};

export default function Details({ selectedProperty, additionalImages, amenities, onBack }) {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="details-header">
        <div className="header-content">
          <button onClick={onBack} className="back-button" aria-label="Back">
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
              src={selectedProperty.image || "/placeholder.svg"}
              alt={selectedProperty.title}
              className="gallery-image"
            />
          </div>
          {additionalImages.map((image, index) => (
            <div key={index} className="gallery-item">
              <img
                src={image || "/placeholder.svg"}
                alt={`${selectedProperty.title} view ${index + 1}`}
                className="gallery-image"
              />
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

              <button className="reserve-button"
              onClick={() => handlePayment()}
              >Reserve</button>

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
      </div>
    </div>
  )
}
