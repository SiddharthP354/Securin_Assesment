import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function Login() {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    if (!email || !password) {
      alert("Please fill all fields")
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email :
            <input type="email" id="email" required />
          </label>
        </div>

        <div className="form-group">
          <label>Password :
            <input type="password" id="password" required />
          </label>
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>

      <div className="auth-link">
        <Link to="/">Don't have an account? Sign Up</Link>
      </div>
    </div>
  )
}