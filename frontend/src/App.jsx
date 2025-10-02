"use client"

import { useState } from "react"
import Landing from "./components/landing"
import Details from "./components/details"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom" 

export default function Page() {
  const [currentPage, setCurrentPage] = useState("home")
  const [selectedProperty, setSelectedProperty] = useState(null)

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

  const properties = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1728050829115-490e7a27ad81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzU5Mzc1ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "796km away",
      price: "₹14,213",
      period: "night",
      badge: "Guest Favorite",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1701825299870-398fb12864bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwcmV0cmVhdHxlbnwxfHx8fDE3NTkzNjM1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "624km away",
      price: "₹14,213",
      period: "night",
      badge: "Best Rated",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1610942932910-7f2be4704d0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaGZyb250JTIwaG91c2V8ZW58MXx8fHwxNzU5MzI2Nzk3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "142km away",
      price: "₹19,112",
      period: "night",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1677207856236-37bd1aee7011?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VudHJ5c2lkZSUyMGZhcm1ob3VzZXxlbnwxfHx8fDE3NTk0MjQ1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "14km away",
      price: "₹14,213",
      period: "night",
      badge: "NEW",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1708659790808-8cd34b52ec78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlaG91c2UlMjByZXRyZWF0fGVufDF8fHx8MTc1OTQyNDU5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "50km away",
      price: "₹8,119",
      period: "night",
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1615354310157-c78b1be66eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVlaG91c2UlMjBhY2NvbW1vZGF0aW9ufGVufDF8fHx8MTc1OTQyNDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "78km away",
      price: "₹14,213",
      period: "night",
      badge: "Best Rated",
    },
    {
      id: 7,
      image:
        "https://images.unsplash.com/photo-1553661763-1bbb4b5cf599?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXBhcnRtZW50JTIwbG9mdHxlbnwxfHx8fDE3NTkzMDgwOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "21km away",
      price: "₹14,233",
      period: "night",
    },
    {
      id: 8,
      image:
        "https://images.unsplash.com/photo-1653502626104-2b6effaa58ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBob21lJTIwbW9kZXJufGVufDF8fHx8MTc1OTQyNDU5Nnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "61km away",
      price: "₹16,369",
      period: "night",
    },
    {
      id: 9,
      image:
        "https://images.unsplash.com/photo-1728050829115-490e7a27ad81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMHBvb2x8ZW58MXx8fHwxNzU5Mzc1ODgzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "68km away",
      price: "₹14,323",
      period: "night",
    },
    {
      id: 10,
      image:
        "https://images.unsplash.com/photo-1701825299870-398fb12864bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGNhYmluJTIwcmV0cmVhdHxlbnwxfHx8fDE3NTkzNjM1Njd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Make a memory",
      rating: 4.8,
      distance: "30km away",
      price: "₹15,369",
      period: "night",
      badge: "Guest Favorite",
    },
  ]

  const additionalImages = [
    "https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB2aWxsYSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTQxMjAzOHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1729606188713-814d1b7bf893?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGJlZHJvb20lMjBsdXh1cnl8ZW58MXx8fHwxNzU5Mzc1ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1750271335304-8640633f5cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGJhdGhyb29tJTIwbW9kZXJufGVufDF8fHx8MTc1OTQyNDg1MHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1757262798620-ea10e2edd875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGtpdGNoZW4lMjBtb2Rlcm58ZW58MXx8fHwxNzU5Mzc1ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
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
      links: ["Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre"],
    },
    {
      title: "Airbnb",
      links: ["Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre"],
    },
    {
      title: "Hosting",
      links: ["Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre", "Help Centre"],
    },
  ]

  const handleBackToHome = () => {
    setCurrentPage("home")
    setSelectedProperty(null)
  }

  const handlePropertyClick = (property) => {
    setSelectedProperty(property)
    setCurrentPage("property")
  }

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

  return (
    <Router>
    <Routes>
    <Route path="/" element={<Landing 
      categories={categories}
      properties={properties}
      inspirationCategories={inspirationCategories}
      footerSections={footerSections}
      onSelectProperty={handlePropertyClick}
    />} />
    <Route path="/details" element={<Details
    selectedProperty={selectedProperty}
        additionalImages={additionalImages}
        amenities={amenities}
        onBack={handleBackToHome}
    />} />  
      </Routes>
    </Router>
  )
}
