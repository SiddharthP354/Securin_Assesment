import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function Signup() {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      alert("Please fill all fields")
      return
    }

    // After successful validation
    navigate('/login')
  }

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>

      <form className="auth-form" onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Name :<input type="text" value={name} onChange={(e) => setName(e.target.value)} required/></label>
        </div>

        <div className="form-group">
          <label>Email : <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        </div>

        <div className="form-group">
          <label>Password : <input  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /> </label>
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>

      </form>

      <div className="auth-link">
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  )
}