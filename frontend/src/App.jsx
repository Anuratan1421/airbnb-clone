"use client"

import { useState } from "react"
import Landing from "./components/landing"
import Details from "./components/details"
import Booking from "./components/booking"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"

// ProtectedRoute component
function ProtectedRoute({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  if (!token) {
    // User is not logged in, redirect to Landing
    return <Navigate to="/" replace />
  }

  // User is logged in, render the requested component
  return children
}

export default function Page() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/details" element={<Details />} />
        
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}
