import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container py-5 text-center">
        <h1 className="fw-bold mb-3">Prepare. Apply. Get Placed.</h1>
        <p className="text-muted mb-4">
          Track your skills, applications, coding practice and interview prep — all in one dashboard.
        </p>
        <Link to="/register" className="btn pt-btn-primary text-white me-2">
          Get Started
        </Link>
        <Link to="/about" className="btn btn-outline-secondary">
          Learn More
        </Link>
      </div>
    </>
  )
}
