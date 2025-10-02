"use client"

import "./landing.css"
import { Heart, Globe, Menu, User, Star } from "lucide-react"

export default function Landing({ categories, properties, inspirationCategories, footerSections, onSelectProperty }) {
  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <svg className="logo-icon" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M16 0c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16zm-2.5 8.5c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5zm5 0c-2.485 0-4.5 2.015-4.5 4.5s2.015 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.015-4.5-4.5-4.5z" />
            </svg>
            <span className="logo-text">airbnb</span>
          </div>

          {/* Navigation */}
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

          {/* Right menu */}
          <div className="header-right">
            <a href="#" className="host-link">
              Airbnb your home
            </a>
            <button className="icon-button" aria-label="Change language">
              <Globe className="icon-sm" />
            </button>
            <div className="user-menu" role="button" aria-label="User menu">
              <Menu className="icon-sm" />
              <User className="user-icon" />
            </div>
          </div>
        </div>
      </header>

      {/* Category filters */}
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

      {/* Property grid */}
      <main className="main-content-section">
        <div className="properties-container">
          <div className="properties-grid">
            {properties.map((property) => (
              <div
                key={property.id}
                className="property-card"
                onClick={() => onSelectProperty(property)}
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

      {/* Inspiration section */}
      <section className="inspiration-section" aria-labelledby="inspiration-title">
        <div className="inspiration-container">
          <h2 id="inspiration-title" className="inspiration-title">
            Inspiration for future getaways
          </h2>

          {/* Category tabs */}
          <div className="inspiration-tabs" role="tablist" aria-label="Inspiration categories">
            {inspirationCategories.map((category, index) => (
              <button
                key={index}
                className={`tab-button ${index === 0 ? "tab-active" : ""}`}
                role="tab"
                aria-selected={index === 0}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Destination grid */}
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
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
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
              <span>© 2025 Airbnb, Inc.</span>
              <span>•</span>
              <a href="#" className="footer-link">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="footer-link">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="footer-link">
                Sitemap
              </a>
              <span>•</span>
              <a href="#" className="footer-link">
                Company details
              </a>
              <span>•</span>
              <span>Clone by JountrianLK2</span>
            </div>

            <div className="footer-bottom-right">
              <div className="language-selector">
                <Globe className="icon-sm" />
                <span className="selector-text">English</span>
              </div>
              <span className="selector-text">₹ INR</span>
              <div className="social-links" aria-label="Social links">
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Another social">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z." />
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Another social">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.053 0.237c-3.317 0-3.724.014-5.025.072-1.298.06-2.186.264-2.963.563-.822.319-1.519.745-2.212 1.438S.883 3.591.563 4.413C.264 5.19.06 6.077.001 7.375c-.058 1.301-.072 1.708-.072 5.025s.014 3.724.072 5.025c.059 1.298.263 2.186.562 2.963.319.822.745 1.519 1.438 2.212.693.693 1.39 1.12 2.212 1.438.777.3 1.665.504 2.963.563 1.301.058 1.708.072 5.025.072s3.724-.015 5.025-.072c1.298-.059 2.186-.263 2.963-.563.822-.318 1.519-.745 2.212-1.438.693-.693 1.12-1.39 1.438-2.212.3-.777.504-1.665.563-2.963.058-1.301.072-1.708.072-5.025s-.015-3.724-.072-5.025c-.059-1.298-.263-2.186-.563-2.963-.318-.822-.745-1.519-1.438-2.212C19.108.883 18.411.456 17.589.138 16.812-.162 15.924-.366 14.626-.425c-1.301-.058-1.708-.072-5.025-.072zm-.001 2.164c3.257 0 3.64.012 4.928.07 1.19.054 1.837.252 2.267.42.57.221.978.485 1.405.912.427.427.691.835.912 1.405.168.43.366 1.077.42 2.267.058 1.288.07 1.671.07 4.928s-.012 3.64-.07 4.928c-.054 1.19-.252 1.837-.42 2.267-.221.57-.485.978-.912 1.405-.427.427-.835.691-1.405.912-.43.168-1.077.366-2.267.42-1.288.058-1.671.07-4.928.07s-3.64-.012-4.928-.07c-1.19-.054-1.837-.252-2.267-.42-.57-.221-.978-.485-1.405-.912-.427-.427-.691-.835-.912-1.405-.168-.43-.366-1.077-.42-2.267C2.175 15.902 2.163 15.519 2.163 12.262s.012-3.64.07-4.928c.054-1.19.252-1.837.42-2.267.221-.57.485-.978.912-1.405.427-.427.835-.691 1.405-.912.43-.168 1.077-.366 2.267-.42 1.288-.058 1.671-.07 4.928-.07z" />
                    <path d="M12.053 5.838a6.424 6.424 0 1 0 0 12.849 6.424 6.424 0 0 0 0-12.849zm0 10.595a4.171 4.171 0 1 1 0-8.343 4.171 4.171 0 0 1 0 8.343z" />
                    <circle cx="18.406" cy="5.595" r="1.5" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
