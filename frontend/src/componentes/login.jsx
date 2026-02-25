import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import '../styles/auth.css'

export default function login() {
  const navigate = useNavigate()
  return (
    <div className="auth-container">
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label>Email : <input type="email" id="email" required /></label>
            </div>
            <div className="form-group">
                <label>Password : <input type="password" id="password" required /></label>
            </div>
            <button type="submit" className="submit-btn" onClick={() => navigate('/dashboard')}>Login</button>
        </form>
        <div className="auth-link">
            <Link to="/">Don't have an account? Sign Up</Link>
        </div>
    </div>
  )
}


