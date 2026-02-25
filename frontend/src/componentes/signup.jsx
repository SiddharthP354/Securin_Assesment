import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import '../styles/auth.css'

export default function signup() {
  const navigate = useNavigate()
  return (
    <div className="auth-container">
        <h1>Sign Up</h1>
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
                <label>Name :<input type="text" id="name" required /></label>
            </div>
            <div className="form-group">
                <label>Email : <input type="email" id="email" required /></label>
            </div>
            <div className="form-group">
                <label>Password : <input type="password" id="password" required /></label>
            </div>
            
            <button type="submit" className="submit-btn" onClick={() => navigate('/login')}>Sign Up</button>
        </form>
        <div className="auth-link">
            <Link to="/login">Already have an account? Login</Link>
        </div>
    </div>
  )
}


