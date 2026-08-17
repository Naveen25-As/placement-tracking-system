import React from 'react'
import Navbar from '../components/Navbar.jsx'

export default function About() {
  return (
    <>
      <Navbar />
      <div className="container py-5" style={{ maxWidth: 720 }}>
        <h2 className="fw-bold mb-3">About Placement Tracker</h2>
        <p className="text-muted">
          Placement Tracker is a full-stack platform built with React and Spring Boot that helps
          college students organize every part of their placement preparation: profile and skills,
          job applications, coding practice, aptitude tests, interview experiences, and daily
          preparation tasks — with an admin panel for placement coordinators to manage companies,
          jobs, and preparation resources.
        </p>
      </div>
    </>
  )
}
