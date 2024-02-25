import React from 'react'
import "./Navbar.css"
import { Link } from 'react-router-dom'


const Navbar = () => {

  const isAuthToken = localStorage.getItem('auth-token');

  
  return (
    <div className='navbar'>
        
       
        {isAuthToken && <Link to="/pdf" className='link'><button className='home-btn'>Home</button></Link>}
          <div className='links'>
          {localStorage.getItem("auth-token")
              ? <button onClick={()=>{localStorage.removeItem("auth-token"); 
              localStorage.removeItem("user-email"); window.location.replace("/")} } className='login-button'>Logout</button>  : 
              
            <Link to="/login">  <button className='login-button'>Login</button></Link> 
          }
          </div>
        
        
    </div>
  )
}

export default Navbar